import { TrainingSession } from "@/types/training";
import { format, parseISO, isToday, isPast, isFuture, isThisWeek } from "date-fns";
import { Calendar } from "lucide-react";
import { useStore } from "zustand";
import { userStore } from "@/store/userStore";
import { TrainingSessionCard } from "./TrainingSessionCard";

export default function TrainingList({ trainings }: { trainings: TrainingSession[] }) {
  const { user } = useStore(userStore);

  if (trainings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-[#222]/50 rounded-lg text-center border border-white/5">
        <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center mb-4">
          <Calendar className="w-8 h-8 text-indigo-400" />
        </div>
        <p className="text-gray-300 font-medium">No training sessions found</p>
        <p className="text-sm text-gray-500 mt-1 max-w-xs">Schedule a new training session to start tracking your team's progress</p>
      </div>
    );
  }

  const sortedTrainings = [...trainings].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const today = new Date();

  const todaySessions = sortedTrainings.filter((s) => isToday(parseISO(s.date)));
  const thisWeekSessions = sortedTrainings.filter((s) => isThisWeek(parseISO(s.date)) && !isToday(parseISO(s.date)) && isFuture(parseISO(s.date)));
  const upcomingSessions = sortedTrainings.filter((s) => isFuture(parseISO(s.date)) && !isThisWeek(parseISO(s.date)));
  const pastSessions = sortedTrainings.filter((s) => isPast(parseISO(s.date)) && !isToday(parseISO(s.date))).reverse();

  return (
    <div className="space-y-8 overflow-y-auto max-h-full pr-1 custom-scrollbar">
      {/* Today */}
      {todaySessions.length > 0 && (
        <TrainingSessionGroup title="Today" color="indigo" date={today}>
          {todaySessions.map((s) => (
            <TrainingSessionCard key={s.id} session={s} currentUserId={user?.id} showDate={false} highlight />
          ))}
        </TrainingSessionGroup>
      )}

      {/* This Week */}
      {thisWeekSessions.length > 0 && (
        <TrainingSessionGroup title="This Week" color="green">
          {thisWeekSessions.map((s) => (
            <TrainingSessionCard key={s.id} session={s} currentUserId={user?.id} />
          ))}
        </TrainingSessionGroup>
      )}

      {/* Upcoming */}
      {upcomingSessions.length > 0 && (
        <TrainingSessionGroup title="Upcoming" color="blue">
          {upcomingSessions.map((s) => (
            <TrainingSessionCard key={s.id} session={s} currentUserId={user?.id} />
          ))}
        </TrainingSessionGroup>
      )}

      {/* Past */}
      {pastSessions.length > 0 && (
        <TrainingSessionGroup title="Past Sessions" color="gray">
          {pastSessions.map((s) => (
            <TrainingSessionCard key={s.id} session={s} currentUserId={user?.id} isPast />
          ))}
        </TrainingSessionGroup>
      )}
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
  color: "indigo" | "green" | "blue" | "gray";
  date?: Date;
  children: React.ReactNode;
}) {
  const colorMap = {
    indigo: "bg-indigo-500",
    green: "bg-green-500",
    blue: "bg-blue-500",
    gray: "bg-gray-500",
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-2 h-2 rounded-full ${colorMap[color]}`}></div>
        <h3 className="text-sm font-medium text-white uppercase">{title}</h3>
        <div className="h-px flex-grow bg-white/5"></div>
        {date && <span className="text-xs text-gray-400">{format(date, "EEEE, MMMM d")}</span>}
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}
