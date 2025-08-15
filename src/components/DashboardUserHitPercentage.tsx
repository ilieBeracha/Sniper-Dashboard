import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useStore } from "zustand";
import { performanceStore } from "@/store/performance";
import NoDataDisplay from "./base/BaseNoData";
import { useTheme } from "@/contexts/ThemeContext";
import { useEffect } from "react";
import { userStore } from "@/store/userStore";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Target, Zap } from "lucide-react";

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
    <div className="flex w-full h-full justify-evenly col-auto text-sm p-4 rounded-lg shadow-sm">
      <div className="relative flex h-full w-full gap-6">
        {!userHitsStats.hit_percentage && userHitsStats.shots_fired === 0 ? (
          <NoDataDisplay />
        ) : (
          <div className="flex flex-col lg:flex-row w-full gap-6 items-center justify-center">
            {/* Chart Section - Much Bigger */}
            <div className="relative flex-shrink-0">
              <ResponsiveContainer width={isMobile ? 250 : 350} height={isMobile ? 200 : 280} className="text-sm">
                <PieChart>
                  <Pie
                    data={gaugeData}
                    cx="50%"
                    cy="80%"
                    startAngle={180}
                    endAngle={0}
                    innerRadius="65%"
                    outerRadius="95%"
                    paddingAngle={0}
                    dataKey="value"
                    cornerRadius={8}
                  >
                    <Cell fill={hitColor} />
                    <Cell fill={theme === "dark" ? "#27272a" : "#e5e7eb"} />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              
              {/* Center Stats - Much Bigger */}
              <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ paddingBottom: '20px' }}>
                <span className={`text-5xl lg:text-6xl font-bold transition-colors duration-200 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  {percentage ? percentage.toFixed(1) : 0}%
                </span>
                <span
                  className={`text-lg uppercase tracking-wider font-medium transition-colors duration-200 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
                >
                  Hit Rate
                </span>
                <div className={`mt-2 text-sm ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>
                  Accuracy Score
                </div>
              </div>
            </div>

            {/* Enhanced Stats Section */}
            <div className="flex flex-col gap-4 flex-1 max-w-lg">
              {/* Key Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Total Shots Card */}
                <div className={`p-4 rounded-xl transition-all duration-200 ${
                  theme === "dark" ? "bg-zinc-800/50 border border-zinc-700/50" : "bg-gray-50 border border-gray-200"
                }`}>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Target className={`w-5 h-5 ${theme === "dark" ? "text-purple-400" : "text-purple-600"}`} />
                      <span className={`text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                        Total Shots Fired
                      </span>
                    </div>
                    <div className={`text-3xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                      {userHitsStats.shots_fired.toLocaleString()}
                    </div>
                    <div className={`w-full h-2 rounded-full overflow-hidden ${theme === "dark" ? "bg-gray-800" : "bg-gray-200"}`}>
                      <div className="h-full rounded-full bg-purple-500" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                </div>

                {/* Confirmed Hits Card */}
                <div className={`p-4 rounded-xl transition-all duration-200 ${
                  theme === "dark" ? "bg-zinc-800/50 border border-zinc-700/50" : "bg-gray-50 border border-gray-200"
                }`}>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Zap className={`w-5 h-5 ${theme === "dark" ? "text-emerald-400" : "text-emerald-600"}`} />
                      <span className={`text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                        Confirmed Hits
                      </span>
                    </div>
                    <div className={`text-3xl font-bold ${theme === "dark" ? "text-emerald-400" : "text-emerald-600"}`}>
                      {userHitsStats.confirmed_hits.toLocaleString()}
                    </div>
                    <div className={`w-full h-2 rounded-full overflow-hidden ${theme === "dark" ? "bg-gray-800" : "bg-gray-200"}`}>
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${(userHitsStats.confirmed_hits / userHitsStats.shots_fired) * 100}%`, 
                          backgroundColor: hitColor 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Stats */}
              <div className={`p-4 rounded-xl ${theme === "dark" ? "bg-zinc-800/30 border border-zinc-700/50" : "bg-gray-50 border border-gray-200"}`}>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                      {userHitsStats.session_count}
                    </div>
                    <div className={`text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-600"}`}>
                      Sessions
                    </div>
                  </div>
                  <div>
                    <div className={`text-2xl font-bold ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`}>
                      {userHitsStats.eliminated_targets || 0}
                    </div>
                    <div className={`text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-600"}`}>
                      Eliminations
                    </div>
                  </div>
                  <div>
                    <div className={`text-2xl font-bold ${
                      percentage >= 75 
                        ? theme === "dark" ? "text-emerald-400" : "text-emerald-600"
                        : percentage >= 50
                          ? theme === "dark" ? "text-amber-400" : "text-amber-600"
                          : theme === "dark" ? "text-red-400" : "text-red-600"
                    }`}>
                      {percentage >= 75 ? "Expert" : percentage >= 50 ? "Good" : "Training"}
                    </div>
                    <div className={`text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-600"}`}>
                      Level
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Indicator */}
              <div className={`text-center p-3 rounded-lg ${
                percentage >= 75 
                  ? theme === "dark" ? "bg-emerald-500/10 border border-emerald-500/30" : "bg-emerald-50 border border-emerald-200"
                  : percentage >= 50
                    ? theme === "dark" ? "bg-amber-500/10 border border-amber-500/30" : "bg-amber-50 border border-amber-200"
                    : theme === "dark" ? "bg-red-500/10 border border-red-500/30" : "bg-red-50 border border-red-200"
              }`}>
                <div className={`text-sm font-medium ${
                  percentage >= 75 
                    ? theme === "dark" ? "text-emerald-400" : "text-emerald-700"
                    : percentage >= 50
                      ? theme === "dark" ? "text-amber-400" : "text-amber-700"
                      : theme === "dark" ? "text-red-400" : "text-red-700"
                }`}>
                  {percentage >= 75 
                    ? "🎯 Outstanding Performance - Keep it up!"
                    : percentage >= 50
                      ? "📈 Good Progress - Room for improvement"
                      : "💪 Keep Training - Practice makes perfect"}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
