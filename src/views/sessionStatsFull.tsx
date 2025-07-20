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

export default function ImprovedSessionStats() {
  const { theme } = useTheme();

  const {
    // State
    activeSection,
    sessionData,
    participants,
    targets,
    validationErrors,
    sections,

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
  } = useSessionStats();

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-[#0a0a0a]" : "bg-gray-50"} relative`}>
      {/* Progress Indicator - Fixed on larger screens, hidden on mobile */}
      <div className="hidden lg:block">
        <ScrollProgress activeSection={activeSection} totalSections={sections.length} />
      </div>

      {/* Mobile Progress Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-sm">
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
        <div className="px-4 py-2 text-center">
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400">{sections[activeSection]?.title}</p>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="w-full h-screen overflow-y-auto snap-y snap-mandatory scroll-smooth pt-12 lg:pt-0" onScroll={handleScroll}>
        {/* Section 1: Session Configuration */}
        <section className="min-h-screen snap-start flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-4xl">
            <SessionConfigSection
              section={sections[0]}
              sessionData={sessionData}
              updateSessionData={updateSessionData}
              trainingAssignments={trainingAssignments}
            />
          </div>
        </section>

        {/* Section 2: Participants */}
        <section className="min-h-screen snap-start flex items-center justify-center px-4 sm:px-6 lg:px-8">
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
        <section className="min-h-screen snap-start flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-4xl">
            <TargetsSection section={sections[2]} targets={targets} addTarget={addTarget} updateTarget={updateTarget} removeTarget={removeTarget} />
          </div>
        </section>

        {/* Section 4: Engagements */}
        <section className="min-h-screen snap-start flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-4xl">
            <EngagementsSection section={sections[3]} targets={targets} participants={participants} updateEngagement={updateEngagement} />
          </div>
        </section>

        {/* Section 5: Summary */}
        <section className="min-h-screen snap-start flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-4xl">
            <SummarySection
              section={sections[4]}
              participants={participants}
              targets={targets}
              validationErrors={validationErrors}
              handleSubmit={handleSubmit}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
