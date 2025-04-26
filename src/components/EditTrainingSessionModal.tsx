import BaseModal from "./BaseModal";
import { useState, useEffect } from "react";
import { supabase } from "@/services/supabaseClient";
import { User } from "@/types/user";
import { Assignment, TrainingSession } from "@/types/training";
import BasicInfoSection from "./AddTrainingSessionModalBasicInfo";
import AssignmentsSection from "./AddTrainingSessionModalAssignments";
import TeamMembersSection from "./AddTrainingSessionModalMembers";
import PreviewSection from "./AddTrainingSessionModalPreview";

type EditTrainingSessionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  teamMembers: User[];
  assignments: Assignment[];
  training: TrainingSession | null;
};

export default function EditTrainingSessionModal({ isOpen, onClose, onSuccess, teamMembers, assignments, training }: EditTrainingSessionModalProps) {
  const [sessionName, setSessionName] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [members, setMembers] = useState<string[]>([]);
  const [assignmentIds, setAssignmentIds] = useState<string[]>([]);

  useEffect(() => {
    if (training) {
      setSessionName(training.session_name);
      setLocation(training.location);
      const trainingDate = new Date(training.date);
      const formattedDate = trainingDate.toISOString().slice(0, 16);
      setDate(formattedDate);
      setMembers(training.participants?.map((p) => p.participant_id) || []);
      setAssignmentIds(training.training_assignments?.map((a) => a.assignment.id) || []);
    }
  }, [training]);

  async function handleSubmit() {
    if (!training?.id) return;

    const { error: sessionError } = await supabase
      .from("training_sessions")
      .update({
        session_name: sessionName,
        location,
        date: new Date(date).toISOString(),
      })
      .eq("id", training.id);

    if (sessionError) {
      console.error("Error updating training session:", sessionError);
      return alert("Failed to update training session.");
    }

    if (members.length > 0) {
      await supabase.from("trainings_participants").delete().eq("training_id", training.id);

      const participants = members.map((memberId) => ({
        training_id: training.id,
        participant_id: memberId,
      }));

      const { error: participantsError } = await supabase.from("trainings_participants").insert(participants);

      if (participantsError) {
        console.error("Updating participants failed:", participantsError);
        return alert("Training updated, but assigning participants failed.");
      }
    }

    if (assignmentIds.length) {
      await supabase.from("assignments_trainings").delete().eq("training_id", training.id);

      const assignmentData = assignmentIds.map((assignmentId) => ({
        training_id: training.id,
        assignment_id: assignmentId,
      }));

      const { error: assignmentError } = await supabase.from("assignments_trainings").insert(assignmentData);

      if (assignmentError) {
        console.error("Updating training assignments failed:", assignmentError);
        return alert("Training updated, but assignment linking failed.");
      }
    }

    onSuccess();
    onClose();
  }

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} width="max-w-6xl">
      {/* Header Section */}
      <div className="border-b border-white/10 pb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Edit Training Session</h2>
          <div className="bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full text-xs font-medium">Editing</div>
        </div>
        <p className="mt-1 text-sm text-gray-400">Update session details, assignments, and participants.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
        {/* Left Column - Form Sections */}
        <div>
          <BasicInfoSection
            sessionName={sessionName}
            setSessionName={setSessionName}
            location={location}
            setLocation={setLocation}
            date={date}
            setDate={setDate}
          />

          <AssignmentsSection assignments={assignments} assignmentIds={assignmentIds} setAssignmentIds={setAssignmentIds} />

          <TeamMembersSection teamMembers={teamMembers} members={members} setMembers={setMembers} />
        </div>

        {/* Right Column - Preview */}
        <PreviewSection
          sessionName={sessionName}
          location={location}
          date={date}
          assignments={assignments}
          assignmentIds={assignmentIds}
          teamMembers={teamMembers}
          members={members}
        />
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
          Save Changes
        </button>
      </div>
    </BaseModal>
  );
}
