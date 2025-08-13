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

  return (
    <div className={theme === "dark" ? "space-y-3" : "rounded-xl border p-4 shadow-lg bg-white border-gray-200"}>
      {theme === "dark" ? (
        <>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-white">Weekly Activity</h3>
            <div className="flex-1 h-px bg-zinc-700"></div>
            <span className="text-xs text-zinc-500">{data.length} members</span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[
              { value: totals.trainings || 0, label: "Trainings", suffix: "" },
              { value: totals.sessions || 0, label: "Sessions", suffix: "" },
              { value: totals.engagements || 0, label: "Engagements", suffix: "" },
              { value: Math.round(avgHitRatio * 100) || 0, label: "Hit Rate", suffix: "%" },
            ].map((item, index) => {
              const IconComponent = getIcon(index);

              return (
                <div key={index} className="bg-zinc-800/30 border border-zinc-700/30 rounded p-2 text-center">
                  <div className="flex items-center justify-center mb-1">
                    <IconComponent className="w-3 h-3 text-zinc-400" />
                  </div>
                  <div className="text-lg font-semibold text-white font-mono">
                    {item.value.toLocaleString()}
                    {item.suffix}
                  </div>
                  <div className="text-xs text-zinc-500">{item.label}</div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Weekly Activity Overview</h3>
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-sm text-gray-500">{data.length} members</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { value: totals.trainings || 0, label: "Trainings", suffix: "", color: "blue" },
              { value: totals.sessions || 0, label: "Sessions", suffix: "", color: "purple" },
              { value: totals.engagements || 0, label: "Engagements", suffix: "", color: "emerald" },
              { value: Math.round(avgHitRatio * 100) || 0, label: "Hit Rate", suffix: "%", color: "orange" },
            ].map((item, index) => {
              const IconComponent = getIcon(index);
              const colorClasses = {
                blue: "from-blue-100 to-blue-50 border-blue-300 text-blue-600",
                purple: "from-purple-100 to-purple-50 border-purple-300 text-purple-600",
                emerald: "from-emerald-100 to-emerald-50 border-emerald-300 text-emerald-600",
                orange: "from-orange-100 to-orange-50 border-orange-300 text-orange-600",
              };
              const bgColor = colorClasses[item.color as keyof typeof colorClasses];

              return (
                <div
                  key={index}
                  className={`bg-gradient-to-br ${bgColor} border rounded-lg p-4 text-center transition-all duration-200 hover:scale-105`}
                >
                  <div className="flex items-center justify-center mb-2">
                    <div className="p-2 rounded-lg bg-white/50">
                      <IconComponent className={`w-5 h-5 ${bgColor.split(' ')[3]}`} />
                    </div>
                  </div>
                  <div className="text-2xl font-bold font-mono mb-1 text-gray-900">
                    {item.value.toLocaleString()}
                    {item.suffix}
                  </div>
                  <div className="text-sm text-gray-600">{item.label}</div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
