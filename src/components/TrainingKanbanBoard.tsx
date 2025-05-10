import { motion } from "framer-motion";
import { Calendar, Clock, Archive } from "lucide-react";
import { parseISO, isToday, isPast, isFuture } from "date-fns";
import { useStore } from "zustand";
import { userStore } from "@/store/userStore";
import { TrainingSessionCard } from "./TrainingSessionCard";
import { TrainingSession } from "@/types/training";

const ColumnHeader = ({ icon: Icon, title, count, color }: { icon: React.ElementType; title: string; count: number; color: string }) => (
  <div className="flex items-center justify-between p-2 border-b border-white/5">
    <div className="flex items-center gap-2">
      <div className={`p-1.5 rounded-md bg-${color}-500/10 text-${color}-400`}>
        <Icon className="w-4 h-4" />
      </div>
      <h3 className="font-medium text-gray-200">{title}</h3>
    </div>
    <div className="bg-[#1E1E20] text-gray-400 border border-white/10">{count}</div>
  </div>
);

export default function TrainingKanbanBoard({ trainings }: { trainings: TrainingSession[] }) {
  const { user } = useStore(userStore);

  const sortedTrainings = [...trainings].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const todaySessions = sortedTrainings.filter((s) => s.status !== "canceled" && isToday(parseISO(s.date)));

  const upcomingSessions = sortedTrainings.filter((s) => s.status !== "canceled" && isFuture(parseISO(s.date)) && !isToday(parseISO(s.date)));

  const pastSessions = sortedTrainings.filter((s) => s.status !== "canceled" && isPast(parseISO(s.date)) && !isToday(parseISO(s.date))).reverse();

  const columns = [
    {
      title: "Today",
      icon: Clock,
      color: "indigo",
      sessions: todaySessions,
    },
    {
      title: "Upcoming",
      icon: Calendar,
      color: "blue",
      sessions: upcomingSessions,
    },
    {
      title: "Past",
      icon: Archive,
      color: "gray",
      sessions: pastSessions,
    },
  ];

  return (
    <div className="w-full overflow-x-auto pb-4 h-full">
      <div className=" grid grid-cols-3 gap-8 p-1 h-full px-3">
        {columns.map((col) => (
          <div className="h-full col-span-1">
            <ColumnHeader icon={col.icon} title={col.title} count={col.sessions.length} color={col.color} />

            <div className="h-full">
              <div className="space-y-3 max-h-[calc(80vh-100px)] overflow-y-auto custom-scrollbar">
                {col.sessions.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-8 text-gray-500 bg-[#1E1E1E]/20 rounded-lg h-full"
                  >
                    <col.icon className="w-5 h-5 mb-2 opacity-40" />
                    <p className="text-sm">No sessions</p>
                  </motion.div>
                ) : (
                  col.sessions.map((session) => (
                    <TrainingSessionCard
                      session={session}
                      currentUserId={user?.id}
                      showDate={col.title !== "Today"}
                      highlight={col.title === "Today"}
                      isPast={col.title === "Past"}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
