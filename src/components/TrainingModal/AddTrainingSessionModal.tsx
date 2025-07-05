import { useState } from "react";
import { supabase } from "@/services/supabaseClient";
import { userStore } from "@/store/userStore";
import { User } from "@/types/user";
import BasicInfoSection from "@/components/TrainingModal/AddTrainingSessionModalBasicInfo";
import AssignmentsSection from "@/components/TrainingModal/AddTrainingSessionModalAssignments";
import TeamMembersSection from "@/components/TrainingModal/AddTrainingSessionModalMembers";
import { useStore } from "zustand";
import { TrainingStore } from "@/store/trainingStore";
import { Assignment, TrainingSession, TrainingStatus } from "@/types/training";
import { useModal } from "@/hooks/useModal";
import { toastService } from "@/services/toastService";
import BaseMobileDrawer from "@/components/BaseDrawer/BaseMobileDrawer";
import BaseDesktopDrawer from "@/components/BaseDrawer/BaseDesktopDrawer";
import { isMobile } from "react-device-detect";
import { useTheme } from "@/contexts/ThemeContext";
import { embedTraining } from "@/services/embeddingService";
import { useStore as useZustandStore } from "zustand";
import { weaponsStore } from "@/store/weaponsStore";

export default function TrainingAddTrainingSessionModal({
  isOpen,
  onClose,
  onSuccess,
  teamMembers,
  assignments,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  teamMembers: User[];
  assignments: Assignment[];
}) {
  const [sessionName, setSessionName] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [members, setMembers] = useState<string[]>([]);
  const [assignmentIds, setAssignmentIds] = useState<string[]>([]);
  const { theme } = useTheme();

  const { isOpen: isAddAssignmentOpen, setIsOpen: setIsAddAssignmentOpen } = useModal();
  const { loadAssignments, createAssignment } = useStore(TrainingStore);
  const { user } = useStore(userStore);
  const { weapons } = useZustandStore(weaponsStore);

  const handleSetStatus = async () => {
    if (date && date < new Date().toISOString()) {
      return TrainingStatus.Finished;
    }
    return TrainingStatus.Scheduled;
  };

  async function handleSubmit() {
    if (!user?.team_id) return alert("Missing team ID");

    // Validation: Check if user has squad_id, weapons, and assignments
    if (!user?.squad_id) {
      toastService.error("Cannot create training: User must be assigned to a squad");
      return;
    }

    if (!weapons || weapons.length === 0) {
      toastService.error("Cannot create training: No weapons assigned to the team");
      return;
    }

    if (!assignments || assignments.length === 0) {
      toastService.error("Cannot create training: No assignments available for the team");
      return;
    }

    if (date) {
      handleSetStatus();
    }
    const { data: newTraining, error: sessionError } = await supabase
      .from("training_session")
      .insert([
        {
          creator_id: user.id,
          session_name: sessionName,
          location,
          date: new Date(date).toISOString(),
          team_id: user.team_id,
        },
      ])
      .select("*")
      .maybeSingle();

    await embedTraining(newTraining as TrainingSession, newTraining?.id || "");

    toastService.success("Training session created successfully");

    if (sessionError || !newTraining?.id) {
      console.error("Error creating training session:", sessionError);
      return alert("Failed to create training session.");
    }

    const trainingId = newTraining.id;

    if (members.length > 0) {
      const participants = members.map((memberId) => ({
        training_id: trainingId,
        participant_id: memberId,
      }));

      const { error: participantsError } = await supabase.from("trainings_participants").insert(participants);

      if (participantsError) {
        console.error("Adding participants failed:", participantsError);
        return alert("Training created, but adding participants failed.");
      }
    }

    if (assignmentIds.length) {
      const assignmentData = assignmentIds.map((assignmentId) => ({
        training_id: trainingId,
        assignment_id: assignmentId,
      }));

      const { error: assignmentError } = await supabase.from("assignment_session").insert(assignmentData);

      if (assignmentError) {
        console.error("Assigning training assignments failed:", assignmentError);
        toastService.error("Assigning training assignments failed");
      }
    }

    onSuccess();
    onClose();
  }

  const handleAddAssignment = async (assignmentName: string) => {
    const { id } = await createAssignment(assignmentName, true);
    setAssignmentIds((prev) => {
      const next = [...prev, id];
      return next;
    });
    await loadAssignments();
    setIsAddAssignmentOpen(false);
  };

  const Content = (
    <>
      <div className={`border-b pb-4 w-full transition-colors duration-200 ${theme === "dark" ? "border-white/10" : "border-gray-200"}`}>
        <p className={`mt-1 text-sm transition-colors duration-200 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
          Plan a session, select assignments, and assign team members to participate.
        </p>
      </div>

      {(!user?.squad_id || !weapons?.length || !assignments?.length) && (
        <div className={`p-4 rounded-lg border transition-colors duration-200 ${
          theme === "dark" ? "bg-red-900/20 border-red-800/50 text-red-400" : "bg-red-50 border-red-200 text-red-700"
        }`}>
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium">Cannot Create Training</h3>
              <div className="mt-2 text-sm">
                <p>The following requirements are missing:</p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  {!user?.squad_id && <li>User must be assigned to a squad</li>}
                  {!weapons?.length && <li>Team must have weapons assigned</li>}
                  {!assignments?.length && <li>Team must have assignments available</li>}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 mt-4">
        <div>
          <BasicInfoSection
            sessionName={sessionName}
            setSessionName={setSessionName}
            location={location}
            setLocation={setLocation}
            date={date}
            setDate={setDate}
          />
          <div className="mt-6 space-y-6">
            <AssignmentsSection
              assignments={assignments}
              assignmentIds={assignmentIds}
              setAssignmentIds={setAssignmentIds}
              handleAddAssignment={handleAddAssignment}
              isAddAssignmentOpen={isAddAssignmentOpen}
              setIsAddAssignmentOpen={setIsAddAssignmentOpen}
            />
            <TeamMembersSection teamMembers={teamMembers} members={members} setMembers={setMembers} />
          </div>
        </div>
      </div>

      <div
        className={`flex items-center justify-end gap-x-4 pt-4 border-t mt-4 text-sm transition-colors duration-200 ${
          theme === "dark" ? "border-white/10" : "border-gray-200"
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          className={`px-4 py-1.5 transition-colors rounded-md text-sm font-medium ${
            theme === "dark" ? "bg-white/5 hover:bg-white/10 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }`}
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={!sessionName || !location || !date || !user?.squad_id || !weapons?.length || !assignments?.length}
          className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 transition-colors rounded-md text-sm font-medium text-white shadow-sm disabled:cursor-not-allowed"
        >
          Create Session
        </button>
      </div>
    </>
  );

  return isMobile ? (
    <BaseMobileDrawer title="New Training Session" isOpen={isOpen} setIsOpen={onClose}>
      {Content}
    </BaseMobileDrawer>
  ) : (
    <BaseDesktopDrawer title="New Training Session" isOpen={isOpen} width="600px" setIsOpen={onClose}>
      {Content}
    </BaseDesktopDrawer>
  );
}
