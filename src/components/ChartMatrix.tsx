import { useMemo } from "react";
import { useStore } from "zustand";
import { performanceStore } from "@/store/performance";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface FirstShotData {
  position: "Lying" | "Sitting" | "Standing" | "Operational";
  distance_bucket: number;
  targets: number;
  first_shot_hit_rate: number;
  avg_time_to_first_shot_sec: number | null;
}

export default function ChartMatrix() {
  const { firstShotMatrix, isLoading } = useStore(performanceStore);

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
      <div className="bg-zinc-900/30 rounded-lg border border-zinc-800/30 p-4">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-zinc-800 rounded w-1/3"></div>
          <div className="grid grid-cols-5 gap-1">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="h-8 bg-zinc-800 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!firstShotMatrix || matrixData.positions.length === 0) {
    return (
      <div className="bg-zinc-900/20 rounded border border-zinc-800/20 p-3 text-center">
        <p className="text-xs text-zinc-500">No first shot data available</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-zinc-900/40 to-zinc-800/30 rounded-xl border border-zinc-700/40 p-4 shadow-lg">
      {/* Header Section */}
      <div className="mb-3 pb-2 border-b border-zinc-700/40">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center border border-emerald-500/30">
            <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">First Shot Matrix</h3>
            <p className="text-xs text-zinc-400">Performance by position & distance</p>
          </div>
        </div>
      </div>

      {/* Matrix Section */}
      <div className="space-y-2 mb-4">
        {/* Distance Header */}
        <div className="grid grid-cols-5 gap-2 pb-2 border-b border-zinc-700/30">
          <div></div>
          {matrixData.distances.map((distance) => (
            <div key={distance} className="text-center">
              <div className="inline-block px-2 py-0.5 bg-zinc-800/50 rounded border border-zinc-700/30">
                <span className="text-xs font-medium text-zinc-300">{distance}m</span>
              </div>
            </div>
          ))}
        </div>

        {/* Position Rows */}
        {matrixData.positions.map((position, index) => (
          <div
            key={position}
            className={`grid grid-cols-5 gap-2 items-center py-1 px-1 rounded transition-all duration-200 hover:bg-zinc-800/20 ${
              index % 2 === 0 ? "bg-zinc-800/15" : "bg-zinc-800/8"
            }`}
          >
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-500"></div>
              <span className="text-xs text-zinc-200 uppercase font-medium tracking-wide">{position}</span>
            </div>

            {matrixData.distances.map((distance) => {
              const cellData = matrixData.grid[position]?.[distance];

              if (!cellData || cellData.targets === 0) {
                return (
                  <div key={`${position}-${distance}`} className="text-center">
                    <div className="w-6 h-6 rounded bg-zinc-800/40 border border-zinc-700/30 flex items-center justify-center">
                      <span className="text-zinc-600 text-xs">—</span>
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
                        ? "bg-zinc-800/40 border-zinc-700/30"
                        : hitRate < 0.5
                          ? "bg-red-500/20 border-red-500/40"
                          : hitRate < 0.8
                            ? "bg-yellow-500/20 border-yellow-500/40"
                            : "bg-emerald-500/20 border-emerald-500/40"
                    }`}
                  >
                    <span
                      className={`text-xs font-bold ${
                        hitRate === 0 ? "text-zinc-500" : hitRate < 0.5 ? "text-red-300" : hitRate < 0.8 ? "text-yellow-300" : "text-emerald-300"
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
      <div className="pt-3 border-t border-zinc-700/40">
        <div className="mb-2">
          <h4 className="text-xs font-medium text-zinc-300">Performance Overview</h4>
        </div>
        <div className="h-28 bg-gradient-to-br from-zinc-800/20 to-zinc-700/10 rounded border border-zinc-700/30 p-2">
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
              <XAxis dataKey="position" tick={{ fontSize: 11, fill: "#d4d4d8", fontWeight: 500 }} axisLine={{ stroke: "#52525b", strokeWidth: 1 }} />
              <YAxis tick={{ fontSize: 10, fill: "#71717a" }} domain={[0, 100]} axisLine={{ stroke: "#52525b", strokeWidth: 1 }} />
              <Tooltip
                formatter={(value: number) => [`${value}%`, "Hit Rate"]}
                labelStyle={{ color: "#d4d4d8", fontWeight: 600 }}
                contentStyle={{
                  backgroundColor: "#18181b",
                  border: "1px solid #52525b",
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
