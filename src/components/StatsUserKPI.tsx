import { useTheme } from "@/contexts/ThemeContext";
import { Calendar, Crosshair, TrendingUp } from "lucide-react";
import { useStore } from "zustand";
import { useStatsStore } from "@/store/statsStore";

export default function StatsUserKPI() {
  const { statsOverviewTotals } = useStore(useStatsStore);
  const { theme } = useTheme();

  if (!statsOverviewTotals) return null;

  const row = statsOverviewTotals;

  const kpis = [
    {
      value: row.sessions,
      label: "Sessions",
      icon: Calendar,
      color: theme === "dark" ? "text-violet-400" : "text-violet-600",
    },

    {
      value: (row.hit_pct * 100).toFixed(1),
      label: "Accuracy",
      suffix: "%",
      icon: Crosshair,
      color: theme === "dark" ? "text-emerald-400" : "text-emerald-600",
    },
    {
      value: (row.elimination_pct * 100).toFixed(1),
      label: "Elimination",
      suffix: "%",
      icon: TrendingUp,
      color: theme === "dark" ? "text-orange-400" : "text-orange-600",
    },
  ];

  const bgCard = theme === "dark" ? "bg-zinc-900/50" : "bg-white";
  const border = theme === "dark" ? "border-zinc-800" : "border-gray-200";
  const textMain = theme === "dark" ? "text-white" : "text-gray-900";
  const textSub = theme === "dark" ? "text-zinc-500" : "text-gray-500";

  return (
    <div className={` ${bgCard} border ${border}`}>
      <div className="grid grid-cols-3  md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-zinc-800/50">
        {kpis.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="p-2.5 lg:p-3 flex flex-col items-center justify-center">
              <div className="flex items-start justify-between mb-0.5">
                <Icon className={`w-3 h-3 ${item.color}`} />
              </div>
              <div className={`text-base lg:text-lg font-semibold ${textMain}`}>
                {item?.value?.toLocaleString()}
                {item?.suffix}
              </div>
              <div className={`text-[10px] ${textSub} mt-0.5`}>{item?.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
