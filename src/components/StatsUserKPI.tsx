import { useTheme } from "@/contexts/ThemeContext";
import { Calendar, Users, Target, Crosshair, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useStore } from "zustand";
import { useStatsStore } from "@/store/statsStore";

const pct = (v?: number | null) => (v == null ? "—" : `${Math.round(v * 100)}%`);
const pos = (v?: number | null) => (v ?? 0) >= 0;

export default function StatsUserKPI() {
  const { statsOverviewTotals } = useStore(useStatsStore);
  const { theme } = useTheme();

  if (!statsOverviewTotals) return null;

  const row = statsOverviewTotals;

  const kpis = [
    {
      value: row.sessions,
      label: "Training Sessions",
      icon: Calendar,
      trend: pct(row.sessions_change_pct),
      positive: pos(row.sessions_change_pct),
    },
    {
      value: row.sessions,
      label: "Active Sessions",
      icon: Users,
      trend: pct(0.1),
      positive: pos(0.1),
    },
    {
      value: row.targets,
      label: "Targets Engaged",
      icon: Target,
      trend: pct(row.targets_change_pct),
      positive: pos(row.targets_change_pct),
    },
    {
      value: row.hit_pct,
      label: "Accuracy Rate",
      suffix: "%",
      icon: Crosshair,
      trend: pct(row.hit_ratio_change_pct),
      positive: pos(row.hit_ratio_change_pct),
    },
  ];

  const iconColor = theme === "dark" ? "text-zinc-400" : "text-gray-600";
  const bgHover = theme === "dark" ? "bg-zinc-800/30" : "bg-gray-50";
  const border = theme === "dark" ? "border-zinc-800" : "border-gray-200";
  const textMain = theme === "dark" ? "text-white" : "text-gray-900";
  const textSub = theme === "dark" ? "text-zinc-400" : "text-gray-600";
  const divide = theme === "dark" ? "divide-zinc-800" : "divide-gray-200";

  return (
    <div className={`rounded-xl ${theme === "dark" ? "bg-zinc-900/50" : "bg-white"} border ${border}`}>
      <div className={`grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 ${divide}`}>
        {kpis.map((item, idx) => {
          const Icon = item.icon;
          const TrendIcon = item.positive ? ArrowUpRight : ArrowDownRight;
          return (
            <div key={idx} className={`p-4 lg:p-5 hover:${bgHover} transition-colors`}>
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-4 h-4 ${iconColor}`} />
                <div
                  className={`flex items-center gap-0.5 text-[11px] font-medium ${
                    item.positive ? (theme === "dark" ? "text-emerald-400" : "text-emerald-600") : theme === "dark" ? "text-red-400" : "text-red-600"
                  }`}
                >
                  <TrendIcon className="w-3 h-3" />
                  {item.trend}
                </div>
              </div>

              <div>
                <div className={`text-xl lg:text-2xl font-bold ${textMain}`}>
                  {item.value.toLocaleString()}
                  {item.suffix}
                </div>
                <div className={`text-xs ${textSub} mt-0.5`}>{item.label}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
