import { useTheme } from "@/contexts/ThemeContext";
import Header from "@/Headers/Header";
import {
  SessionConfigSection,
  ParticipantsSection,
  TargetsSection,
  EngagementsSection,
  SummarySection,
  ProgressIndicator,
} from "../components/SessionStatsFull/sections";
import { useSessionStats } from "../components/SessionStatsFull/useSessionStats";

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
    <div className={`min-h-screen  flex flex-col  gap${theme === "dark" ? "dark bg-[#121212]" : "bg-gray-100"}`}>
      <Header />
      <ProgressIndicator sections={sections} activeSection={activeSection} getSectionValidationStatus={getSectionValidationStatus} />

      <div
        className="max-w-6xl mx-auto px-4 py-4 lg:py-12 space-y-24 snap-y snap-mandatory h-[calc(100vh-5rem)] overflow-y-auto scroll-smooth"
        onScroll={handleScroll}
      >
        <SessionConfigSection
          section={sections[0]}
          sessionData={sessionData}
          updateSessionData={updateSessionData}
          trainingAssignments={trainingAssignments}
        />

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

        <TargetsSection section={sections[2]} targets={targets} addTarget={addTarget} updateTarget={updateTarget} removeTarget={removeTarget} />

        <EngagementsSection section={sections[3]} targets={targets} participants={participants} updateEngagement={updateEngagement} />

        <SummarySection
          section={sections[4]}
          participants={participants}
          targets={targets}
          validationErrors={validationErrors}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
