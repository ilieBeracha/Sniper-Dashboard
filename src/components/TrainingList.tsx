import { TrainingSession, TrainingStatus } from "@/types/training";
import { parseISO, isToday, isPast, isFuture } from "date-fns";
import { TrainingSessionCard } from "./TrainingSessionCard";
import TrainingSessionGroup from "./TrainingSessionGroup";
import TrainingListEmpty from "./TrainingListEmpty";
import { useState } from "react";
import TrainingCalendar from "./TrainingCalendar";

type Tab = "active" | "canceled";

export default function TrainingList({
  trainings,
  setIsAddTrainingOpen,
}: {
  trainings: TrainingSession[];
  setIsAddTrainingOpen: (open: boolean) => void;
}) {
  const [activeTab, setActiveTab] = useState<Tab>("active");

  if (trainings.length === 0) {
    return <TrainingListEmpty />;
  }

  /* ---------- data prep ---------- */
  const sorted = [...trainings].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const active = sorted.filter((s) => s.status !== TrainingStatus.Canceled);
  const canceled = sorted.filter((s) => s.status === TrainingStatus.Canceled);

  const today = new Date();
  const todaySessions = active.filter((s) => isToday(parseISO(s.date)));
  const upcoming = active.filter((s) => isFuture(parseISO(s.date)) && !isToday(parseISO(s.date)));
  const past = active.filter((s) => isPast(parseISO(s.date)) && !isToday(parseISO(s.date))).reverse();

  /* ---------- ui ---------- */
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm font-medium">
          {(["active", "canceled"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-full px-4 py-1.5 transition-colors ${
                activeTab === tab ? "bg-white/80 text-gray-900" : "bg-white/10 hover:bg-white/20 text-gray-200"
              }`}
            >
              {tab === "active" ? "Active" : "Canceled"}
            </button>
          ))}
        </div>

        {/* create */}
        <button
          onClick={() => setIsAddTrainingOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-[#121212] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF8906]"
        >
          Create
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 px-2 pb-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-9">
        <div className="col-span-6  overflow-y-auto custom-scrollbar sm:col-span-6 md:col-span-6 lg:col-span-6">
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
                    <TrainingSessionCard key={s.id} session={s} />
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

        {/* (optional) calendar / sidebar slot */}
        <aside className="sticky top-8 col-span-3 hidden h-fit space-y-6 border-l border-white/5 md:block">
          {/* put Calendar or stats here later */}
          <div className="flex flex-col items-start justify-start gap-4">
            <h4 className="text-sm font-semibold text-white">Training Calendar</h4>
            <TrainingCalendar trainings={trainings} />
          </div>
        </aside>
      </div>
    </>
  );
}
