import BaseModal from "./BaseModal";
import { useState } from "react";
import { supabase } from "@/services/supabaseClient";
import { userStore } from "@/store/userStore";
import { User } from "@/types/user";
import { Assignment } from "@/types/training";
import BasicInfoSection from "./AddTrainingSessionModalBasicInfo";
import AssignmentsSection from "./AddTrainingSessionModalAssignments";
import TeamMembersSection from "./AddTrainingSessionModalMembers";
import PreviewSection from "./AddTrainingSessionModalPreview";

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

  async function handleSubmit() {
    const user = userStore.getState().user;
    if (!user?.team_id) return alert("Missing team ID");

    const { data: newTraining, error: sessionError } = await supabase
      .from("training_sessions")
      .insert([
        {
          session_name: sessionName,
          location,
          date: new Date(date).toISOString(),
          team_id: user.team_id,
        },
      ])
      .select("id")
      .maybeSingle();

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
        console.error("adding participants failed:", participantsError);
        return alert("Training created, but adding participants failed.");
      }
    }

    if (assignmentIds.length) {
      const assignmentData = assignmentIds.map((assignmentId) => ({
        training_id: trainingId,
        assignment_id: assignmentId,
      }));

      const { error: assignmentError } = await supabase.from("assignments_trainings").insert(assignmentData);

      if (assignmentError) {
        console.error("Assigning training assignments failed:", assignmentError);
        return alert("Training created, but assignment linking failed.");
      }
    }

    resetForm();
    onSuccess();
    onClose();
  }

  const resetForm = () => {
    setSessionName("");
    setLocation("");
    setDate("");
    setMembers([]);
    setAssignmentIds([]);
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <div className="border-b border-white/10 pb-4 w-full">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">New Training Session</h2>
        </div>
        <p className="mt-1 text-sm text-gray-400">Plan a session, select assignments, and assign team members to participate.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 mt-4">
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
            <AssignmentsSection assignments={assignments} assignmentIds={assignmentIds} setAssignmentIds={setAssignmentIds} />
            <TeamMembersSection teamMembers={teamMembers} members={members} setMembers={setMembers} />
          </div>
        </div>

        {/* <PreviewSection
          sessionName={sessionName}
          location={location}
          date={date}
          assignments={assignments}
          assignmentIds={assignmentIds}
          teamMembers={teamMembers}
          members={members}
        /> */}
      </div>

      <div className="flex items-center justify-end gap-x-4 pt-4 border-t border-white/10 mt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-1.5 bg-white/5 hover:bg-white/10 transition-colors rounded-md text-sm font-medium text-white"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={!sessionName || !location || !date}
          className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 transition-colors rounded-md text-sm font-medium text-white shadow-sm disabled:cursor-not-allowed"
        >
          Create Session
        </button>
      </div>
    </BaseModal>
  );
}
