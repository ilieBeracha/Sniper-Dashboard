import { useMemo } from "react";
import { TrainingSession } from "@/types/training";
import { TrainingSessionCard } from "../TrainingSessionCard";
import { TrainingSessionCardSelectable } from "../TrainingSessionCard/TrainingSessionCardSelectable";
import TrainingSessionGroup from "../TrainingSessionGroup";
import TrainingCalendar from "../TrainingCalendar";
import TrainingListEmpty from "../TrainingListEmpty";
import { filterTrainingsByDate } from "@/utils/trainingFilters";
import { primitives } from "@/styles/core";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Checkbox } from "@/components/ui/checkbox";

interface TrainingListEnhancedProps {
  trainings: TrainingSession[];
  isSelectionMode?: boolean;
  selectedSessions?: string[];
  onSelectionChange?: (sessionId: string, isSelected: boolean) => void;
  onSelectAll?: (isSelected: boolean) => void;
}

export default function TrainingListEnhanced({ 
  trainings, 
  isSelectionMode = false,
  selectedSessions = [],
  onSelectionChange,
  onSelectAll,
}: TrainingListEnhancedProps) {
  const isMobile = useIsMobile();
  const { todaySessions, upcoming, past } = useMemo(
    () => filterTrainingsByDate(trainings),
    [trainings]
  );
  const today = new Date();

  // Check if all trainings are selected
  const areAllSelected = useMemo(() => {
    if (trainings.length === 0) return false;
    return trainings.every(t => t.id && selectedSessions.includes(t.id));
  }, [trainings, selectedSessions]);

  const handleSelectAllChange = (checked: boolean) => {
    onSelectAll?.(checked);
  };

  // Render a single session with proper selection handling
  const renderSession = (session: TrainingSession, highlight?: boolean, showDate?: boolean) => {
    if (!session.id) return null;

    if (isSelectionMode) {
      return (
        <TrainingSessionCardSelectable
          key={session.id}
          session={session}
          highlight={highlight}
          showDate={showDate}
          isSelectable={true}
          isSelected={selectedSessions.includes(session.id)}
          onSelectionChange={onSelectionChange}
        />
      );
    }

    return (
      <TrainingSessionCard
        key={session.id}
        session={session}
        highlight={highlight}
        showDate={showDate}
      />
    );
  };

  // Mobile view
  if (isMobile) {
    return (
      <div className="space-y-4">
        {trainings.length === 0 && <TrainingListEmpty />}

        {isSelectionMode && trainings.length > 0 && (
          <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <Checkbox
              checked={areAllSelected}
              onCheckedChange={handleSelectAllChange}
            />
            <span className="text-sm font-medium">
              Select All ({trainings.length} sessions)
            </span>
          </div>
        )}

        {todaySessions.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-green-600 dark:text-green-400">Today</h3>
            {todaySessions.map(session => renderSession(session, true, false))}
          </div>
        )}

        {upcoming.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400">Upcoming</h3>
            {upcoming.map(session => renderSession(session))}
          </div>
        )}

        {past.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400">Past Sessions</h3>
            {past.map(session => renderSession(session))}
          </div>
        )}
      </div>
    );
  }

  // Desktop view
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

          {isSelectionMode && trainings.length > 0 && (
            <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Checkbox
                checked={areAllSelected}
                onCheckedChange={handleSelectAllChange}
              />
              <span className="text-sm font-medium">
                Select All Sessions ({trainings.length} total)
              </span>
            </div>
          )}

          {todaySessions.length > 0 && (
            <TrainingSessionGroup title="Today" color="green" date={today}>
              {todaySessions.map(s => renderSession(s, true, false))}
            </TrainingSessionGroup>
          )}

          {upcoming.length > 0 && (
            <TrainingSessionGroup title="Upcoming" color="blue">
              {upcoming.map(s => renderSession(s))}
            </TrainingSessionGroup>
          )}

          {past.length > 0 && (
            <TrainingSessionGroup title="Past Sessions" color="gray">
              {past.map(s => renderSession(s))}
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