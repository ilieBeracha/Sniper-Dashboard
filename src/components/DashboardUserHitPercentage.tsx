import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useStore } from "zustand";
import { performanceStore } from "@/store/performance";
import NoDataDisplay from "./base/BaseNoData";
import { useTheme } from "@/contexts/ThemeContext";
import { useEffect } from "react";
import { userStore } from "@/store/userStore";
import { useIsMobile } from "@/hooks/useIsMobile";

interface UserHitPercentageProps {
  distance?: string | null;
  position?: string | null;
  weaponType?: string | null;
}

export default function UserHitPercentage({ distance = null, position = null, weaponType = null }: UserHitPercentageProps) {
  const { userHitsStats, userHitsStatsLoading, getUserHitStatsWithFilters } = useStore(performanceStore);
  const { user } = useStore(userStore);
  const { theme } = useTheme();
  const isMobile = useIsMobile();

  // Fetch data when filters change
  useEffect(() => {
    if (user?.id) {
      getUserHitStatsWithFilters(user.id, distance, position, weaponType);
    }
  }, [distance, position, weaponType, user?.id, getUserHitStatsWithFilters]);

  if (userHitsStatsLoading || !userHitsStats) {
    return (
      <div className="h-full flex justify-center items-center w-full text-sm">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const percentage = userHitsStats.hit_percentage ?? 0;
  const gaugeData = [
    { name: "Hit", value: percentage },
    { name: "Miss", value: 100 - percentage },
  ];

  const getColor = (pct: number) => {
    if (pct >= 75) return "#7E3AF2";
    if (pct >= 50) return "#FF8906";
    return "#ec4242";
  };

  const hitColor = getColor(percentage);

  return (
    <div className="flex w-full flex-col h-full justify-evenly col-auto text-sm p-4  rounded-lg shadow-sm ">
      <div className=" relative justify-between flex h-full flex-col gap-2">
        {!userHitsStats.hit_percentage && userHitsStats.shots_fired === 0 ? (
          <NoDataDisplay />
        ) : (
          <>
            <ResponsiveContainer width="100%" height={isMobile ? 200 : 280} minWidth={isMobile ? 200 : 280} className="text-sm ">
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
                  <Cell fill={theme === "dark" ? "#333" : " #e5e7eb"} />
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            <div className="absolute inset-0 flex flex-col mt-1 h-8">
              <span className={`px-2 text-2xl font-bold transition-colors duration-200 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                {percentage ? percentage.toFixed(1) : 0}%
              </span>
              <span
                className={`text-lg uppercase tracking-wider transition-colors duration-200 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
              >
                Accuracy
              </span>
            </div>
            <div className="grid grid-cols-1 gap-3 mt-2">
              <div className={`p-2 rounded-lg transition-colors duration-200 ${theme === "dark" ? "bg-[#1A1A1A]" : "bg-gray-100"}`}>
                <div className="flex justify-between">
                  <span className={`text-lg transition-colors duration-200 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                    Total Shots
                  </span>
                  <span
                    className={`text-xs px-1.5 py-1.5 rounded-md transition-colors duration-200 ${theme === "dark" ? "bg-gray-800 text-gray-300" : "bg-gray-200 text-gray-700"}`}
                  >
                    {userHitsStats.shots_fired}
                  </span>
                </div>
                <div
                  className={`mt-1 h-1 w-full rounded-full overflow-hidden transition-colors duration-200 ${theme === "dark" ? "bg-gray-800" : "bg-gray-300"}`}
                >
                  <div className="h-full rounded-full bg-purple-600" style={{ width: `100%` }}></div>
                </div>
              </div>

              <div className={`p-2 rounded-lg transition-colors duration-200 ${theme === "dark" ? "bg-[#1A1A1A]" : "bg-gray-100"}`}>
                <div className="flex justify-between">
                  <span className={`text-xs transition-colors duration-200 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                    Confirmed Hits
                  </span>
                  <span
                    className={`text-xs px-1.5 py-1.5 rounded-md transition-colors duration-200 ${theme === "dark" ? "bg-gray-800 text-gray-300" : "bg-gray-200 text-gray-700"}`}
                  >
                    {userHitsStats.confirmed_hits}
                  </span>
                </div>
                <div
                  className={`mt-1 h-1 w-full rounded-full overflow-hidden transition-colors duration-200 ${theme === "dark" ? "bg-gray-800" : "bg-gray-300"}`}
                >
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${(userHitsStats.confirmed_hits / userHitsStats.shots_fired) * 100}%`, backgroundColor: hitColor }}
                  ></div>
                </div>
              </div>
            </div>
            <div className={`mt-3 text-center text-xs transition-colors duration-200 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              <span className={`px-2 py-0.5 rounded transition-colors duration-200 ${theme === "dark" ? "bg-[#1A1A1A]" : "bg-gray-100"}`}>
                {userHitsStats.session_count} Training Sessions Completed
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
