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
import { useEffect } from "react";
import { weaponsStore } from "@/store/weaponsStore";
import { equipmentStore } from "@/store/equipmentStore";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ImprovedSessionStats() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { getWeapons } = useStore(weaponsStore);
  const { getEquipments } = useStore(equipmentStore);

  const { training, createAssignment, loadTrainingById } = useStore(TrainingStore);
  const {
    // State
    activeSection,
    sessionData,
    participants,
    targets,
    validationErrors,
    sections,
    isSubmitting,
    // Data
    user,
    weapons,
    equipments,
    teamMembers,
    trainingAssignments,
    // Methods
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
  } = useSessionStats();

  useEffect(() => {
    (async () => {
      if (user?.team_id) {
        await getWeapons(user?.team_id as string);
        await getEquipments(user?.team_id as string);
      }
    })();
  }, [training?.team_id]);

  async function onSuccessAddAssignment(assignmentName: string) {
    const res = await createAssignment(assignmentName, true, training?.id as string);
    if (res) {
      updateSessionData("assignment_id", res?.id);
      loadTrainingById(training?.id as string);
      setIsAssignmentModalOpen(false);
    }
    setIsAssignmentModalOpen(false);
  }

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-[#0a0a0a]" : "bg-white"} relative`}>
      {/* Progress Indicator - Fixed on larger screens, hidden on mobile */}
      <div className="hidden lg:block">
        <ScrollProgress activeSection={activeSection} totalSections={sections.length} />
      </div>

      {/* Mobile Progress Bar with Navigation */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50  dark:bg-black/95 backdrop-blur-sm shadow-md">
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
        <div className="px-4 py-3 flex items-center justify-between gap-4" onClick={() => navigate(`/training/${training?.id}`)}>
          <div className="flex items-center gap-2">
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

      {/* Main Content Container */}
      <div className="w-full h-screen overflow-y-auto snap-y snap-mandatory scroll-smooth lg:pt-0 " onScroll={handleScroll}>
        {/* Section 1: Session Configuration */}
        <section className="min-h-screen snap-start flex py-16 justify-center px-4 sm:px-6 lg:px-8 ">
          <div className="w-full max-w-4xl  py-8">
            <SessionConfigSection
              section={sections[0]}
              sessionData={sessionData}
              updateSessionData={updateSessionData}
              trainingAssignments={trainingAssignments}
              setIsAssignmentModalOpen={setIsAssignmentModalOpen}
            />
          </div>
        </section>

        {/* Section 2: Participants */}
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
            />
          </div>
        </section>

        {/* Section 3: Targets */}
        <section className="min-h-screen snap-start flex py-16 justify-center px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-4xl">
            <TargetsSection section={sections[2]} targets={targets} addTarget={addTarget} updateTarget={updateTarget} removeTarget={removeTarget} />
          </div>
        </section>

        {/* Section 4: Engagements */}
        <section className="min-h-screen snap-start flex py-16 justify-center px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-4xl">
            <EngagementsSection section={sections[3]} targets={targets} participants={participants} updateEngagement={updateEngagement} />
          </div>
        </section>

        {/* Section 5: Summary */}
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
    </div>
  );
}
