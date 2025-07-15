import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { useStore } from "zustand";
import { performanceStore } from "@/store/performance";
import NoDataDisplay from "./base/BaseNoData";
import { useTheme } from "@/contexts/ThemeContext";

export default function UserHitPercentage() {
  const { userHitsStats } = useStore(performanceStore);
  const { theme } = useTheme();

  if (!userHitsStats) {
    return (
      <div className="h-full flex justify-center items-center w-full text-sm">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const percentage = userHitsStats.hit_percentage ?? 0;
  const confirmedPercentage = userHitsStats.confirmed_hit_percentage ?? 0;
  const gaugeData = [
    { name: `Hit (${percentage.toFixed(1)}%)`, value: percentage },
    { name: `Miss (${(100 - percentage).toFixed(1)}%)`, value: 100 - percentage },
  ];

  const getColor = (pct: number) => {
    if (pct >= 75) return "#2CB67D";
    if (pct >= 50) return "#FF8906";
    return "#F25F4C";
  };

  const hitColor = getColor(percentage);

  return (
    <div className="flex w-full relative flex-col h-full justify-evenly col-auto text-sm p-4">
      <div className="relative justify-between flex h-full flex-col gap-2">
        {userHitsStats.shots_fired === 0 ? (
          <NoDataDisplay />
        ) : (
          <>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={gaugeData}
                  cx="50%"
                  cy="80%"
                  startAngle={180}
                  endAngle={0}
                  innerRadius="60%"
                  outerRadius="90%"
                  paddingAngle={0}
                  dataKey="value"
                  cornerRadius={6}
                >
                  <Cell fill={hitColor} />
                  <Cell fill={theme === "dark" ? "#333" : "#e5e7eb"} />
                </Pie>
                <Tooltip
                  formatter={(value: number, name: string) => [`${value.toFixed(1)}%`, name]}
                  contentStyle={{
                    backgroundColor: theme === "dark" ? "#161616" : "#ffffff",
                    border: `1px solid ${theme === "dark" ? "#444444" : "#d1d5db"}`,
                    borderRadius: "6px",
                    fontSize: "0.75rem",
                  }}
                  itemStyle={{ color: theme === "dark" ? "#CCCCCC" : "#374151" }}
                  labelFormatter={() => `Confirmed Accuracy: ${confirmedPercentage.toFixed(1)}%`}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="absolute top-1 left-1 inset-0 flex flex-col items-center mb-6">
              <div className="text-2xl font-bold ">
                <span className={theme === "dark" ? "text-white" : "text-gray-900"}>{percentage.toFixed(1)}%</span>
              </div>
              <span className={`text-xs uppercase tracking-wider ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Accuracy</span>
            </div>

            <div className="grid grid-cols-1 gap-3 mt-2">
              {/* Shots Fired */}
              <div className={`p-2 rounded-lg ${theme === "dark" ? "bg-[#1A1A1A]" : "bg-gray-100"}`}>
                <div className="flex justify-between">
                  <span className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Shots Fired</span>
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-md ${theme === "dark" ? "bg-gray-800 text-gray-300" : "bg-gray-200 text-gray-700"}`}
                  >
                    {userHitsStats.shots_fired}
                  </span>
                </div>
                <div className={`mt-1 h-1 w-full rounded-full ${theme === "dark" ? "bg-gray-800" : "bg-gray-300"}`}>
                  <div className="h-full rounded-full bg-blue-500" style={{ width: `100%` }}></div>
                </div>
              </div>

              {/* Confirmed Hits */}
              <div className={`p-2 rounded-lg ${theme === "dark" ? "bg-[#1A1A1A]" : "bg-gray-100"}`}>
                <div className="flex justify-between">
                  <span className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Confirmed Hits</span>
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-md ${theme === "dark" ? "bg-gray-800 text-gray-300" : "bg-gray-200 text-gray-700"}`}
                  >
                    {userHitsStats.confirmed_hits}
                  </span>
                </div>
                <div className={`mt-1 h-1 w-full rounded-full ${theme === "dark" ? "bg-gray-800" : "bg-gray-300"}`}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(userHitsStats.confirmed_hits / userHitsStats.shots_fired) * 100}%`,
                      backgroundColor: hitColor,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className={`mt-3 text-center text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              <span className={`px-2 py-0.5 rounded ${theme === "dark" ? "bg-[#1A1A1A]" : "bg-gray-100"}`}>
                {userHitsStats.session_count} Sessions Completed
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
