import { useTheme } from "@/contexts/ThemeContext";
import { Target, Clock, Crosshair, Activity, AlertCircle, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import { useStore } from "zustand";
import { useStatsStore } from "@/store/statsStore";
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell, BarChart, Bar } from "recharts";

export default function FirstShotMatrixEnhanced() {
  const { theme } = useTheme();
  const { firstShotMatrix } = useStore(useStatsStore);
  const [distanceBucket, setDistanceBucket] = useState(25);

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

  const iconColor = theme === "dark" ? "text-zinc-400" : "text-gray-600";
  const border = theme === "dark" ? "border-zinc-800" : "border-gray-200";
  const textMain = theme === "dark" ? "text-white" : "text-gray-900";
  const textSub = theme === "dark" ? "text-zinc-400" : "text-gray-600";

  const { chartData, stats, zones } = processedData;

  if (!chartData.length) {
    return (
      <div
        className={`rounded-lg p-2 sm:p-3 ${theme === "dark" ? "bg-zinc-900/50" : "bg-white"} 
        border ${border}`}
      >
        <div className="flex flex-col items-center justify-center h-32">
          <AlertCircle className={`w-6 h-6 mb-1 ${iconColor}`} />
          <p className={`text-xs ${textSub}`}>No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-lg p-2 sm:p-3 ${theme === "dark" ? "bg-zinc-900/50" : "bg-white"} 
      border ${border}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h4 className={`text-xs sm:text-sm font-semibold ${textMain}`}>Distance Matrix</h4>
          <p className={`text-[10px] sm:text-xs ${textSub} hidden sm:block`}>Performance by range</p>
        </div>
        <div className="flex items-center gap-1">
          <select
            value={distanceBucket}
            onChange={(e) => setDistanceBucket(Number(e.target.value))}
            className={`px-1.5 py-0.5 rounded-md text-[9px] sm:text-[10px] font-medium border
              ${theme === "dark" ? "bg-zinc-800 text-zinc-200 border-zinc-700" : "bg-white text-gray-700 border-gray-300"}`}
          >
            <option value={25}>25m</option>
            <option value={50}>50m</option>
            <option value={100}>100m</option>
          </select>
          <Target className={`w-3 h-3 ${iconColor}`} />
        </div>
      </div>

      {/* Key Metrics */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-1.5 rounded-md text-center ${theme === "dark" ? "bg-zinc-800/40" : "bg-gray-50"}`}
          >
            <Crosshair className={`w-3 h-3 mx-auto mb-0.5 ${iconColor}`} />
            <div className={`text-sm sm:text-base font-bold ${textMain}`}>{stats.avgHitRate}%</div>
            <div className={`text-[9px] ${textSub}`}>Hit Rate</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className={`p-1.5 rounded-md text-center ${theme === "dark" ? "bg-zinc-800/40" : "bg-gray-50"}`}
          >
            <Clock className={`w-3 h-3 mx-auto mb-0.5 ${iconColor}`} />
            <div className={`text-sm sm:text-base font-bold ${textMain}`}>{stats.avgTime}s</div>
            <div className={`text-[9px] ${textSub}`}>TTF</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className={`p-1.5 rounded-md text-center ${theme === "dark" ? "bg-zinc-800/40" : "bg-gray-50"}`}
          >
            <Trophy className={`w-3 h-3 mx-auto mb-0.5 ${theme === "dark" ? "text-yellow-400" : "text-yellow-600"}`} />
            <div className={`text-sm sm:text-base font-bold ${textMain}`}>{stats.bestRange?.distance || "—"}m</div>
            <div className={`text-[9px] ${textSub}`}>Best</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className={`p-1.5 rounded-md text-center ${theme === "dark" ? "bg-zinc-800/40" : "bg-gray-50"}`}
          >
            <Activity className={`w-3 h-3 mx-auto mb-0.5 ${iconColor}`} />
            <div className={`text-sm sm:text-base font-bold ${textMain}`}>{stats.totalTargets.toLocaleString()}</div>
            <div className={`text-[9px] ${textSub}`}>Targets</div>
          </motion.div>
        </div>
      )}

      {/* Scatter Plot - Hit Rate vs Time */}
      <div className={`rounded-md p-2 mb-2 ${theme === "dark" ? "bg-zinc-800/20" : "bg-gray-50"}`}>
        <h5 className={`text-[10px] font-medium mb-1 ${textSub}`}>Hit Rate vs Response</h5>
        <ResponsiveContainer width="100%" height={120}>
          <ScatterChart margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 6" stroke={theme === "dark" ? "#3f3f46" : "#e5e7eb"} opacity={0.4} />
            <XAxis
              dataKey="distance"
              name="Distance"
              unit="m"
              tick={{ fontSize: 9, fill: theme === "dark" ? "#a1a1aa" : "#525252" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              dataKey="hitRate"
              name="Hit Rate"
              unit="%"
              domain={[0, 100]}
              tick={{ fontSize: 9, fill: theme === "dark" ? "#a1a1aa" : "#525252" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: theme === "dark" ? "#18181b" : "#ffffff",
                border: `1px solid ${theme === "dark" ? "#27272a" : "#e5e7eb"}`,
                borderRadius: 8,
                fontSize: 11,
              }}
              formatter={(value: any, name: string) => {
                if (name === "hitRate") return [`${value}%`, "Hit Rate"];
                if (name === "timeToFirst") return [`${value}s`, "Time to First"];
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
      <div className={`rounded-md p-2 mb-2 ${theme === "dark" ? "bg-zinc-800/20" : "bg-gray-50"}`}>
        <h5 className={`text-[10px] font-medium mb-1 ${textSub}`}>Zone Performance</h5>
        <ResponsiveContainer width="100%" height={80}>
          <BarChart data={zones} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 6" stroke={theme === "dark" ? "#3f3f46" : "#e5e7eb"} opacity={0.3} vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 9, fill: theme === "dark" ? "#a1a1aa" : "#525252" }} axisLine={false} tickLine={false} />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 9, fill: theme === "dark" ? "#a1a1aa" : "#525252" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: theme === "dark" ? "#18181b" : "#ffffff",
                border: `1px solid ${theme === "dark" ? "#27272a" : "#e5e7eb"}`,
                borderRadius: 8,
                fontSize: 11,
              }}
              formatter={(value: any, name: string) => {
                if (name === "avgHitRate") return [`${value}%`, "Avg Hit Rate"];
                return [value, name];
              }}
            />
            <Bar dataKey="avgHitRate" radius={[8, 8, 0, 0]}>
              {zones.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Zone Cards */}
      <div className="grid grid-cols-3 gap-2">
        {zones.map((zone, index) => (
          <motion.div
            key={zone.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-2 rounded-md ${theme === "dark" ? "bg-zinc-800/30" : "bg-gray-100"}`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className={`text-[10px] font-medium ${textMain}`}>{zone.name}</span>
              <span className={`text-[9px] ${textSub}`}>{zone.range}</span>
            </div>
            <div className="space-y-0.5">
              <div className="flex justify-between items-center">
                <span className={`text-[9px] ${textSub}`}>Hit</span>
                <span className={`text-xs font-bold`} style={{ color: zone.color }}>
                  {zone.avgHitRate}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`text-[9px] ${textSub}`}>Targets</span>
                <span className={`text-xs font-bold ${textMain}`}>{zone.totalTargets.toLocaleString()}</span>
              </div>
            </div>
            <div className="mt-1.5">
              <div className={`h-0.5 rounded-full overflow-hidden ${theme === "dark" ? "bg-zinc-700/30" : "bg-gray-200"}`}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${zone.avgHitRate}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 + 0.2 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: zone.color }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
