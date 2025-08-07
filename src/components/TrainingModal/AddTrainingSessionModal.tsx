import { useEffect, useState } from "react";
import { supabase } from "@/services/supabaseClient";
import { userStore } from "@/store/userStore";
import BasicInfoSection from "@/components/TrainingModal/AddTrainingSessionModalBasicInfo";
import AssignmentsSection from "@/components/TrainingModal/AddTrainingSessionModalAssignments";
import { useStore } from "zustand";
import { TrainingStore } from "@/store/trainingStore";
import { Assignment, TrainingStatus } from "@/types/training";
import { useModal } from "@/hooks/useModal";
import { toastService } from "@/services/toastService";
import BaseMobileDrawer from "@/components/BaseDrawer/BaseMobileDrawer";
import BaseDesktopDrawer from "@/components/BaseDrawer/BaseDesktopDrawer";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useTheme } from "@/contexts/ThemeContext";
import { weaponsStore } from "@/store/weaponsStore";
import { insertAssignment } from "@/services/trainingService";
import { validateTrainingForm } from "@/lib/formValidation";
import { AlertTriangle, Plus } from "lucide-react";

export default function TrainingAddTrainingSessionModal({
  isOpen,
  onClose,
  onSuccess,
  assignments,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  assignments: Assignment[];
}) {
  const [sessionName, setSessionName] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [assignmentIds, setAssignmentIds] = useState<string[]>([]);
  const [error, setError] = useState("");
  const { theme } = useTheme();
  const isMobile = useIsMobile();

  const { isOpen: isAddAssignmentOpen, setIsOpen: setIsAddAssignmentOpen } = useModal();
  const { loadAssignments } = useStore(TrainingStore);
  const { user } = useStore(userStore);
  const { weapons } = useStore(weaponsStore);

  useEffect(() => {
    if (isOpen) {
      setAssignmentIds([]);
      setSessionName("");
      setLocation("");
      setDate("");
    }
  }, [isOpen]);

  const handleSetStatus = async () => {
    if (date && date < new Date().toISOString()) {
      return TrainingStatus.Finished;
    }
    return TrainingStatus.Scheduled;
  };

  async function handleSubmit() {
    if (!user?.team_id) return alert("Missing team ID");

    setError("");

    const validationError = validateTrainingForm({
      session_name: sessionName,
      location,
      date,
      assignmentIds,
    });

    if (validationError) {
      setError(validationError);
      return;
    }

    if (!weapons || weapons.length === 0) {
      setError("Cannot create training: No weapons assigned to the team");
      return;
    }

    if (!assignments || assignments.length === 0) {
      setError("Cannot create training: No assignments available for the team");
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
          team_id: user?.team_id,
        },
      ])
      .select("*")
      .maybeSingle();

    toastService.success("Training session created successfully");

    if (sessionError || !newTraining?.id) {
      console.error("Error creating training session:", sessionError);
      return alert("Failed to create training session.");
    }

    const trainingId = newTraining.id;

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
  }

  const handleAddAssignment = async (assignmentName: string) => {
    const { id } = await insertAssignment(assignmentName, user?.team_id || "");
    setAssignmentIds((prev) => {
      const next = [...prev, id];
      return next;
    });
    await loadAssignments();
    setIsAddAssignmentOpen(false);
  };

  // Reset form fields when closing the modal
  const handleClose = () => {
    setAssignmentIds([]);
    setSessionName("");
    setLocation("");
    setDate("");
    onClose();
  };

  const Content = (
    <div className="flex flex-col h-full">
      {/* Header description */}
      <div className={`pb-4 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
        <p className="text-sm leading-relaxed">Schedule a new training session with assignments and team members.</p>
      </div>

      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {error && (
          <div
            className={`p-3 rounded-lg text-sm mb-4 flex items-start gap-2 ${
              theme === "dark" ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {(!weapons?.length || !assignments?.length) && (
          <div
            className={`p-4 rounded-lg mb-4 ${
              theme === "dark" ? "bg-orange-500/10 border border-orange-500/20" : "bg-orange-50 border border-orange-200"
            }`}
          >
            <div className="flex items-start gap-3">
              <AlertTriangle size={20} className={theme === "dark" ? "text-orange-400 mt-0.5" : "text-orange-600 mt-0.5"} />
              <div className="flex-1">
                <h3 className={`text-sm font-semibold mb-1 ${theme === "dark" ? "text-orange-300" : "text-orange-800"}`}>Requirements Missing</h3>
                <ul className="text-sm space-y-1">
                  {!weapons?.length && (
                    <li className={theme === "dark" ? "text-orange-400/80" : "text-orange-700"}>• Team must have weapons assigned</li>
                  )}
                  {!assignments?.length && (
                    <li className={theme === "dark" ? "text-orange-400/80" : "text-orange-700"}>• Team must have assignments available</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
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
            handleAddAssignment={handleAddAssignment}
            isAddAssignmentOpen={isAddAssignmentOpen}
            setIsAddAssignmentOpen={setIsAddAssignmentOpen}
          />
        </div>
      </div>

      {/* Fixed footer */}
      <div className={`flex items-center justify-end gap-3 pt-4 mt-6 border-t ${theme === "dark" ? "border-zinc-800" : "border-gray-200"}`}>
        <button
          type="button"
          onClick={handleClose}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            theme === "dark" ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-300" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }`}
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={!sessionName || !location || !date || !weapons?.length || !assignments?.length}
          className={`
            px-4 py-2 rounded-lg text-sm font-medium transition-all
            flex items-center gap-2
            ${
              theme === "dark"
                ? "bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/30 text-white"
                : "bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white"
            }
            disabled:cursor-not-allowed
          `}
        >
          <Plus size={16} />
          Create Session
        </button>
      </div>
    </div>
  );

  return isMobile ? (
    <BaseMobileDrawer title="New Training Session" isOpen={isOpen} setIsOpen={onClose} onClose={onClose}>
      {Content}
    </BaseMobileDrawer>
  ) : (
    <BaseDesktopDrawer title="New Training Session" isOpen={isOpen} setIsOpen={onClose} onClose={onClose}>
      {Content}
    </BaseDesktopDrawer>
  );
}
