import { useStore } from "zustand";
import { performanceStore } from "@/store/performance";
import { Calendar, Users, Target, Zap } from "lucide-react";

export default function WeeklyKPIs() {
  const { userWeeklyActivitySummary } = useStore(performanceStore);

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
    <div className="space-y-3">
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
    </div>
  );
}
