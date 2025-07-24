import { useTheme } from "@/contexts/ThemeContext";
import BaseDashboardCard from "./base/BaseDashboardCard";

const squadData = [
  { week: "Week 1", alpha: 85, bravo: 78, charlie: 92, delta: 88 },
  { week: "Week 2", alpha: 88, bravo: 82, charlie: 89, delta: 91 },
  { week: "Week 3", alpha: 92, bravo: 85, charlie: 94, delta: 87 },
];

const squads = [
  { name: "Alpha", color: "indigo" },
  { name: "Bravo", color: "emerald" },
  { name: "Charlie", color: "amber" },
  { name: "Delta", color: "purple" },
];

export default function DashboardSquadProgress() {
  const { theme } = useTheme();

  const getBarColor = (squad: string) => {
    const colors = {
      alpha: theme === "dark" ? "bg-indigo-500" : "bg-indigo-600",
      bravo: theme === "dark" ? "bg-emerald-500" : "bg-emerald-600",
      charlie: theme === "dark" ? "bg-amber-500" : "bg-amber-600",
      delta: theme === "dark" ? "bg-purple-500" : "bg-purple-600",
    };
    return colors[squad as keyof typeof colors] || colors.alpha;
  };

  const getLegendColor = (color: string) => {
    const colors = {
      indigo: theme === "dark" ? "bg-indigo-500" : "bg-indigo-600",
      emerald: theme === "dark" ? "bg-emerald-500" : "bg-emerald-600",
      amber: theme === "dark" ? "bg-amber-500" : "bg-amber-600",
      purple: theme === "dark" ? "bg-purple-500" : "bg-purple-600",
    };
    return colors[color as keyof typeof colors] || colors.indigo;
  };

  return (
    <BaseDashboardCard header="Squad Training Progress" tooltipContent="Weekly training session completion rates by squad">
      <div className="px-4 pb-4">
        <div className="flex items-center gap-6 mb-6">
          {squads.map((squad) => (
            <div key={squad.name} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-sm ${getLegendColor(squad.color)}`}></div>
              <span className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>{squad.name} Squad</span>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          {squadData.map((week) => (
            <div key={week.week}>
              <p className={`text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>{week.week}</p>
              <div className="grid grid-cols-4 gap-2">
                <div className="space-y-1">
                  <div className={`h-2 rounded-full ${theme === "dark" ? "bg-white/10" : "bg-gray-200"}`}>
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${getBarColor("alpha")}`}
                      style={{ width: `${week.alpha}%` }}
                    ></div>
                  </div>
                  <p className={`text-xs text-center ${theme === "dark" ? "text-gray-500" : "text-gray-600"}`}>{week.alpha}%</p>
                </div>
                <div className="space-y-1">
                  <div className={`h-2 rounded-full ${theme === "dark" ? "bg-white/10" : "bg-gray-200"}`}>
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${getBarColor("bravo")}`}
                      style={{ width: `${week.bravo}%` }}
                    ></div>
                  </div>
                  <p className={`text-xs text-center ${theme === "dark" ? "text-gray-500" : "text-gray-600"}`}>{week.bravo}%</p>
                </div>
                <div className="space-y-1">
                  <div className={`h-2 rounded-full ${theme === "dark" ? "bg-white/10" : "bg-gray-200"}`}>
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${getBarColor("charlie")}`}
                      style={{ width: `${week.charlie}%` }}
                    ></div>
                  </div>
                  <p className={`text-xs text-center ${theme === "dark" ? "text-gray-500" : "text-gray-600"}`}>{week.charlie}%</p>
                </div>
                <div className="space-y-1">
                  <div className={`h-2 rounded-full ${theme === "dark" ? "bg-white/10" : "bg-gray-200"}`}>
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${getBarColor("delta")}`}
                      style={{ width: `${week.delta}%` }}
                    ></div>
                  </div>
                  <p className={`text-xs text-center ${theme === "dark" ? "text-gray-500" : "text-gray-600"}`}>{week.delta}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </BaseDashboardCard>
  );
}
