import { TrainingSession } from "@/types/training";
import { parseISO, isToday, isPast, isFuture } from "date-fns";
import { TrainingSessionCard } from "./TrainingSessionCard";
import TrainingSessionGroup from "./TrainingSessionGroup";
import { useEffect } from "react";
import TrainingCalendar from "./TrainingCalendar";
import { useTheme } from "@/contexts/ThemeContext";
import { useStore } from "zustand";
import { performanceStore } from "@/store/performance";
import { useIsMobile } from "@/hooks/useIsMobile";
interface TrainingListProps {
  trainings: TrainingSession[];
}

export default function TrainingList({ trainings }: TrainingListProps) {
  const { theme } = useTheme();
  const { getOverallAccuracyStats } = useStore(performanceStore);
  const isMobile = useIsMobile();
  useEffect(() => {
    getOverallAccuracyStats();
  }, []);

  // Use provided trainings directly
  const active = trainings;

  const today = new Date();
  const todaySessions = active.filter((s) => isToday(parseISO(s.date)));
  const upcoming = active.filter((s) => {
    const sessionDate = parseISO(s.date);
    return isFuture(sessionDate) && !isToday(sessionDate);
  });
  const past = active
    .filter((s) => {
      const sessionDate = parseISO(s.date);
      const sessionDateEnd = new Date(sessionDate);
      sessionDateEnd.setHours(23, 59, 59, 999);
      return isPast(sessionDateEnd) && !isToday(sessionDate);
    })
    .reverse();

  return (
    <>
      {isMobile ? (
        <div className="space-y-4">
          <div className="space-y-3">
            {active.length === 0 && <div className="text-center text-gray-500 h-80 flex items-center justify-center">No active trainings</div>}
            {todaySessions.length > 0 && (
              <div className="space-y-3">
                <h3 className={`text-sm flex items-center gap-2 font-medium px-1 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                  <div className="h-3 w-3 bg-green-400 rounded-full"></div> Today
                </h3>

                {todaySessions.map((s) => (
                  <TrainingSessionCard key={s.id} session={s} highlight showDate={false} />
                ))}
              </div>
            )}

            {upcoming.length > 0 && (
              <div className="space-y-3 mt-6">
                <h3 className={`text-sm flex items-center gap-2 font-medium px-1 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                  <div className="h-3 w-3 bg-blue-600 rounded-full"></div> Upcoming <span className="text-xs">{upcoming.length}</span>
                </h3>
                {upcoming.map((s) => (
                  <TrainingSessionCard key={s.id} session={s} />
                ))}
              </div>
            )}

            {past.length > 0 && (
              <div className="space-y-3 mt-6">
                <h3 className={`text-sm flex items-center gap-2 font-medium px-1 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                  <div className="h-3 w-3 bg-gray-600 rounded-full"></div> Past Sessions
                </h3>
                {past.map((s) => (
                  <TrainingSessionCard key={s.id} session={s} isPast />
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <div className="lg:col-span-8 space-y-6">
              {!trainings.length && (
                <div className="text-center text-gray-500 h-80 flex flex-col items-center justify-center">
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
                className={`sticky top-8 border rounded-lg p-4 transition-colors duration-200 ${
                  theme === "dark" ? "bg-[#1A1A1A] border-white/10" : "bg-white border-gray-200"
                }`}
              >
                <h3 className={`text-sm font-semibold mb-4 transition-colors duration-200 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  Training Calendar
                </h3>
                <TrainingCalendar trainings={trainings} />
              </div>
              {/* <div className="grid grid-cols-1 gap-4 md:grid-cols-1 lg:grid-cols-1 py-4 ">
                <BaseDashboardCard header="">
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-indigo-500">{overallAccuracyStats?.total_scores || "0"}</div>
                      <div className={`text-sm transition-colors duration-200 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                        Total Scores
                      </div>
                    </div>
                    <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </BaseDashboardCard>

                <BaseDashboardCard header="">
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-indigo-500">{overallAccuracyStats?.accuracy_percent?.toFixed(1) || "0.0"}%</div>
                      <div className={`text-sm transition-colors duration-200 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Accuracy</div>
                    </div>
                    <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                </BaseDashboardCard>

                <BaseDashboardCard header="">
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-indigo-500">{overallAccuracyStats?.total_shots_fired || "0"}</div>
                      <div className={`text-sm transition-colors duration-200 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                        Shots Fired
                      </div>
                    </div>
                    <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  </div>
                </BaseDashboardCard>

                <BaseDashboardCard header="">
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-indigo-500">{overallAccuracyStats?.total_target_hits || "0"}</div>
                      <div className={`text-sm transition-colors duration-200 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                        Target Hits
                      </div>
                    </div>
                    <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                      />
                    </svg>
                  </div>
                </BaseDashboardCard>
              </div> */}
            </aside>
          </div>
        </>
      )}
    </>
  );
}
