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

  const getIcon = (index: number) => {
    const icons = [Calendar, Users, Target, Crosshair, Zap];
    return icons[index % icons.length];
  };

  return (
    <div className={`rounded-lg ${theme === "dark" ? "" : "bg-white border-gray-200"}`}>
      <div className="mb-3">
        <h4 className={`text-base font-semibold ${theme === "dark" ? "text-zinc-200" : "text-gray-800"}`}>User Performance</h4>
        <p className={`text-xs mt-0.5 ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>Last 7 days</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { value: totals.trainings || 0, label: "Trainings", suffix: "" },
          { value: totals.sessions || 0, label: "Sessions", suffix: "" },
          { value: totals.targets || 0, label: "Targets", suffix: "" },
          { value: Math.round(avgHitRatio * 100) || 0, label: "Hit Rate", suffix: "%" },
        ].map((item, index) => {
          const IconComponent = getIcon(index);

          return (
            <div
              key={index}
              className={`border rounded-lg p-3 ${
                theme === "dark" ? "bg-zinc-900/60 border-zinc-800 hover:bg-zinc-800/60" : "bg-white border-gray-200 hover:bg-gray-50"
              } transition-colors`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-md ${theme === "dark" ? "bg-zinc-800" : "bg-gray-100"}`}>
                  <IconComponent className={`w-4 h-4 ${theme === "dark" ? "text-zinc-300" : "text-gray-600"}`} />
                </div>
              </div>
              <div className={`text-xl font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"} tracking-tight`}>
                {item.value.toLocaleString()}
                <span className={`${theme === "dark" ? "text-zinc-400" : "text-gray-500"} text-sm ml-1`}>{item.suffix}</span>
              </div>
              <div className={`text-xs ${theme === "dark" ? "text-zinc-400" : "text-gray-600"} mt-0.5`}>{item.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
