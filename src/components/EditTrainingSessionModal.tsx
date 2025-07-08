import BaseModal from "./BaseModal";
import { useState, useEffect } from "react";
import { supabase } from "@/services/supabaseClient";
import { User } from "@/types/user";
import { Assignment, TrainingSession } from "@/types/training";
import BasicInfoSection from "./TrainingModal/AddTrainingSessionModalBasicInfo";
import AssignmentsSection from "./TrainingModal/AddTrainingSessionModalAssignments";
import BaseButton from "./BaseButton";

type EditTrainingSessionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  teamMembers: User[];
  assignments: Assignment[];
  training: TrainingSession | null;
};

export default function EditTrainingSessionModal({ isOpen, onClose, onSuccess, assignments, training }: EditTrainingSessionModalProps) {
  const [sessionName, setSessionName] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [assignmentIds, setAssignmentIds] = useState<string[]>([]);

  useEffect(() => {
    if (training) {
      setSessionName(training.session_name);
      setLocation(training.location);
      const trainingDate = new Date(training.date);
      const formattedDate = trainingDate.toISOString().slice(0, 16);
      setDate(formattedDate);
      setAssignmentIds(training.assignment_sessions?.map((a) => a.id) || []);
    }
  }, [training]);

  async function handleSubmit() {
    if (!training?.id) return;

    const { error: sessionError } = await supabase
      .from("training_session")
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

    if (assignmentIds.length) {
      await supabase.from("assignment_session").delete().eq("training_id", training.id);

      const assignmentData = assignmentIds.map((assignmentId) => ({
        training_id: training.id,
        assignment_id: assignmentId,
      }));

      const { error: assignmentError } = await supabase.from("assignment_session").insert(assignmentData);

      if (assignmentError) {
        console.error("Updating training assignments failed:", assignmentError);
        return alert("Training updated, but assignment linking failed.");
      }
    }

    onSuccess();
    onClose();
  }

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      {/* Header Section */}
      <div className="border-b border-white/10 pb-4 ">
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

          <AssignmentsSection
            assignments={assignments}
            assignmentIds={assignmentIds}
            setAssignmentIds={setAssignmentIds}
            handleAddAssignment={() => {}}
            isAddAssignmentOpen={false}
            setIsAddAssignmentOpen={() => {}}
          />

          {/* <TeamMembersSection teamMembers={teamMembers} members={members} setMembers={setMembers} /> */}
        </div>
      </div>

      <div className="flex items-center justify-end gap-x-4 pt-4 border-t border-white/10 mt-4">
        <BaseButton
          type="button"
          onClick={onClose}
          className="px-4 py-1.5 bg-white/5 hover:bg-white/10 transition-colors rounded-md text-sm font-medium text-white"
        >
          Cancel
        </BaseButton>
        <BaseButton onClick={handleSubmit} disabled={!sessionName || !location || !date}>
          Save Changes
        </BaseButton>
      </div>
    </BaseModal>
  );
}
