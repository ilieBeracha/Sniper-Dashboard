import { TrainingSession } from "@/types/training";
import { TrainingSessionCard } from "./TrainingSessionCard";
import TrainingSessionGroup from "./TrainingSessionGroup";
import TrainingCalendar from "./TrainingCalendar";
import TrainingSection from "./TrainingSection";
import TrainingListEmpty from "./TrainingListEmpty";
import { useTheme } from "@/contexts/ThemeContext";
import { filterTrainingsByDate } from "@/utils/trainingFilters";
import { primitives } from "@/styles/core";
import { useIsMobile } from "@/hooks/useIsMobile";

interface TrainingListProps {
  trainings: TrainingSession[];
}

export default function TrainingList({ trainings }: TrainingListProps) {
  const { theme } = useTheme();
  const isMobile = useIsMobile();

  const { todaySessions, upcoming, past } = filterTrainingsByDate(trainings);
  const today = new Date();

  return (
    <>
      {isMobile ? (
        <div className="space-y-4">
          {trainings.length === 0 && <TrainingListEmpty />}

          <TrainingSection title="Today" trainings={todaySessions} color="green" highlight={true} showDate={false} />

          <TrainingSection title="Upcoming" trainings={upcoming} color="blue" showCount={true} />

          <TrainingSection title="Past Sessions" trainings={past} color="gray" isPast={true} />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <div className="lg:col-span-8 space-y-6">
              {!trainings.length && (
                <div className="text-center h-80 flex flex-col items-center justify-center" style={{ color: primitives.grey.grey500 }}>
                  <p className="text-lg font-medium">No trainings found</p>
                  <p className="text-sm">You can create one</p>
                </div>
              )}

              {todaySessions.length > 0 && (
                <TrainingSessionGroup title="Today" color="green" date={today}>
                  {todaySessions.map((s) => (
                    <TrainingSessionCard key={s.id} session={s} highlight showDate={false} />
                  ))}
                </TrainingSessionGroup>
              )}

              {upcoming.length > 0 && (
                <TrainingSessionGroup title="Upcoming" color="blue">
                  {upcoming.map((s) => (
                    <TrainingSessionCard key={s.id} session={s} />
                  ))}
                </TrainingSessionGroup>
              )}

              {past.length > 0 && (
                <TrainingSessionGroup title="Past Sessions" color="gray">
                  {past.map((s) => (
                    <TrainingSessionCard key={s.id} session={s} isPast />
                  ))}
                </TrainingSessionGroup>
              )}
            </div>

            <aside className="lg:col-span-4 hidden lg:block">
              <div
                className="sticky top-8 border rounded-lg p-4 transition-colors duration-200"
                style={{
                  backgroundColor: theme === "dark" ? "#1A1A1A" : primitives.white.white,
                  borderColor: theme === "dark" ? `${primitives.white.white}1A` : primitives.grey.grey200,
                }}
              >
                <h3
                  className="text-sm font-semibold mb-4 transition-colors duration-200"
                  style={{ color: theme === "dark" ? primitives.white.white : primitives.grey.grey900 }}
                >
                  Training Calendar
                </h3>
                <TrainingCalendar trainings={trainings} />
              </div>
            </aside>
          </div>
        </>
      )}
    </>
  );
}
