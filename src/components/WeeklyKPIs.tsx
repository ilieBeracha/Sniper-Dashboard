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

  const getMetricStyle = (index: number) => {
    const styles = [
      { gradient: "from-blue-600 to-cyan-600", shadow: "shadow-blue-500/25" },
      { gradient: "from-purple-600 to-pink-600", shadow: "shadow-purple-500/25" },
      { gradient: "from-emerald-600 to-green-600", shadow: "shadow-emerald-500/25" },
      { gradient: "from-orange-600 to-red-600", shadow: "shadow-orange-500/25" },
    ];
    return styles[index % styles.length];
  };

  return (
    <div className={theme === "dark" 
      ? "bg-zinc-900/50 backdrop-blur-sm p-4" 
      : "bg-white shadow-sm p-4"}>
      {theme === "dark" ? (
        <>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-emerald-400 to-emerald-600 rounded-full"></div>
              <h3 className="text-base font-bold text-white tracking-tight">Weekly Performance</h3>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-zinc-700 via-zinc-600 to-transparent"></div>
            <span className="text-xs text-zinc-400 font-medium">{data.length} members active</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { value: totals.trainings || 0, label: "Trainings", suffix: "" },
              { value: totals.sessions || 0, label: "Sessions", suffix: "" },
              { value: totals.engagements || 0, label: "Engagements", suffix: "" },
              { value: Math.round(avgHitRatio * 100) || 0, label: "Hit Rate", suffix: "%" },
            ].map((item, index) => {
              const IconComponent = getIcon(index);
              const style = getMetricStyle(index);

              return (
                <div 
                  key={index} 
                  className={`relative group overflow-hidden bg-zinc-800/40 border border-zinc-700/50 rounded-xl p-4 
                    hover:border-zinc-600 transition-all duration-300 hover:shadow-lg ${style.shadow}`}
                >
                  {/* Animated gradient background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} opacity-0 
                    group-hover:opacity-10 transition-opacity duration-300`}></div>
                  
                  {/* Content */}
                  <div className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <IconComponent className="w-4 h-4 text-zinc-500 group-hover:text-zinc-400 transition-colors" />
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${style.gradient} 
                        animate-pulse opacity-75`}></div>
                    </div>
                    <div className="text-2xl font-bold text-white font-mono tracking-tight 
                      group-hover:scale-105 transition-transform origin-left">
                      {item.value.toLocaleString()}
                      <span className="text-zinc-400 text-lg">{item.suffix}</span>
                    </div>
                    <div className="text-xs text-zinc-500 mt-1 font-medium">{item.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full"></div>
              <h3 className="text-lg font-bold text-gray-900">Weekly Performance</h3>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-gray-200 via-gray-100 to-transparent"></div>
            <span className="text-sm text-gray-500">{data.length} members active</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { value: totals.trainings || 0, label: "Trainings", suffix: "", color: "blue" },
              { value: totals.sessions || 0, label: "Sessions", suffix: "", color: "purple" },
              { value: totals.engagements || 0, label: "Engagements", suffix: "", color: "emerald" },
              { value: Math.round(avgHitRatio * 100) || 0, label: "Hit Rate", suffix: "%", color: "orange" },
            ].map((item, index) => {
              const IconComponent = getIcon(index);
              const style = getMetricStyle(index);
              const colorClasses = {
                blue: "from-blue-50 to-white border-blue-200 text-blue-600 hover:border-blue-300",
                purple: "from-purple-50 to-white border-purple-200 text-purple-600 hover:border-purple-300",
                emerald: "from-emerald-50 to-white border-emerald-200 text-emerald-600 hover:border-emerald-300",
                orange: "from-orange-50 to-white border-orange-200 text-orange-600 hover:border-orange-300",
              };
              const bgColor = colorClasses[item.color as keyof typeof colorClasses];

              return (
                <div
                  key={index}
                  className={`relative group bg-gradient-to-br ${bgColor} border rounded-xl p-4 
                    transition-all duration-300 hover:shadow-md hover:scale-105`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-1.5 rounded-lg bg-white/80 shadow-sm">
                      <IconComponent className={`w-4 h-4 ${bgColor.split(' ')[3]}`} />
                    </div>
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${style.gradient} 
                      animate-pulse opacity-50`}></div>
                  </div>
                  <div className="text-2xl font-bold font-mono text-gray-900">
                    {item.value.toLocaleString()}
                    <span className="text-gray-500 text-lg">{item.suffix}</span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">{item.label}</div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
