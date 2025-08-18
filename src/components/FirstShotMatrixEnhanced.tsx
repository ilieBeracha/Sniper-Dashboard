import { useTheme } from "@/contexts/ThemeContext";
import { Target, Clock, Crosshair, Activity, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { useStore } from "zustand";
import { useStatsStore } from "@/store/statsStore";
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";

export default function FirstShotMatrixEnhanced() {
  const { theme } = useTheme();
  const { firstShotMatrix } = useStore(useStatsStore);

  const data = firstShotMatrix || [];

  const processedData = useMemo(() => {
    if (!data.length) return { chartData: [], stats: null, zones: [] };

    const chartData = data
      .filter((d) => d.distance_bucket > 0 && d.first_shot_hit_rate !== null)
      .map((d) => ({
        distance: d.distance_bucket,
        hitRate: Math.round((d.first_shot_hit_rate || 0) * 100),
        timeToFirst: d.avg_time_to_first_shot_sec || 0,
        targets: d.targets,
        size: Math.min(Math.max(d.targets * 2, 20), 100),
      }))
      .sort((a, b) => a.distance - b.distance);

    const totalTargets = chartData.reduce((s, d) => s + d.targets, 0);
    const avgHitRate = totalTargets > 0 ? chartData.reduce((s, d) => s + d.hitRate * d.targets, 0) / totalTargets : 0;
    const avgTime = chartData.length > 0 ? chartData.reduce((s, d) => s + d.timeToFirst, 0) / chartData.length : 0;

    const bestRange = chartData.reduce((best, d) => (!best || d.hitRate > best.hitRate ? d : best), null as any);

    const zones = [
      {
        name: "Close",
        range: "0-300m",
        data: chartData.filter((d) => d.distance <= 300),
        color: theme === "dark" ? "#10b981" : "#059669",
      },
      {
        name: "Medium",
        range: "300-600m",
        data: chartData.filter((d) => d.distance > 300 && d.distance <= 600),
        color: theme === "dark" ? "#f59e0b" : "#d97706",
      },
      {
        name: "Long",
        range: "600m+",
        data: chartData.filter((d) => d.distance > 600),
        color: theme === "dark" ? "#ef4444" : "#dc2626",
      },
    ].map((zone) => ({
      ...zone,
      avgHitRate: zone.data.length > 0 ? Math.round(zone.data.reduce((s, d) => s + d.hitRate, 0) / zone.data.length) : 0,
      totalTargets: zone.data.reduce((s, d) => s + d.targets, 0),
    }));

    return {
      chartData,
      stats: {
        avgHitRate: Math.round(avgHitRate),
        avgTime: avgTime.toFixed(1),
        bestRange,
        totalTargets,
      },
      zones,
    };
  }, [data, theme]);

  const bgCard = theme === "dark" ? "bg-zinc-900/50" : "bg-white";
  const border = theme === "dark" ? "border-zinc-800" : "border-gray-200";
  const textMain = theme === "dark" ? "text-white" : "text-gray-900";
  const textSub = theme === "dark" ? "text-zinc-500" : "text-gray-500";
  const bgSecondary = theme === "dark" ? "bg-zinc-800/30" : "bg-gray-50";

  const { chartData, stats, zones } = processedData;

  if (!chartData.length) {
    return (
      <div className={`rounded-lg p-4 ${bgCard} border ${border}`}>
        <div className="flex flex-col items-center justify-center h-32">
          <AlertCircle className={`w-4 h-4 mb-1 ${textSub}`} />
          <p className={`text-[11px] ${textSub}`}>No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={` p-2.5 ${bgCard} border ${border}`}>
      {/* Key Metrics - Smaller */}
      {stats && (
        <div className="grid grid-cols-4 gap-1.5 mb-2">
          <div className={`p-1.5 rounded text-center ${bgSecondary}`}>
            <Crosshair className={`w-2.5 h-2.5 mx-auto mb-0.5 text-emerald-500`} />
            <div className={`text-xs font-semibold ${textMain}`}>{stats.avgHitRate}%</div>
            <div className={`text-[9px] ${textSub}`}>Hit Rate</div>
          </div>

          <div className={`p-1.5 rounded text-center ${bgSecondary}`}>
            <Clock className={`w-2.5 h-2.5 mx-auto mb-0.5 text-blue-500`} />
            <div className={`text-xs font-semibold ${textMain}`}>{stats.avgTime}s</div>
            <div className={`text-[9px] ${textSub}`}>Avg TTF</div>
          </div>

          <div className={`p-1.5 rounded text-center ${bgSecondary}`}>
            <Target className={`w-2.5 h-2.5 mx-auto mb-0.5 text-orange-500`} />
            <div className={`text-xs font-semibold ${textMain}`}>{stats.bestRange?.distance || "—"}m</div>
            <div className={`text-[9px] ${textSub}`}>Best</div>
          </div>

          <div className={`p-1.5 rounded text-center ${bgSecondary}`}>
            <Activity className={`w-2.5 h-2.5 mx-auto mb-0.5 text-violet-500`} />
            <div className={`text-xs font-semibold ${textMain}`}>{stats.totalTargets.toLocaleString()}</div>
            <div className={`text-[9px] ${textSub}`}>Targets</div>
          </div>
        </div>
      )}

      {/* Scatter Plot */}
      <div className={`rounded p-1.5 mb-2 ${bgSecondary}`}>
        <ResponsiveContainer width="100%" height={120}>
          <ScatterChart margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme === "dark" ? "#3f3f46" : "#e5e7eb"} opacity={0.3} />
            <XAxis dataKey="distance" tick={{ fontSize: 9, fill: theme === "dark" ? "#71717a" : "#9ca3af" }} axisLine={false} tickLine={false} />
            <YAxis
              dataKey="hitRate"
              domain={[0, 100]}
              tick={{ fontSize: 9, fill: theme === "dark" ? "#71717a" : "#9ca3af" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: theme === "dark" ? "#18181b" : "#ffffff",
                border: `1px solid ${theme === "dark" ? "#3f3f46" : "#e5e7eb"}`,
                borderRadius: 4,
                fontSize: 10,
                padding: "2px 6px",
              }}
              formatter={(value: any, name: string) => {
                if (name === "hitRate") return [`${value}%`, "Hit"];
                if (name === "timeToFirst") return [`${value}s`, "TTF"];
                if (name === "targets") return [value, "Targets"];
                return [value, name];
              }}
            />
            <Scatter name="Performance" data={chartData} fill={theme === "dark" ? "#8b5cf6" : "#7c3aed"}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.distance <= 300
                      ? theme === "dark"
                        ? "#10b981"
                        : "#059669"
                      : entry.distance <= 600
                        ? theme === "dark"
                          ? "#f59e0b"
                          : "#d97706"
                        : theme === "dark"
                          ? "#ef4444"
                          : "#dc2626"
                  }
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Zone Performance Bars */}

      {/* Zone Summary Cards - Smaller text */}
      <div className="grid grid-cols-3 gap-1.5">
        {zones.map((zone) => (
          <div key={zone.name} className={`p-1.5 rounded ${bgSecondary}`}>
            <div className="flex items-center justify-between mb-0.5">
              <span className={`text-[10px] font-medium ${textMain}`}>{zone.name}</span>
              <span className={`text-[9px] ${textSub}`}>{zone.range}</span>
            </div>
            <div className={`text-sm font-semibold`} style={{ color: zone.color }}>
              {zone.avgHitRate}%
            </div>
            <div className={`text-[9px] ${textSub}`}>{zone.totalTargets.toLocaleString()} targets</div>
            <div className="mt-0.5">
              <div className={`h-0.5 rounded-full overflow-hidden bg-zinc-700/20`}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${zone.avgHitRate}%` }}
                  transition={{ duration: 0.8 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: zone.color }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
