import { TrainingSession, TrainingStatus } from "@/types/training";
import { parseISO, isToday, isPast, isFuture, isThisWeek } from "date-fns";
import { useStore } from "zustand";
import { userStore } from "@/store/userStore";
import { TrainingSessionCard } from "./TrainingSessionCard";
import TrainingSessionGroup from "./TrainingSessionGroup";
import TrainingListEmpty from "./TrainingListEmpty";
import TrainingParticipantBadge from "./TrainingParticipantBadge";
import { useState } from "react";

type Tab = "active" | "canceled";

export default function TrainingList({ trainings }: { trainings: TrainingSession[] }) {
  const { user } = useStore(userStore);
  const [activeTab, setActiveTab] = useState<Tab>("active");

  if (trainings.length === 0) {
    return <TrainingListEmpty />;
  }

  const sortedTrainings = [...trainings].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const today = new Date();

  const activeTrainings = sortedTrainings.filter((s) => s.status !== TrainingStatus.Canceled);
  const canceledTrainings = sortedTrainings.filter((s) => s.status === TrainingStatus.Canceled);

  const todaySessions = activeTrainings.filter((s) => isToday(parseISO(s.date)));
  const thisWeekSessions = activeTrainings.filter((s) => isThisWeek(parseISO(s.date)) && !isToday(parseISO(s.date)) && isFuture(parseISO(s.date)));
  const upcomingSessions = activeTrainings.filter((s) => isFuture(parseISO(s.date)) && !isThisWeek(parseISO(s.date)));
  const pastSessions = activeTrainings.filter((s) => isPast(parseISO(s.date)) && !isToday(parseISO(s.date))).reverse();

  const isParticipating = (training: TrainingSession) => {
    console.log(training);
    return training.participants?.some((p) => p.participant_id === user?.id);
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2 border-b border-white/5">
        <button
          onClick={() => setActiveTab("active")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "active" ? "text-white border-b-2 border-indigo-500" : "text-gray-400 hover:text-white"
          }`}
        >
          Active Trainings
        </button>
        <button
          onClick={() => setActiveTab("canceled")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "canceled" ? "text-white border-b-2 border-red-500" : "text-gray-400 hover:text-white"
          }`}
        >
          Canceled Trainings
        </button>
      </div>

      <div className="space-y-8 overflow-y-auto max-h-full pr-1 custom-scrollbar">
        {activeTab === "active" ? (
          <>
            {/* Today */}
            {todaySessions.length > 0 && (
              <TrainingSessionGroup title="Today" color="indigo" date={today}>
                {todaySessions.map((s) => (
                  <div key={s.id} className="relative group">
                    <TrainingSessionCard key={s.id} session={s} currentUserId={user?.id} showDate={false} highlight />
                  </div>
                ))}
              </TrainingSessionGroup>
            )}

            {/* This Week */}
            {thisWeekSessions.length > 0 && (
              <TrainingSessionGroup title="This Week" color="green">
                {thisWeekSessions.map((s) => (
                  <div key={s.id} className="relative group">
                    <TrainingSessionCard key={s.id} session={s} currentUserId={user?.id} />
                  </div>
                ))}
              </TrainingSessionGroup>
            )}

            {/* Upcoming */}
            {upcomingSessions.length > 0 && (
              <TrainingSessionGroup title="Upcoming" color="blue">
                {upcomingSessions.map((s) => (
                  <div key={s.id} className="relative group">
                    <TrainingSessionCard key={s.id} session={s} currentUserId={user?.id} />
                  </div>
                ))}
              </TrainingSessionGroup>
            )}

            {pastSessions.length > 0 && (
              <TrainingSessionGroup title="Past Sessions" color="gray">
                {pastSessions.map((s) => (
                  <div key={s.id} className="relative group">
                    <TrainingSessionCard key={s.id} session={s} currentUserId={user?.id} isPast />
                  </div>
                ))}
              </TrainingSessionGroup>
            )}
          </>
        ) : (
          <TrainingSessionGroup title="Canceled Sessions" color="red">
            {canceledTrainings.map((s) => (
              <div key={s.id} className="relative group">
                <TrainingSessionCard key={s.id} session={s} currentUserId={user?.id} isPast />
              </div>
            ))}
          </TrainingSessionGroup>
        )}
      </div>
    </div>
  );
}
