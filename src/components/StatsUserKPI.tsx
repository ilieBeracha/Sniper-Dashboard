import { useStore } from "zustand";
import { performanceStore } from "@/store/performance";
import { Calendar, Users, Target, Crosshair, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";
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
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: theme === "dark" ? "from-blue-500/20 to-cyan-500/20" : "from-blue-50 to-cyan-50"
    },
    { 
      value: totals.sessions || 0, 
      label: "Active Sessions", 
      icon: Users, 
      trend: "+8%",
      positive: true,
      gradient: "from-emerald-500 to-green-500",
      bgGradient: theme === "dark" ? "from-emerald-500/20 to-green-500/20" : "from-emerald-50 to-green-50"
    },
    { 
      value: totals.targets || 0, 
      label: "Targets Engaged", 
      icon: Target, 
      trend: "-3%",
      positive: false,
      gradient: "from-purple-500 to-pink-500",
      bgGradient: theme === "dark" ? "from-purple-500/20 to-pink-500/20" : "from-purple-50 to-pink-50"
    },
    { 
      value: Math.round(avgHitRatio * 100) || 0, 
      label: "Accuracy Rate", 
      suffix: "%", 
      icon: Crosshair, 
      trend: "+5%",
      positive: true,
      gradient: "from-orange-500 to-red-500",
      bgGradient: theme === "dark" ? "from-orange-500/20 to-red-500/20" : "from-orange-50 to-red-50"
    },
  ];

  return (
    <div className={`rounded-xl p-3 ${theme === "dark" ? "bg-zinc-900/50" : "bg-white"}`}>
      {/* Modern Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className={`text-sm font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            Performance Dashboard
          </h4>
          <p className={`text-xs ${theme === "dark" ? "text-zinc-400" : "text-gray-500"}`}>
            Weekly performance metrics
          </p>
        </div>
        <div className={`px-2 py-1 rounded-full text-[10px] font-medium ${
          theme === "dark" ? "bg-green-500/20 text-green-400" : "bg-green-100 text-green-700"
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
              className={`relative overflow-hidden rounded-lg p-3 bg-gradient-to-br ${item.bgGradient} 
                border ${theme === "dark" ? "border-zinc-700/50" : "border-gray-200"} 
                transition-transform hover:scale-[1.02]`}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className={`absolute -right-8 -top-8 w-24 h-24 rounded-full bg-gradient-to-br ${item.gradient}`} />
                <div className={`absolute -left-4 -bottom-4 w-16 h-16 rounded-full bg-gradient-to-br ${item.gradient}`} />
              </div>
              
              {/* Content */}
              <div className="relative">
                {/* Icon and Trend */}
                <div className="flex items-start justify-between mb-2">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${item.gradient} shadow-lg`}>
                    <IconComponent className="w-4 h-4 text-white" />
                  </div>
                  <div className={`flex items-center gap-0.5 text-xs font-medium ${
                    item.positive ? "text-green-500" : "text-red-500"
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
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className={`text-xs ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>
              Active Now
            </span>
          </div>
          <div className={`text-xs ${theme === "dark" ? "text-zinc-300" : "text-gray-700"}`}>
            <span className="font-semibold">{totals.sessions > 0 ? Math.round((totals.engagements / totals.sessions) * 100) : 0}%</span> Engagement Rate
          </div>
          <div className={`text-xs ${theme === "dark" ? "text-zinc-300" : "text-gray-700"}`}>
            <span className="font-semibold">{totals.sessions > 0 ? Math.round(totals.targets / totals.sessions) : 0}</span> Avg Targets/Session
          </div>
        </div>
        <TrendingUp className={`w-4 h-4 ${theme === "dark" ? "text-zinc-500" : "text-gray-400"}`} />
      </div>
    </div>
  );
}
