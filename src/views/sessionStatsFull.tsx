import { useTheme } from "@/contexts/ThemeContext";
import {
  SessionConfigSection,
  ParticipantsSection,
  TargetsSection,
  EngagementsSection,
  SummarySection,
} from "../components/SessionStatsFull/sections";
import { useSessionStats } from "../components/SessionStatsFull/useSessionStats";
import { ScrollProgress } from "@/components/magicui/scroll-progress";
import AddAssignmentModal from "@/components/AddAssignmentModal";
import { useStore } from "zustand";
import { TrainingStore } from "@/store/trainingStore";
import { useEffect, useState, useCallback } from "react";
import { weaponsStore } from "@/store/weaponsStore";
import { equipmentStore } from "@/store/equipmentStore";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ConfirmLeaveModal from "../components/SessionStatsFull/ConfirmLeaveModal";

export default function ImprovedSessionStats() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { getWeapons } = useStore(weaponsStore);
  const { getEquipments } = useStore(equipmentStore);
  const [showConfirmLeave, setShowConfirmLeave] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);

  const { training, createAssignment, loadTrainingById } = useStore(TrainingStore);
  const {
    activeSection,
    sessionData,
    participants,
    targets,
    validationErrors,
    sections,
    isSubmitting,
    user,
    weapons,
    equipments,
    teamMembers,
    trainingAssignments,
    handleScroll,
    getSectionValidationStatus,
    updateSessionData,
    updateParticipant,
    addParticipant,
    addSquad,
    removeParticipant,
    addTarget,
    updateTarget,
    removeTarget,
    updateEngagement,
    handleSubmit,
    isAssignmentModalOpen,
    setIsAssignmentModalOpen,
    autoSyncPosition,
    setAutoSyncPosition,
    hasUnsavedChanges,
    isFormSubmitted,
    setHasUnsavedChanges,
    isLoading,
  } = useSessionStats();

  useEffect(() => {
    (async () => {
      if (user?.team_id && training?.team_id) {
        await getWeapons(user.team_id);
        await getEquipments(user.team_id);
      }
    })();
  }, [user?.team_id, training?.team_id, getWeapons, getEquipments]);

  const handleNavigation = useCallback(
    (path: string) => {
      if (hasUnsavedChanges && !isFormSubmitted) {
        setPendingNavigation(path);
        setShowConfirmLeave(true);
      } else {
        navigate(path);
      }
    },
    [hasUnsavedChanges, isFormSubmitted, navigate],
  );

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges && !isFormSubmitted) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges, isFormSubmitted]);

  async function onSuccessAddAssignment(assignmentName: string) {
    const res = await createAssignment(assignmentName, true, training?.id as string);
    if (res) {
      updateSessionData("assignment_id", res?.id);
      loadTrainingById(training?.id as string);
      setIsAssignmentModalOpen(false);
    }
    setIsAssignmentModalOpen(false);
  }

  // Show loading screen while data is being fetched
  if (isLoading || !training || !sections || sections.length === 0 || !sessionData || participants.length === 0) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === "dark" ? "bg-[#0a0a0a]" : "bg-white"}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Loading session data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={` ${theme === "dark" ? "bg-[#0a0a0a]" : "bg-white"} relative`}>
      <div className="hidden lg:block">
        <ScrollProgress activeSection={activeSection} totalSections={sections.length} />

        <button
          onClick={() => handleNavigation(`/training/${training?.id}`)}
          className={`fixed top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            theme === "dark" ? "bg-zinc-800/90 hover:bg-zinc-700 text-zinc-300" : "bg-white/90 hover:bg-gray-100 text-gray-700 shadow-md"
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to training</span>
        </button>
      </div>

      <div className="lg:hidden fixed top-0 left-0 right-0 z-50   backdrop-blur-sm shadow-md">
        <div className="flex h-1 bg-gray-200 dark:bg-gray-800">
          {sections.map((_, index) => (
            <div
              key={index}
              className={`flex-1 transition-all duration-300 ${
                index <= activeSection ? (getSectionValidationStatus(index) ? "bg-green-500" : "bg-indigo-500") : "bg-transparent"
              }`}
            />
          ))}
        </div>
        <div className="px-4 py-3 flex items-center justify-between gap-4" onClick={() => handleNavigation(`/training/${training?.id}`)}>
          <div className="flex items-center gap-2 cursor-pointer">
            <ArrowLeft className="w-4 h-4" />
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Back to training</p>
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Step {activeSection + 1} of {sections.length}
            </p>
          </div>
        </div>
      </div>

      <div className="w-full h-screen overflow-y-auto snap-y snap-mandatory scroll-smooth lg:pt-0 " onScroll={handleScroll}>
        <section className="min-h-screen snap-start flex py-16 justify-center px-4 sm:px-6 lg:px-8 ">
          <div className="w-full max-w-4xl">
            <SessionConfigSection
              section={sections[0]}
              sessionData={sessionData}
              updateSessionData={updateSessionData}
              trainingAssignments={trainingAssignments}
              setIsAssignmentModalOpen={setIsAssignmentModalOpen}
            />
          </div>
        </section>

        <section className="min-h-screen snap-start flex py-16 justify-center px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-4xl">
            <ParticipantsSection
              section={sections[1]}
              participants={participants}
              user={user}
              teamMembers={teamMembers}
              weapons={weapons}
              equipments={equipments}
              addSquad={addSquad}
              addParticipant={addParticipant}
              removeParticipant={removeParticipant}
              updateParticipant={updateParticipant}
              autoSyncPosition={autoSyncPosition}
              setAutoSyncPosition={setAutoSyncPosition}
            />
          </div>
        </section>

        <section className="min-h-screen snap-start flex py-16 justify-center px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-4xl">
            <TargetsSection section={sections[2]} targets={targets} addTarget={addTarget} updateTarget={updateTarget} removeTarget={removeTarget} />
          </div>
        </section>

        <section className="min-h-screen snap-start flex py-16 justify-center px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-4xl">
            <EngagementsSection section={sections[3]} targets={targets} participants={participants} updateEngagement={updateEngagement} />
          </div>
        </section>

        <section className="min-h-screen snap-start flex py-16 justify-center px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-4xl">
            <SummarySection
              section={sections[4]}
              participants={participants}
              targets={targets}
              isSubmitting={isSubmitting}
              validationErrors={validationErrors}
              handleSubmit={handleSubmit}
            />
          </div>
        </section>
      </div>
      <AddAssignmentModal isOpen={isAssignmentModalOpen} onClose={() => setIsAssignmentModalOpen(false)} onSuccess={onSuccessAddAssignment} />

      <ConfirmLeaveModal
        isOpen={showConfirmLeave}
        onClose={() => {
          setShowConfirmLeave(false);
          setPendingNavigation(null);
        }}
        onConfirm={() => {
          setShowConfirmLeave(false);
          setHasUnsavedChanges(false);
          if (pendingNavigation) {
            navigate(pendingNavigation);
          }
        }}
        hasUnsavedChanges={hasUnsavedChanges}
      />
    </div>
  );
}
