import { useStore } from "zustand";
import { performanceStore } from "@/store/performance";
import { Users, Target, Crosshair, TrendingUp, ArrowUpRight, ArrowDownRight, Activity } from "lucide-react";
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

  // Calculate week-over-week changes and insights
  const prevWeekData = data.length > 1 ? data[1] : null;
  const accuracyTrend = prevWeekData ? 
    Math.round(((avgHitRatio - (prevWeekData.avg_hit_ratio_last_week || 0)) / (prevWeekData.avg_hit_ratio_last_week || 1)) * 100) : 0;
  const sessionsTrend = prevWeekData ? 
    Math.round(((totals.sessions - (prevWeekData.sessions_last_week || 0)) / (prevWeekData.sessions_last_week || 1)) * 100) : 0;
  
  const kpis = [
    { 
      value: Math.round(avgHitRatio * 100) || 0, 
      label: "Weekly Accuracy", 
      suffix: "%", 
      icon: Crosshair, 
      trend: accuracyTrend > 0 ? `+${accuracyTrend}%` : `${accuracyTrend}%`,
      positive: accuracyTrend >= 0,
      insight: accuracyTrend > 5 ? "Improving! 🎯" : accuracyTrend < -5 ? "Need practice" : "Stable",
      iconColor: theme === "dark" ? "text-green-400" : "text-green-600",
      bgColor: theme === "dark" ? "bg-green-900/20" : "bg-green-100"
    },
    { 
      value: totals.sessions || 0, 
      label: "Sessions This Week", 
      icon: Activity, 
      trend: sessionsTrend > 0 ? `+${sessionsTrend}%` : `${sessionsTrend}%`,
      positive: sessionsTrend >= 0,
      insight: totals.sessions >= 5 ? "Active week!" : "Train more",
      iconColor: theme === "dark" ? "text-blue-400" : "text-blue-600",
      bgColor: theme === "dark" ? "bg-blue-900/20" : "bg-blue-100"
    },
    { 
      value: Math.round(totals.targets / totals.sessions) || 0, 
      label: "Avg Targets/Session", 
      icon: Target, 
      trend: totals.sessions > 3 ? "Good pace" : "Low volume",
      positive: true,
      insight: "Consistency is key",
      iconColor: theme === "dark" ? "text-purple-400" : "text-purple-600",
      bgColor: theme === "dark" ? "bg-purple-900/20" : "bg-purple-100"
    },
    { 
      value: totals.trainings || 0, 
      label: "Group Trainings", 
      icon: Users, 
      trend: totals.trainings > 0 ? "Team player" : "Join team",
      positive: totals.trainings > 0,
      insight: totals.trainings > 2 ? "Great teamwork!" : "More team sessions?",
      iconColor: theme === "dark" ? "text-orange-400" : "text-orange-600",
      bgColor: theme === "dark" ? "bg-orange-900/20" : "bg-orange-100"
    },
  ];

  return (
    <div className={`rounded-xl p-3 ${theme === "dark" ? "bg-zinc-900/50" : "bg-white"}`}>
      {/* Modern Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className={`text-sm font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            📊 Performance Dashboard
          </h4>
          <p className={`text-xs ${theme === "dark" ? "text-zinc-400" : "text-gray-500"}`}>
            Weekly overview of key metrics
          </p>
        </div>
        <div className={`px-2 py-1 rounded-full text-[10px] font-medium ${
          theme === "dark" ? "bg-zinc-800 text-zinc-300" : "bg-gray-100 text-gray-600"
        }`}>
          Live
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {kpis.map((item, index) => {
          const IconComponent = item.icon;
          const TrendIcon = item.positive ? ArrowUpRight : ArrowDownRight;

          return (
            <div
              key={index}
              className={`relative overflow-hidden rounded-lg p-3 ${item.bgColor} 
                border ${theme === "dark" ? "border-zinc-700/50" : "border-gray-200"} 
                transition-transform hover:scale-[1.02]`}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className={`absolute -right-8 -top-8 w-24 h-24 rounded-full ${
                  theme === "dark" ? "bg-zinc-700" : "bg-gray-300"
                }`} />
              </div>
              
              {/* Content */}
              <div className="relative">
                {/* Icon and Trend */}
                <div className="flex items-start justify-between mb-2">
                  <div className={`p-2 rounded-lg ${theme === "dark" ? "bg-zinc-700/50" : "bg-gray-200"}`}>
                    <IconComponent className={`w-4 h-4 ${item.iconColor}`} />
                  </div>
                  <div className={`flex items-center gap-0.5 text-xs font-medium ${
                    item.positive 
                      ? theme === "dark" ? "text-emerald-400" : "text-emerald-600"
                      : theme === "dark" ? "text-red-400" : "text-red-600"
                  }`}>
                    <TrendIcon className="w-3 h-3" />
                    {item.trend}
                  </div>
                </div>
                
                {/* Value */}
                <div className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"} mb-1`}>
                  {item.value.toLocaleString()}{item.suffix}
                </div>
                
                {/* Label */}
                <div className={`text-xs ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>
                  {item.label}
                </div>
                
                {/* Insight */}
                {item.insight && (
                  <div className={`text-[10px] mt-0.5 font-medium ${
                    theme === "dark" ? "text-zinc-500" : "text-gray-500"
                  }`}>
                    {item.insight}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Stats Bar */}
      <div className={`mt-3 p-2 rounded-lg ${theme === "dark" ? "bg-zinc-800/30" : "bg-gray-50"} 
        flex items-center justify-between`}>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className={`text-xs ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>
              Active Now ✅
            </span>
          </div>
          <div className={`text-xs ${theme === "dark" ? "text-zinc-300" : "text-gray-700"}`}>
            Engagement Rate: <span className="font-semibold">{totals.sessions > 0 ? Math.round((totals.engagements / totals.sessions) * 100) : 0}%</span>
          </div>
          <div className={`text-xs ${theme === "dark" ? "text-zinc-300" : "text-gray-700"}`}>
            Avg Targets per Session: <span className="font-semibold">{totals.sessions > 0 ? Math.round(totals.targets / totals.sessions) : 0}</span>
          </div>
        </div>
        <TrendingUp className={`w-4 h-4 ${theme === "dark" ? "text-zinc-500" : "text-gray-400"}`} />
      </div>
    </div>
  );
}
