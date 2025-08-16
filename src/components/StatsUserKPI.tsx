import { useStore } from "zustand";
import { performanceStore } from "@/store/performance";
import { Calendar, Users, Target, Crosshair, ArrowUpRight, ArrowDownRight } from "lucide-react";
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
    { 
      value: totals.trainings || 0, 
      label: "Training Sessions", 
      icon: Calendar, 
      trend: "+12%",
      positive: true,
      iconColor: theme === "dark" ? "text-zinc-400" : "text-gray-600",
      bgColor: theme === "dark" ? "bg-zinc-800/50" : "bg-gray-100"
    },
    { 
      value: totals.sessions || 0, 
      label: "Active Sessions", 
      icon: Users, 
      trend: "+8%",
      positive: true,
      iconColor: theme === "dark" ? "text-zinc-400" : "text-gray-600",
      bgColor: theme === "dark" ? "bg-zinc-800/50" : "bg-gray-100"
    },
    { 
      value: totals.targets || 0, 
      label: "Targets Engaged", 
      icon: Target, 
      trend: "-3%",
      positive: false,
      iconColor: theme === "dark" ? "text-zinc-400" : "text-gray-600",
      bgColor: theme === "dark" ? "bg-zinc-800/50" : "bg-gray-100"
    },
    { 
      value: Math.round(avgHitRatio * 100) || 0, 
      label: "Accuracy Rate", 
      suffix: "%", 
      icon: Crosshair, 
      trend: "+5%",
      positive: true,
      iconColor: theme === "dark" ? "text-zinc-400" : "text-gray-600",
      bgColor: theme === "dark" ? "bg-zinc-800/50" : "bg-gray-100"
    },
  ];

  return (
    <div className={`rounded-xl ${theme === "dark" ? "bg-zinc-900/50 border-zinc-800" : "bg-white border-gray-200"} border`}>
      {/* Compact KPI Grid */}
      <div className={`grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 ${theme === "dark" ? "divide-zinc-800" : "divide-gray-200"}`}>
        {kpis.map((item, index) => {
          const IconComponent = item.icon;
          const TrendIcon = item.positive ? ArrowUpRight : ArrowDownRight;

          return (
            <div
              key={index}
              className={`p-4 lg:p-5 hover:${theme === "dark" ? "bg-zinc-800/30" : "bg-gray-50"} transition-colors`}
            >
              {/* Top Row: Icon and Trend */}
              <div className="flex items-center justify-between mb-2">
                <IconComponent className={`w-4 h-4 ${item.iconColor}`} />
                <div className={`flex items-center gap-0.5 text-[11px] font-medium ${
                  item.positive 
                    ? theme === "dark" ? "text-emerald-400" : "text-emerald-600"
                    : theme === "dark" ? "text-red-400" : "text-red-600"
                }`}>
                  <TrendIcon className="w-3 h-3" />
                  {item.trend}
                </div>
              </div>
              
              {/* Value and Label */}
              <div>
                <div className={`text-xl lg:text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  {item.value.toLocaleString()}{item.suffix}
                </div>
                <div className={`text-xs ${theme === "dark" ? "text-zinc-400" : "text-gray-600"} mt-0.5`}>
                  {item.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Compact Bottom Stats Bar */}
      <div className={`px-4 py-2.5 border-t ${theme === "dark" ? "border-zinc-800 bg-zinc-800/20" : "border-gray-200 bg-gray-50/70"} 
        flex items-center justify-between flex-wrap gap-2`}>
        <div className="flex items-center gap-4 text-[11px]">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className={`${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>
              Active
            </span>
          </div>
          <div className={`${theme === "dark" ? "text-zinc-300" : "text-gray-700"}`}>
            <span className="font-semibold">{totals.sessions > 0 ? Math.round((totals.engagements / totals.sessions) * 100) : 0}%</span> Engagement
          </div>
          <div className={`${theme === "dark" ? "text-zinc-300" : "text-gray-700"}`}>
            <span className="font-semibold">{totals.sessions > 0 ? Math.round(totals.targets / totals.sessions) : 0}</span> Avg Targets
          </div>
        </div>
        <span className={`text-[10px] ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>
          Last 7 days
        </span>
      </div>
    </div>
  );
}
