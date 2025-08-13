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
      <div className={`rounded-lg border p-4 ${
        theme === "dark" 
          ? "bg-zinc-900/30 border-zinc-800/30" 
          : "bg-white border-gray-200"
      }`}>
        <div className="animate-pulse space-y-3">
          <div className={`h-4 rounded w-1/3 ${theme === "dark" ? "bg-zinc-800" : "bg-gray-200"}`}></div>
          <div className="grid grid-cols-5 gap-1">
            {[...Array(20)].map((_, i) => (
              <div key={i} className={`h-8 rounded ${theme === "dark" ? "bg-zinc-800" : "bg-gray-200"}`}></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!firstShotMatrix || matrixData.positions.length === 0) {
    return (
      <div className={`rounded border p-3 text-center ${
        theme === "dark" 
          ? "bg-zinc-900/20 border-zinc-800/20" 
          : "bg-gray-50 border-gray-200"
      }`}>
        <p className={`text-xs ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>
          No first shot data available
        </p>
      </div>
    );
  }

  return (
    <div className={`rounded-xl border p-4 shadow-lg ${
      theme === "dark" 
        ? "bg-gradient-to-br from-zinc-900/40 to-zinc-800/30 border-zinc-700/40" 
        : "bg-white border-gray-200"
    }`}>
      {/* Header Section */}
      <div className={`mb-3 pb-2 border-b ${theme === "dark" ? "border-zinc-700/40" : "border-gray-200"}`}>
        <div className="flex items-center gap-2">
          <div className={`w-6 h-6 rounded-lg flex items-center justify-center border ${
            theme === "dark" 
              ? "bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border-emerald-500/30" 
              : "bg-gradient-to-br from-emerald-100 to-teal-100 border-emerald-300"
          }`}>
            <div className={`w-3 h-3 rounded-full ${theme === "dark" ? "bg-emerald-400" : "bg-emerald-500"}`}></div>
          </div>
          <div>
            <h3 className={`text-sm font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              First Shot Matrix
            </h3>
            <p className={`text-xs ${theme === "dark" ? "text-zinc-400" : "text-gray-500"}`}>
              Performance by position & distance
            </p>
          </div>
        </div>
      </div>

      {/* Matrix Section */}
      <div className="space-y-2 mb-4">
        {/* Distance Header */}
        <div className={`grid grid-cols-5 gap-2 pb-2 border-b ${
          theme === "dark" ? "border-zinc-700/30" : "border-gray-200"
        }`}>
          <div></div>
          {matrixData.distances.map((distance) => (
            <div key={distance} className="text-center">
              <div className={`inline-block px-2 py-0.5 rounded border ${
                theme === "dark" 
                  ? "bg-zinc-800/50 border-zinc-700/30" 
                  : "bg-gray-100 border-gray-300"
              }`}>
                <span className={`text-xs font-medium ${
                  theme === "dark" ? "text-zinc-300" : "text-gray-700"
                }`}>{distance}m</span>
              </div>
            </div>
          ))}
        </div>

        {/* Position Rows */}
        {matrixData.positions.map((position, index) => (
          <div
            key={position}
            className={`grid grid-cols-5 gap-2 items-center py-1 px-1 rounded transition-all duration-200 ${
              theme === "dark"
                ? `hover:bg-zinc-800/20 ${index % 2 === 0 ? "bg-zinc-800/15" : "bg-zinc-800/8"}`
                : `hover:bg-gray-50 ${index % 2 === 0 ? "bg-gray-50/50" : "bg-white"}`
            }`}
          >
            <div className="flex items-center gap-1.5">
              <div className={`w-1.5 h-1.5 rounded-full ${theme === "dark" ? "bg-zinc-500" : "bg-gray-400"}`}></div>
              <span className={`text-xs uppercase font-medium tracking-wide ${
                theme === "dark" ? "text-zinc-200" : "text-gray-700"
              }`}>{position}</span>
            </div>

            {matrixData.distances.map((distance) => {
              const cellData = matrixData.grid[position]?.[distance];

              if (!cellData || cellData.targets === 0) {
                return (
                  <div key={`${position}-${distance}`} className="text-center">
                    <div className={`w-6 h-6 rounded border flex items-center justify-center ${
                      theme === "dark" 
                        ? "bg-zinc-800/40 border-zinc-700/30" 
                        : "bg-gray-100 border-gray-300"
                    }`}>
                      <span className={`text-xs ${theme === "dark" ? "text-zinc-600" : "text-gray-400"}`}>—</span>
                    </div>
                  </div>
                );
              }

              const hitRate = cellData.first_shot_hit_rate;
              const hitRatePercent = Math.round(hitRate * 100);

              return (
                <div key={`${position}-${distance}`} className="text-center">
                  <div
                    className={`w-6 h-6 rounded border flex items-center justify-center transition-all duration-200 hover:scale-105 ${
                      hitRate === 0
                        ? theme === "dark" 
                          ? "bg-zinc-800/40 border-zinc-700/30"
                          : "bg-gray-100 border-gray-300"
                        : hitRate < 0.5
                          ? theme === "dark"
                            ? "bg-red-500/20 border-red-500/40"
                            : "bg-red-100 border-red-300"
                          : hitRate < 0.8
                            ? theme === "dark"
                              ? "bg-yellow-500/20 border-yellow-500/40"
                              : "bg-yellow-100 border-yellow-300"
                            : theme === "dark"
                              ? "bg-emerald-500/20 border-emerald-500/40"
                              : "bg-emerald-100 border-emerald-300"
                    }`}
                  >
                    <span
                      className={`text-xs font-bold ${
                        hitRate === 0 
                          ? theme === "dark" ? "text-zinc-500" : "text-gray-500"
                          : hitRate < 0.5 
                            ? theme === "dark" ? "text-red-300" : "text-red-700"
                            : hitRate < 0.8 
                              ? theme === "dark" ? "text-yellow-300" : "text-yellow-700"
                              : theme === "dark" ? "text-emerald-300" : "text-emerald-700"
                      }`}
                    >
                      {hitRatePercent}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className={`pt-3 border-t ${theme === "dark" ? "border-zinc-700/40" : "border-gray-200"}`}>
        <div className="mb-2">
          <h4 className={`text-xs font-medium ${theme === "dark" ? "text-zinc-300" : "text-gray-700"}`}>
            Performance Overview
          </h4>
        </div>
        <div className={`h-28 rounded border p-2 ${
          theme === "dark" 
            ? "bg-gradient-to-br from-zinc-800/20 to-zinc-700/10 border-zinc-700/30" 
            : "bg-gray-50 border-gray-200"
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
                  fontWeight: 500 
                }} 
                axisLine={{ 
                  stroke: theme === "dark" ? "#52525b" : "#d1d5db",
                  strokeWidth: 1 
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
                  strokeWidth: 1 
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
              <Bar dataKey="rate" fill="url(#gradient)" radius={[4, 4, 0, 0]} stroke="#10b981" strokeWidth={1} />
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#059669" stopOpacity={0.6} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
