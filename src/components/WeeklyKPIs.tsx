import { useStore } from "zustand";
import { performanceStore } from "@/store/performance";
import { Calendar, Users, Target, Zap } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export default function WeeklyKPIs() {
  const { userWeeklyActivitySummary } = useStore(performanceStore);
  const { theme } = useTheme();

  if (!userWeeklyActivitySummary || userWeeklyActivitySummary.length === 0) {
    return null;
  }

  const data = userWeeklyActivitySummary;
  const totals = data.reduce(
    (acc: any, user: any) => ({
      trainings: acc.trainings + user.trainings_last_week,
      sessions: acc.sessions + user.sessions_last_week,
      engagements: acc.engagements + user.engagements_last_week,
      avgHitRatio: acc.avgHitRatio + user.avg_hit_ratio_last_week,
    }),
    { trainings: 0, sessions: 0, engagements: 0, avgHitRatio: 0 },
  );

  const avgHitRatio = data.length > 0 ? totals.avgHitRatio / data.length : 0;

  const getIcon = (index: number) => {
    const icons = [Calendar, Users, Target, Zap];
    return icons[index % icons.length];
  };

  const getColorClass = (index: number) => {
    const colors = [
      {
        dark: "from-blue-500/20 to-blue-600/10 border-blue-500/30",
        light: "from-blue-100 to-blue-50 border-blue-300",
        iconDark: "text-blue-400",
        iconLight: "text-blue-600"
      },
      {
        dark: "from-purple-500/20 to-purple-600/10 border-purple-500/30",
        light: "from-purple-100 to-purple-50 border-purple-300",
        iconDark: "text-purple-400",
        iconLight: "text-purple-600"
      },
      {
        dark: "from-emerald-500/20 to-emerald-600/10 border-emerald-500/30",
        light: "from-emerald-100 to-emerald-50 border-emerald-300",
        iconDark: "text-emerald-400",
        iconLight: "text-emerald-600"
      },
      {
        dark: "from-orange-500/20 to-orange-600/10 border-orange-500/30",
        light: "from-orange-100 to-orange-50 border-orange-300",
        iconDark: "text-orange-400",
        iconLight: "text-orange-600"
      }
    ];
    return colors[index % colors.length];
  };

  return (
    <div className={`rounded-xl border p-6 shadow-lg ${
      theme === "dark" 
        ? "bg-zinc-900/30 border-zinc-800/30" 
        : "bg-white border-gray-200"
    }`}>
      <div className="flex items-center gap-3 mb-6">
        <h3 className={`text-lg font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
          Weekly Activity Overview
        </h3>
        <div className={`flex-1 h-px ${theme === "dark" ? "bg-zinc-700" : "bg-gray-200"}`}></div>
        <span className={`text-sm ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>
          {data.length} members
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { value: totals.trainings || 0, label: "Trainings", suffix: "" },
          { value: totals.sessions || 0, label: "Sessions", suffix: "" },
          { value: totals.engagements || 0, label: "Engagements", suffix: "" },
          { value: Math.round(avgHitRatio * 100) || 0, label: "Hit Rate", suffix: "%" },
        ].map((item, index) => {
          const IconComponent = getIcon(index);
          const colors = getColorClass(index);

          return (
            <div
              key={index}
              className={`bg-gradient-to-br ${
                theme === "dark" ? colors.dark : colors.light
              } border rounded-xl p-6 text-center transition-all duration-200 hover:scale-105`}
            >
              <div className="flex items-center justify-center mb-3">
                <div className={`p-3 rounded-lg ${
                  theme === "dark" ? "bg-black/20" : "bg-white/50"
                }`}>
                  <IconComponent className={`w-6 h-6 ${
                    theme === "dark" ? colors.iconDark : colors.iconLight
                  }`} />
                </div>
              </div>
              <div className={`text-2xl lg:text-3xl font-bold font-mono mb-1 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}>
                {item.value.toLocaleString()}
                {item.suffix}
              </div>
              <div className={`text-sm ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>
                {item.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
