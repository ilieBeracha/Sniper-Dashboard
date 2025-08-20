import { TrainingSession } from "@/types/training";
import { TrainingSessionCard } from "./TrainingSessionCard";
import TrainingSessionGroup from "./TrainingSessionGroup";
import TrainingCalendar from "./TrainingCalendar";
import TrainingListEmpty from "./TrainingListEmpty";
import { filterTrainingsByDate } from "@/utils/trainingFilters";
import { primitives } from "@/styles/core";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Checkbox } from "@/components/ui/checkbox";

interface TrainingListWithSelectionProps {
  trainings: TrainingSession[];
  selectedSessions: string[];
  onSelectionChange: (sessionId: string, isSelected: boolean) => void;
  onSelectAll: (isSelected: boolean) => void;
  showSelection?: boolean;
}

export default function TrainingListWithSelection({ 
  trainings, 
  selectedSessions,
  onSelectionChange,
  onSelectAll,
  showSelection = false
}: TrainingListWithSelectionProps) {
  const isMobile = useIsMobile();

  const { todaySessions, upcoming, past } = filterTrainingsByDate(trainings);
  const today = new Date();

  const renderSessionWithCheckbox = (session: TrainingSession, highlight?: boolean, showDate?: boolean) => {
    if (!session.id) return null;
    const isSelected = selectedSessions.includes(session.id);
    
    return (
      <div key={session.id} className="flex items-start gap-3">
        {showSelection && (
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) => onSelectionChange(session.id, checked as boolean)}
            className="mt-4"
          />
        )}
        <div className="flex-1">
          <TrainingSessionCard session={session} highlight={highlight} showDate={showDate} />
        </div>
      </div>
    );
  };

  if (isMobile) {
    return (
      <div className="space-y-4">
        {trainings.length === 0 && <TrainingListEmpty />}

        {showSelection && trainings.length > 0 && (
          <div className="flex items-center gap-2 p-2">
            <Checkbox
              checked={selectedSessions.length === trainings.length && trainings.length > 0}
              onCheckedChange={(checked) => onSelectAll(checked as boolean)}
            />
            <span className="text-sm">Select All</span>
          </div>
        )}

        <div className="space-y-4">
          {todaySessions.map(session => renderSessionWithCheckbox(session, true, false))}
        </div>

        <div className="space-y-4">
          {upcoming.map(session => renderSessionWithCheckbox(session))}
        </div>

        <div className="space-y-4">
          {past.map(session => renderSessionWithCheckbox(session))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-6">
          {!trainings.length && (
            <div className="text-center h-80 flex flex-col items-center justify-center" style={{ color: primitives.grey.grey500 }}>
              <p className="text-lg font-medium">No trainings found</p>
              <p className="text-sm">You can create one</p>
            </div>
          )}

          {showSelection && trainings.length > 0 && (
            <div className="flex items-center gap-2 p-2">
              <Checkbox
                checked={selectedSessions.length === trainings.length && trainings.length > 0}
                onCheckedChange={(checked) => onSelectAll(checked as boolean)}
              />
              <span className="text-sm">Select All Sessions</span>
            </div>
          )}

          {todaySessions.length > 0 && (
            <TrainingSessionGroup title="Today" color="green" date={today}>
              {todaySessions.map(s => renderSessionWithCheckbox(s, true, false))}
            </TrainingSessionGroup>
          )}

          {upcoming.length > 0 && (
            <TrainingSessionGroup title="Upcoming" color="blue">
              {upcoming.map(s => renderSessionWithCheckbox(s))}
            </TrainingSessionGroup>
          )}

          {past.length > 0 && (
            <TrainingSessionGroup title="Past Sessions" color="gray">
              {past.map(s => renderSessionWithCheckbox(s))}
            </TrainingSessionGroup>
          )}
        </div>

        <div className="lg:col-span-4">
          <TrainingCalendar trainings={trainings} />
        </div>
      </div>
    </>
  );
}