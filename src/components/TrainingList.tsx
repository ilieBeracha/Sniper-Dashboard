import { TrainingSession, TrainingStatus } from "@/types/training";
import { format, parseISO, isToday, isPast, isFuture, isThisWeek } from "date-fns";
import { Calendar, UserCheck } from "lucide-react";
import { useStore } from "zustand";
import { userStore } from "@/store/userStore";
import { TrainingSessionCard } from "./TrainingSessionCard";
import { useState } from "react";

type Tab = "active" | "canceled";

export default function TrainingList({ trainings }: { trainings: TrainingSession[] }) {
  const { user } = useStore(userStore);
  const [activeTab, setActiveTab] = useState<Tab>("active");

  if (trainings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-[#222]/50 rounded-lg text-center border border-white/5 backdrop-blur-sm">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500/20 to-indigo-600/20 flex items-center justify-center mb-4">
          <Calendar className="w-8 h-8 text-indigo-400" />
        </div>
        <p className="text-gray-300 font-medium text-lg">No training sessions found</p>
        <p className="text-sm text-gray-500 mt-2 max-w-xs">Schedule a new training session to start tracking your team's progress</p>
      </div>
    );
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
                    {isParticipating(s) && (
                      <div className="absolute -top-3 -right-3 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full shadow-lg shadow-green-500/30 animate-bounce">
                        <UserCheck className="w-5 h-5 text-white" />
                        <span className="text-sm font-bold text-white">YOU'RE IN!</span>
                      </div>
                    )}
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
                    {isParticipating(s) && (
                      <div className="absolute -top-3 -right-3 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full shadow-lg shadow-green-500/30 animate-bounce">
                        <UserCheck className="w-5 h-5 text-white" />
                        <span className="text-sm font-bold text-white">YOU'RE IN!</span>
                      </div>
                    )}
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
                    {isParticipating(s) && (
                      <div className="absolute -top-3 -right-3 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full shadow-lg shadow-green-500/30 animate-bounce">
                        <UserCheck className="w-5 h-5 text-white" />
                        <span className="text-sm font-bold text-white">YOU'RE IN!</span>
                      </div>
                    )}
                  </div>
                ))}
              </TrainingSessionGroup>
            )}

            {pastSessions.length > 0 && (
              <TrainingSessionGroup title="Past Sessions" color="gray">
                {pastSessions.map((s) => (
                  <div key={s.id} className="relative group">
                    <TrainingSessionCard key={s.id} session={s} currentUserId={user?.id} isPast />
                    {isParticipating(s) && (
                      <div className="absolute -top-3 -right-3 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full shadow-lg shadow-green-500/30 animate-bounce">
                        <UserCheck className="w-5 h-5 text-white" />
                        <span className="text-sm font-bold text-white">YOU'RE IN!</span>
                      </div>
                    )}
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
                {isParticipating(s) && (
                  <div className="absolute -top-3 -right-3 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full shadow-lg shadow-green-500/30 animate-bounce">
                    <UserCheck className="w-5 h-5 text-white" />
                    <span className="text-sm font-bold text-white">YOU'RE IN!</span>
                  </div>
                )}
              </div>
            ))}
          </TrainingSessionGroup>
        )}
      </div>
    </div>
  );
}

function TrainingSessionGroup({
  title,
  color,
  date,
  children,
}: {
  title: string;
  color: "indigo" | "green" | "blue" | "gray" | "red";
  date?: Date;
  children: React.ReactNode;
}) {
  const colorMap = {
    indigo: "bg-indigo-500",
    green: "bg-green-500",
    blue: "bg-blue-500",
    gray: "bg-gray-500",
    red: "bg-red-500",
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-2 h-2 rounded-full ${colorMap[color]} shadow-[0_0_8px_0px_${colorMap[color]}]`}></div>
        <h3 className="text-sm font-medium text-white uppercase tracking-wider">{title}</h3>
        <div className="h-px flex-grow bg-white/5"></div>
        {date && <span className="text-xs text-gray-400 font-medium">{format(date, "EEEE, MMMM d")}</span>}
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}
