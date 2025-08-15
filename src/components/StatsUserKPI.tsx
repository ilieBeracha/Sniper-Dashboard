import { useStore } from "zustand";
import { performanceStore } from "@/store/performance";
import { Calendar, Users, Target, Crosshair, TrendingUp } from "lucide-react";
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
    { value: totals.trainings || 0, label: "Trainings", suffix: "", icon: Calendar, trend: "+12%" },
    { value: totals.sessions || 0, label: "Sessions", suffix: "", icon: Users, trend: "+8%" },
    { value: totals.targets || 0, label: "Targets", suffix: "", icon: Target, trend: "+15%" },
    { value: Math.round(avgHitRatio * 100) || 0, label: "Hit Rate", suffix: "%", icon: Crosshair, trend: "+3%" },
  ];

  return (
    <div className={`rounded-lg p-2 border ${theme === "dark" ? "bg-zinc-900/50 border-zinc-700/50" : "bg-white border-gray-200"}`}>
      {/* Compact Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <TrendingUp className={`w-3.5 h-3.5 ${theme === "dark" ? "text-zinc-400" : "text-gray-500"}`} />
          <h4 className={`text-xs font-medium ${theme === "dark" ? "text-zinc-200" : "text-gray-900"}`}>Performance Metrics</h4>
        </div>
        <span className={`text-[10px] ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>7 days</span>
      </div>

      {/* KPI Grid - Tight Professional Layout */}
      <div className="grid grid-cols-4 gap-1.5">
        {kpis.map((item, index) => {
          const IconComponent = item.icon;

          return (
            <div
              key={index}
              className={`relative rounded p-2 ${
                theme === "dark" ? "bg-zinc-800/30" : "bg-gray-50"
              }`}
            >
              {/* Top Row - Icon and Label */}
              <div className="flex items-center justify-between mb-1">
                <IconComponent className={`w-3 h-3 ${theme === "dark" ? "text-zinc-500" : "text-gray-400"}`} />
                <span className={`text-[9px] font-medium text-green-500`}>{item.trend}</span>
              </div>
              
              {/* Value */}
              <div className={`text-base font-bold ${theme === "dark" ? "text-white" : "text-gray-900"} leading-none`}>
                {item.value.toLocaleString()}{item.suffix}
              </div>
              
              {/* Label */}
              <div className={`text-[9px] ${theme === "dark" ? "text-zinc-500" : "text-gray-500"} mt-0.5`}>
                {item.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Compact Bottom Stats */}
      <div className={`mt-2 pt-2 border-t ${theme === "dark" ? "border-zinc-800" : "border-gray-200"} flex items-center justify-between`}>
        <div className="flex items-center gap-3 text-[9px]">
          <span className={theme === "dark" ? "text-zinc-500" : "text-gray-500"}>
            Engagement: <span className={`font-medium ${theme === "dark" ? "text-zinc-300" : "text-gray-700"}`}>
              {totals.sessions > 0 ? Math.round((totals.engagements / totals.sessions) * 100) : 0}%
            </span>
          </span>
          <span className={theme === "dark" ? "text-zinc-500" : "text-gray-500"}>
            Avg Targets: <span className={`font-medium ${theme === "dark" ? "text-zinc-300" : "text-gray-700"}`}>
              {totals.sessions > 0 ? Math.round(totals.targets / totals.sessions) : 0}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
