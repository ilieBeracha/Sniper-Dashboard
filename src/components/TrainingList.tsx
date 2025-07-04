import { TrainingSession, TrainingStatus } from "@/types/training";
import { parseISO, isToday, isPast, isFuture } from "date-fns";
import { TrainingSessionCard } from "./TrainingSessionCard";
import TrainingSessionGroup from "./TrainingSessionGroup";
import TrainingListEmpty from "./TrainingListEmpty";
import { useState } from "react";
import TrainingCalendar from "./TrainingCalendar";
import { Plus } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

type Tab = "active" | "canceled";

export default function TrainingList({
  trainings,
  setIsAddTrainingOpen,
}: {
  trainings: TrainingSession[];
  setIsAddTrainingOpen: (open: boolean) => void;
}) {
  const [activeTab, setActiveTab] = useState<Tab>("active");
  const { theme } = useTheme();

  const sorted = [...trainings].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const active = sorted.filter((s) => s.status !== TrainingStatus.Canceled);
  const canceled = sorted.filter((s) => s.status === TrainingStatus.Canceled);

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
      <button
        type="button"
        onClick={() => setIsAddTrainingOpen(true)}
        className={`px-2 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 transition-colors rounded-md text-sm font-medium text-white shadow-sm disabled:cursor-not-allowed flex items-center gap-2`}
      >
        <span className="text-xs font-medium">Add Training</span>
        <Plus size={12} />
      </button>
      {trainings.length == 0 ? (
        <TrainingListEmpty />
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className={`flex items-center gap-2 text-sm font-medium transition-colors duration-200`}>
              {(["active", "canceled"] as Tab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-full px-4 py-1.5 transition-colors duration-200 ${
                    activeTab === tab
                      ? theme === "dark"
                        ? "bg-white/80 text-gray-900"
                        : "bg-gray-900 text-white"
                      : theme === "dark"
                        ? "bg-white/10 hover:bg-white/20 text-gray-200"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-600"
                  }`}
                >
                  {tab === "active" ? "Active" : "Canceled"}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <div className="lg:col-span-8 space-y-6">
              {activeTab === "active" ? (
                <>
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
                </>
              ) : (
                <TrainingSessionGroup title="Canceled Sessions" color="red">
                  {canceled.map((s) => (
                    <TrainingSessionCard key={s.id} session={s} />
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
            </aside>
          </div>
        </>
      )}
    </>
  );
}
