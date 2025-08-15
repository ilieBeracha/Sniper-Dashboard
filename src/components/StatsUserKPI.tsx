import { useStore } from "zustand";
import { performanceStore } from "@/store/performance";
import { Calendar, Users, Target, Crosshair, Zap } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export default function StatsUserKPI() {
  const { userWeeklyKpisForUser } = useStore(performanceStore);
  const { theme } = useTheme();

  if (!userWeeklyKpisForUser || userWeeklyKpisForUser.length === 0) {
    return null;
  }

  const data = userWeeklyKpisForUser;
  const totals = data.reduce(
    (acc: any, user: any) => ({
      trainings: acc.trainings + (user.trainings_last_week || 0),
      sessions: acc.sessions + (user.sessions_last_week || 0),
      engagements: acc.engagements + (user.engagements_last_week || 0),
      targets: acc.targets + (user.targets_last_week || 0),
      avgHitRatio: acc.avgHitRatio + (Number(user.avg_hit_ratio_last_week) || 0),
    }),
    { trainings: 0, sessions: 0, engagements: 0, targets: 0, avgHitRatio: 0 },
  );

  const avgHitRatio = data.length > 0 ? totals.avgHitRatio / data.length : 0;

  const kpis = [
    { value: totals.trainings || 0, label: "Trainings", suffix: "", icon: Calendar, color: "blue" },
    { value: totals.sessions || 0, label: "Sessions", suffix: "", icon: Users, color: "green" },
    { value: totals.targets || 0, label: "Targets", suffix: "", icon: Target, color: "purple" },
    { value: Math.round(avgHitRatio * 100) || 0, label: "Hit Rate", suffix: "%", icon: Crosshair, color: "orange" },
  ];

  return (
    <div className={`rounded-lg p-3 border ${theme === "dark" ? "bg-zinc-900/50 border-zinc-700/50" : "bg-white border-gray-200"}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Zap className={`w-4 h-4 ${theme === "dark" ? "text-zinc-400" : "text-gray-500"}`} />
          <h4 className={`text-sm font-medium ${theme === "dark" ? "text-zinc-200" : "text-gray-900"}`}>Performance Overview</h4>
        </div>
        <span className={`text-xs ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>Last 7 days</span>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {kpis.map((item, index) => {
          const IconComponent = item.icon;
          const colorClasses = {
            blue: { 
              bg: theme === "dark" ? "bg-blue-500/10" : "bg-blue-50",
              icon: theme === "dark" ? "text-blue-400" : "text-blue-600",
              value: theme === "dark" ? "text-blue-400" : "text-blue-700"
            },
            green: { 
              bg: theme === "dark" ? "bg-green-500/10" : "bg-green-50",
              icon: theme === "dark" ? "text-green-400" : "text-green-600",
              value: theme === "dark" ? "text-green-400" : "text-green-700"
            },
            purple: { 
              bg: theme === "dark" ? "bg-purple-500/10" : "bg-purple-50",
              icon: theme === "dark" ? "text-purple-400" : "text-purple-600",
              value: theme === "dark" ? "text-purple-400" : "text-purple-700"
            },
            orange: { 
              bg: theme === "dark" ? "bg-orange-500/10" : "bg-orange-50",
              icon: theme === "dark" ? "text-orange-400" : "text-orange-600",
              value: theme === "dark" ? "text-orange-400" : "text-orange-700"
            },
          };
          const colors = colorClasses[item.color as keyof typeof colorClasses];

          return (
            <div
              key={index}
              className={`relative overflow-hidden rounded-lg p-3 ${
                theme === "dark" ? "bg-zinc-800/30" : "bg-gray-50"
              }`}
            >
              {/* Icon Background */}
              <div className={`absolute top-0 right-0 p-2 ${colors.bg} rounded-bl-2xl`}>
                <IconComponent className={`w-3.5 h-3.5 ${colors.icon}`} />
              </div>
              
              {/* Content */}
              <div className="relative">
                <div className={`text-[10px] ${theme === "dark" ? "text-zinc-500" : "text-gray-500"} mb-1`}>{item.label}</div>
                <div className={`text-xl font-bold ${colors.value} tracking-tight`}>
                  {item.value.toLocaleString()}{item.suffix && <span className="text-sm ml-0.5">{item.suffix}</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Stats Bar */}
      <div className={`mt-3 pt-3 border-t ${theme === "dark" ? "border-zinc-800" : "border-gray-200"} flex items-center justify-between`}>
        <div className="flex items-center gap-4 text-[10px]">
          <div className={theme === "dark" ? "text-zinc-500" : "text-gray-500"}>
            Engagement Rate: <span className={`font-medium ${theme === "dark" ? "text-zinc-300" : "text-gray-700"}`}>
              {totals.sessions > 0 ? Math.round((totals.engagements / totals.sessions) * 100) : 0}%
            </span>
          </div>
          <div className={theme === "dark" ? "text-zinc-500" : "text-gray-500"}>
            Targets/Session: <span className={`font-medium ${theme === "dark" ? "text-zinc-300" : "text-gray-700"}`}>
              {totals.sessions > 0 ? Math.round(totals.targets / totals.sessions) : 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
