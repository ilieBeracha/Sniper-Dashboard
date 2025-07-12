import { useTheme } from "@/contexts/ThemeContext";
import { Activity, Target, Users, TrendingUp, Clock } from "lucide-react";

export default function TrainingAnalyticsTab({ sessionStats }: { sessionStats: any[] }) {
  const { theme } = useTheme();

  // Calculate analytics from session stats
  const analytics = sessionStats ? {
    totalSessions: sessionStats.length,
    totalParticipants: sessionStats.reduce((acc, session) => {
      const participantCount = session.session_participants?.length || 0;
      return acc + participantCount;
    }, 0),
    averageTimeToFirstShot: sessionStats.reduce((acc, session) => {
      return acc + (session.time_to_first_shot || 0);
    }, 0) / (sessionStats.length || 1),
    totalTargetsEngaged: sessionStats.reduce((acc, session) => {
      const targetCount = session.target_stats?.length || 0;
      return acc + targetCount;
    }, 0),
  } : {
    totalSessions: 0,
    totalParticipants: 0,
    averageTimeToFirstShot: 0,
    totalTargetsEngaged: 0,
  };

  const statCards = [
    {
      title: "Total Sessions",
      value: analytics.totalSessions,
      icon: Activity,
      color: "blue",
    },
    {
      title: "Total Participants",
      value: analytics.totalParticipants,
      icon: Users,
      color: "green",
    },
    {
      title: "Targets Engaged",
      value: analytics.totalTargetsEngaged,
      icon: Target,
      color: "purple",
    },
    {
      title: "Avg Time to First Shot",
      value: `${Math.round(analytics.averageTimeToFirstShot)}s`,
      icon: Clock,
      color: "orange",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`p-6 rounded-2xl ${
                theme === "dark" ? "bg-zinc-900/50 border border-zinc-800" : "bg-white border border-gray-100"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                    {stat.title}
                  </p>
                  <p className={`text-2xl font-bold mt-1 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/20`}>
                  <Icon className={`w-5 h-5 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Performance Trends */}
      <div className={`p-6 rounded-2xl ${theme === "dark" ? "bg-zinc-900/50 border border-zinc-800" : "bg-white border border-gray-100"}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            Performance Trends
          </h3>
          <TrendingUp className={`w-5 h-5 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`} />
        </div>
        <div className={`text-center py-12 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
          <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-sm">Detailed analytics and charts coming soon</p>
        </div>
      </div>
    </div>
  );
}
