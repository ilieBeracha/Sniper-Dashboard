import { TrainingSession, TrainingStatus } from "@/types/training";
import { parseISO, isToday, isPast, isFuture } from "date-fns";
import { TrainingSessionCard } from "./TrainingSessionCard";
import TrainingSessionGroup from "./TrainingSessionGroup";
import TrainingListEmpty from "./TrainingListEmpty";
import { useState } from "react";
import TrainingCalendar from "./TrainingCalendar";

type Tab = "active" | "canceled";

export default function TrainingList({ trainings }: { trainings: TrainingSession[] }) {
  const [activeTab] = useState<Tab>("active");

  if (trainings.length === 0) {
    return <TrainingListEmpty />;
  }

  const sortedTrainings = [...trainings].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const today = new Date();

  const activeTrainings = sortedTrainings.filter((s) => s.status !== TrainingStatus.Canceled);
  const canceledTrainings = sortedTrainings.filter((s) => s.status === TrainingStatus.Canceled);

  const todaySessions = activeTrainings.filter((s) => isToday(parseISO(s.date)));
  const upcomingSessions = activeTrainings.filter((s) => isFuture(parseISO(s.date)) && !isToday(parseISO(s.date)));
  const pastSessions = activeTrainings.filter((s) => isPast(parseISO(s.date)) && !isToday(parseISO(s.date))).reverse();

  return (
    <div className="sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-9 space-y-8 grid grid-cols-1 gap-8 px-3">
      <div className="sm:col-span-6 md:col-span-6 lg:col-span-6 overflow-y-auto max-h-full pr-1 custom-scrollbar col-span-6 ">
        {activeTab === "active" ? (
          <>
            {/* Today */}
            {todaySessions.length > 0 && (
              <TrainingSessionGroup title="Today" color="indigo" date={today}>
                {todaySessions.map((s) => (
                  <div key={s.id} className="relative group">
                    <TrainingSessionCard key={s.id} session={s} showDate={false} highlight />
                  </div>
                ))}
              </TrainingSessionGroup>
            )}

            {/* Upcoming */}
            {upcomingSessions.length > 0 && (
              <TrainingSessionGroup title="Upcoming" color="blue">
                {upcomingSessions.map((s) => (
                  <div key={s.id} className="relative group">
                    <TrainingSessionCard key={s.id} session={s} />
                  </div>
                ))}
              </TrainingSessionGroup>
            )}

            {pastSessions.length > 0 && (
              <TrainingSessionGroup title="Past Sessions" color="gray">
                {pastSessions.map((s) => (
                  <div key={s.id} className="relative group">
                    <TrainingSessionCard key={s.id} session={s} />
                  </div>
                ))}
              </TrainingSessionGroup>
            )}
          </>
        ) : (
          <TrainingSessionGroup title="Canceled Sessions" color="red">
            {canceledTrainings.map((s) => (
              <div key={s.id} className="relative group">
                <TrainingSessionCard key={s.id} session={s} />
              </div>
            ))}
          </TrainingSessionGroup>
        )}
      </div>
      <div className="sm:hidden md:block gap-2 space-y-8 border-b border-white/5 col-span-3 sticky top-8 h-fit">
        <TrainingCalendar trainings={trainings} />
      </div>
    </div>

    // </div>
  );
}
