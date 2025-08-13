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

  // Dynamic grid columns based on number of distances
  const gridCols = matrixData.distances.length + 1;
  const gridColsClass = gridCols <= 4 ? `grid-cols-${gridCols}` 
    : gridCols <= 6 ? 'grid-cols-6' 
    : 'grid-cols-8';

  if (isLoading) {
    return (
      <div className={theme === "dark" 
        ? "bg-zinc-900/50 backdrop-blur-sm p-3" 
        : "bg-white shadow-sm p-3"}>
        <div className="animate-pulse space-y-2">
          <div className={`h-3 rounded w-1/3 ${theme === "dark" ? "bg-zinc-800" : "bg-gray-200"}`}></div>
          <div className={`grid ${gridColsClass} gap-1`}>
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
      <div className={theme === "dark" 
        ? "bg-zinc-900/50 backdrop-blur-sm p-3 text-center" 
        : "bg-white shadow-sm p-3 text-center"}>
        <p className={`text-xs ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>
          No first shot data available
        </p>
      </div>
    );
  }

  return (
    <div className={theme === "dark" 
      ? "bg-zinc-900/50 backdrop-blur-sm p-3" 
      : "bg-white shadow-sm p-3"}>
      {/* Compact Header */}
      <div className="mb-2 flex items-center justify-between">
        <h3 className={`text-sm font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
          First Shot Matrix
        </h3>
        <p className={`text-xs ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>
          Hit rate by position/distance
        </p>
      </div>

      {/* Compact Matrix */}
      <div className="mb-3">
        {/* Distance Header */}
        <div className={`grid ${gridColsClass} gap-1 mb-1 text-center`}>
          <div></div>
          {matrixData.distances.map((distance) => (
            <div key={distance} className={`text-xs font-medium ${
              theme === "dark" ? "text-zinc-400" : "text-gray-600"
            }`}>
              {distance}m
            </div>
          ))}
        </div>

        {/* Position Rows */}
        {matrixData.positions.map((position) => (
          <div key={position} className={`grid ${gridColsClass} gap-1 items-center`}>
            <div className={`text-xs font-medium truncate pr-1 ${
              theme === "dark" ? "text-zinc-300" : "text-gray-700"
            }`}>
              {position.slice(0, 4)}
            </div>

            {matrixData.distances.map((distance) => {
              const cellData = matrixData.grid[position]?.[distance];

              if (!cellData || cellData.targets === 0) {
                return (
                  <div key={`${position}-${distance}`} 
                    className={`aspect-square rounded flex items-center justify-center text-xs ${
                    theme === "dark" 
                      ? "bg-zinc-800/30 text-zinc-600" 
                      : "bg-gray-100 text-gray-400"
                  }`}>
                    —
                  </div>
                );
              }

              const hitRate = cellData.first_shot_hit_rate;
              const hitRatePercent = Math.round(hitRate * 100);

              return (
                <div key={`${position}-${distance}`} className="relative group">
                  <div
                    className={`aspect-square rounded flex items-center justify-center
                      transition-all duration-200 cursor-pointer hover:scale-110 hover:z-10
                      text-xs font-bold ${
                      hitRate >= 0.8 
                        ? theme === "dark"
                          ? "bg-emerald-600/70 text-emerald-100"
                          : "bg-emerald-400 text-white"
                        : hitRate >= 0.5
                          ? theme === "dark"
                            ? "bg-yellow-600/60 text-yellow-100"
                            : "bg-yellow-400 text-gray-800"
                          : theme === "dark"
                            ? "bg-red-600/60 text-red-100"
                            : "bg-red-400 text-white"
                    }`}
                    title={`${cellData.targets} targets`}
                  >
                    {hitRatePercent}
                  </div>
                  
                  {/* Compact tooltip */}
                  <div className={`absolute -top-7 left-1/2 transform -translate-x-1/2 px-1.5 py-0.5 rounded
                    text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity z-20
                    pointer-events-none whitespace-nowrap ${
                    theme === "dark" ? "bg-zinc-800 text-white" : "bg-gray-800 text-white"
                  }`}>
                    {cellData.targets} shots
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Compact Chart Section */}
      <div className={`pt-2 border-t ${theme === "dark" ? "border-zinc-700/40" : "border-gray-200"}`}>
        <div className="mb-1">
          <h4 className={`text-xs font-medium ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>
            Average by Position
          </h4>
        </div>
        <div className="h-20">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={matrixData.positions.map((position) => {
                const validCells = matrixData.distances.filter(distance => 
                  matrixData.grid[position]?.[distance]?.targets > 0
                );
                const avgRate = validCells.length > 0
                  ? validCells.reduce((sum, distance) => {
                      const cellData = matrixData.grid[position]?.[distance];
                      return sum + (cellData?.first_shot_hit_rate || 0);
                    }, 0) / validCells.length
                  : 0;

                return {
                  position: position.slice(0, 4),
                  rate: Math.round(avgRate * 100),
                };
              })}
              margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            >
              <XAxis 
                dataKey="position" 
                tick={{ fontSize: 10, fill: theme === "dark" ? "#a1a1aa" : "#6b7280" }} 
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 9, fill: theme === "dark" ? "#71717a" : "#9ca3af" }} 
                domain={[0, 100]} 
                axisLine={false}
                tickLine={false}
                width={25}
              />
              <Tooltip
                formatter={(value: number) => `${value}%`}
                contentStyle={{
                  backgroundColor: theme === "dark" ? "#27272a" : "#ffffff",
                  border: theme === "dark" ? "1px solid #3f3f46" : "1px solid #e5e7eb",
                  borderRadius: "4px",
                  padding: "4px 8px",
                  fontSize: "11px",
                }}
                cursor={false}
              />
              <Bar 
                dataKey="rate" 
                fill={theme === "dark" ? "#10b981" : "#059669"}
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
