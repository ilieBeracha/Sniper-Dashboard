import { useMemo } from "react";
import { useStore } from "zustand";
import { performanceStore } from "@/store/performance";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useTheme } from "@/contexts/ThemeContext";

interface FirstShotData {
  position: "Lying" | "Sitting" | "Standing" | "Operational";
  distance_bucket: number;
  targets: number;
  first_shot_hit_rate: number;
  avg_time_to_first_shot_sec: number | null;
}

export default function ChartMatrix() {
  const { firstShotMatrix, isLoading } = useStore(performanceStore);
  const { theme } = useTheme();

  const matrixData = useMemo(() => {
    if (!firstShotMatrix || isLoading) return { positions: [], distances: [], grid: {} };

    const data = firstShotMatrix as FirstShotData[];
    const positions = ["Lying", "Sitting", "Standing", "Operational"];
    const distances = Array.from(new Set(data.map((d) => d.distance_bucket))).sort((a, b) => a - b);

    const grid: Record<string, Record<number, FirstShotData>> = {};

    data.forEach((item) => {
      if (!grid[item.position]) {
        grid[item.position] = {};
      }
      grid[item.position][item.distance_bucket] = item;
    });

    return { positions, distances, grid };
  }, [firstShotMatrix, isLoading]);

  if (isLoading) {
    return (
      <div className={theme === "dark" 
        ? "bg-zinc-900/50 backdrop-blur-sm p-4" 
        : "bg-white shadow-sm p-4"}>
        <div className="animate-pulse space-y-3">
          <div className={`h-4 rounded w-1/3 ${theme === "dark" ? "bg-zinc-800" : "bg-gray-200"}`}></div>
          <div className="grid grid-cols-5 gap-2">
            {[...Array(20)].map((_, i) => (
              <div key={i} className={`h-10 rounded-lg ${theme === "dark" ? "bg-zinc-800" : "bg-gray-200"}`}></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!firstShotMatrix || matrixData.positions.length === 0) {
    return (
      <div className={theme === "dark" 
        ? "bg-zinc-900/50 backdrop-blur-sm p-4 text-center" 
        : "bg-white shadow-sm p-4 text-center"}>
        <p className={`text-sm ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>
          No first shot data available
        </p>
      </div>
    );
  }

  return (
    <div className={theme === "dark" 
      ? "bg-zinc-900/50 backdrop-blur-sm p-4" 
      : "bg-white shadow-sm p-4"}>
      {/* Header Section */}
      <div className={`mb-4 pb-3 border-b ${theme === "dark" ? "border-zinc-700/40" : "border-gray-200"}`}>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className={`w-1 h-6 rounded-full ${
              theme === "dark" 
                ? "bg-gradient-to-b from-emerald-400 to-emerald-600" 
                : "bg-gradient-to-b from-emerald-400 to-emerald-600"
            }`}></div>
            <h3 className={`text-base font-bold tracking-tight ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              First Shot Matrix
            </h3>
          </div>
          <div className={`flex-1 h-px ${
            theme === "dark" 
              ? "bg-gradient-to-r from-zinc-700 via-zinc-600 to-transparent" 
              : "bg-gradient-to-r from-gray-200 via-gray-100 to-transparent"
          }`}></div>
          <p className={`text-xs font-medium ${theme === "dark" ? "text-zinc-400" : "text-gray-500"}`}>
            Performance by position & distance
          </p>
        </div>
      </div>

      {/* Matrix Section */}
      <div className="space-y-3 mb-5">
        {/* Distance Header */}
        <div className={`grid grid-cols-5 gap-3 pb-3`}>
          <div></div>
          {matrixData.distances.map((distance) => (
            <div key={distance} className="text-center">
              <div className={`inline-block px-3 py-1.5 rounded-lg font-medium text-xs
                transform transition-all duration-300 hover:scale-105 ${
                theme === "dark" 
                  ? "bg-gradient-to-r from-zinc-800 to-zinc-700 text-zinc-300 shadow-lg shadow-black/20" 
                  : "bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 shadow-sm"
              }`}
>
                {distance}m
              </div>
            </div>
          ))}
        </div>

        {/* Position Rows */}
        {matrixData.positions.map((position, index) => (
          <div
            key={position}
            className={`grid grid-cols-5 gap-3 items-center py-2 px-2 rounded-lg
              transition-all duration-300 ${
              theme === "dark"
                ? `hover:bg-zinc-800/30 ${index % 2 === 0 ? "bg-zinc-800/20" : ""}`
                : `hover:bg-gray-50 ${index % 2 === 0 ? "bg-gray-50/50" : ""}`
            }`}

          >
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full animate-pulse ${
                theme === "dark" ? "bg-emerald-500" : "bg-emerald-400"
              }`}></div>
              <span className={`text-sm uppercase font-bold tracking-wider ${
                theme === "dark" ? "text-zinc-200" : "text-gray-700"
              }`}>{position}</span>
            </div>

            {matrixData.distances.map((distance) => {
              const cellData = matrixData.grid[position]?.[distance];

              if (!cellData || cellData.targets === 0) {
                return (
                  <div key={`${position}-${distance}`} className="text-center">
                    <div className={`h-12 rounded-lg flex items-center justify-center
                      border-2 border-dashed ${
                      theme === "dark" 
                        ? "bg-zinc-800/30 border-zinc-700/50" 
                        : "bg-gray-50 border-gray-300"
                    }`}>
                      <span className={`text-sm ${theme === "dark" ? "text-zinc-600" : "text-gray-400"}`}>—</span>
                    </div>
                  </div>
                );
              }

              const hitRate = cellData.first_shot_hit_rate;
              const hitRatePercent = Math.round(hitRate * 100);

              return (
                <div key={`${position}-${distance}`} className="relative group">
                  <div
                    className={`h-12 rounded-lg border-2 flex items-center justify-center
                      transition-all duration-300 transform hover:scale-110 hover:z-10
                      relative overflow-hidden ${
                      hitRate === 0
                        ? theme === "dark" 
                          ? "bg-zinc-800/40 border-zinc-700/50"
                          : "bg-gray-100 border-gray-300"
                        : hitRate < 0.5
                          ? theme === "dark"
                            ? "bg-red-900/30 border-red-700/50 shadow-red-500/20"
                            : "bg-red-100 border-red-300"
                          : hitRate < 0.8
                            ? theme === "dark"
                              ? "bg-yellow-900/30 border-yellow-700/50 shadow-yellow-500/20"
                              : "bg-yellow-100 border-yellow-300"
                            : theme === "dark"
                              ? "bg-emerald-900/30 border-emerald-700/50 shadow-emerald-500/20"
                              : "bg-emerald-100 border-emerald-300"
                    } hover:shadow-lg`}
                  >
                    {/* Animated background gradient */}
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300
                      ${hitRate >= 0.8 ? 'bg-gradient-to-br from-emerald-500/20 to-transparent' :
                        hitRate >= 0.5 ? 'bg-gradient-to-br from-yellow-500/20 to-transparent' :
                        'bg-gradient-to-br from-red-500/20 to-transparent'}`}></div>
                    
                    <span
                      className={`text-lg font-black relative z-10 ${
                        hitRate === 0 
                          ? theme === "dark" ? "text-zinc-500" : "text-gray-500"
                          : hitRate < 0.5 
                            ? theme === "dark" ? "text-red-400" : "text-red-700"
                            : hitRate < 0.8 
                              ? theme === "dark" ? "text-yellow-400" : "text-yellow-700"
                              : theme === "dark" ? "text-emerald-400" : "text-emerald-700"
                      }`}
                    >
                      {hitRatePercent}
                      <span className="text-sm font-medium">%</span>
                    </span>
                  </div>
                  
                  {/* Hover tooltip */}
                  <div className={`absolute -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded
                    text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity z-20
                    pointer-events-none whitespace-nowrap ${
                    theme === "dark" ? "bg-zinc-800 text-white" : "bg-gray-800 text-white"
                  }`}>
                    {cellData.targets} targets
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className={`pt-4 border-t ${theme === "dark" ? "border-zinc-700/40" : "border-gray-200"}`}>
        <div className="mb-3">
          <h4 className={`text-sm font-bold ${theme === "dark" ? "text-zinc-300" : "text-gray-700"}`}>
            Average Performance by Position
          </h4>
        </div>
        <div className={`h-32 rounded-lg p-3 ${
          theme === "dark" 
            ? "bg-zinc-800/30 border border-zinc-700/50" 
            : "bg-gray-50 border border-gray-200"
        }`}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={matrixData.positions.map((position) => {
                const avgRate =
                  matrixData.distances.reduce((sum, distance) => {
                    const cellData = matrixData.grid[position]?.[distance];
                    return sum + (cellData?.first_shot_hit_rate || 0);
                  }, 0) / Math.max(matrixData.distances.length, 1);

                return {
                  position,
                  rate: Math.round(avgRate * 100),
                };
              })}
            >
              <XAxis 
                dataKey="position" 
                tick={{ 
                  fontSize: 11, 
                  fill: theme === "dark" ? "#d4d4d8" : "#374151",
                  fontWeight: 600 
                }} 
                axisLine={{ 
                  stroke: theme === "dark" ? "#52525b" : "#d1d5db",
                  strokeWidth: 2 
                }} 
              />
              <YAxis 
                tick={{ 
                  fontSize: 10, 
                  fill: theme === "dark" ? "#71717a" : "#6b7280"
                }} 
                domain={[0, 100]} 
                axisLine={{ 
                  stroke: theme === "dark" ? "#52525b" : "#d1d5db",
                  strokeWidth: 2 
                }} 
              />
              <Tooltip
                formatter={(value: number) => [`${value}%`, "Hit Rate"]}
                labelStyle={{ 
                  color: theme === "dark" ? "#d4d4d8" : "#1f2937",
                  fontWeight: 600 
                }}
                contentStyle={{
                  backgroundColor: theme === "dark" ? "#18181b" : "#ffffff",
                  border: theme === "dark" ? "1px solid #52525b" : "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                }}
              />
              <Bar 
                dataKey="rate" 
                fill="url(#gradientBar)" 
                radius={[8, 8, 0, 0]} 
                animationDuration={1000}
              />
              <defs>
                <linearGradient id="gradientBar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#059669" stopOpacity={0.7} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>


    </div>
  );
}
