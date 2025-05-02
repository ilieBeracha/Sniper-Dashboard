import { TrainingSession } from "@/types/training";
import { parseISO, isPast, isFuture } from "date-fns";
import { Users, Calendar, Target, Trophy } from "lucide-react";

interface TrainingStatsProps {
  trainings: TrainingSession[];
}

export default function TrainingStats({ trainings }: TrainingStatsProps) {
  const totalSessions = trainings.length;
  const upcomingSessions = trainings.filter((s) => isFuture(parseISO(s.date))).length;
  const completedSessions = trainings.filter((s) => isPast(parseISO(s.date))).length;

  const totalParticipants = trainings.reduce((acc, session) => {
    return acc + (session.participants?.length || 0);
  }, 0);
  const avgParticipants = totalSessions > 0 ? Math.round(totalParticipants / totalSessions) : 0;

  const stats = [
    {
      title: "Total Sessions",
      value: totalSessions,
      icon: Calendar,
      color: "indigo",
    },
    {
      title: "Upcoming",
      value: upcomingSessions,
      icon: Target,
      color: "green",
    },
    {
      title: "Completed",
      value: completedSessions,
      icon: Trophy,
      color: "blue",
    },
    {
      title: "Avg. Participants",
      value: avgParticipants,
      icon: Users,
      color: "purple",
    },
  ];

  return (
    <div className="bg-[#1A1A1A] rounded-xl shadow-xl border border-white/5 overflow-hidden backdrop-blur-sm">
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.title} className="bg-[#222]/50 rounded-lg p-4 border border-white/5 hover:border-white/10 transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">{stat.title}</p>
                    <p className="text-xl font-bold text-white mt-1">{stat.value}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-full bg-${stat.color}-500/10 flex items-center justify-center`}>
                    <Icon className={`w-3 h-3 text-${stat.color}-400`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
