import { useMemo } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart } from "recharts";
import { Target, Activity, Crosshair, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useStore } from "zustand";
import { useStatsStore } from "@/store/statsStore";

export default function ChartMatrix() {
  const { firstShotMetrics } = useStore(useStatsStore);
  const { theme } = useTheme();

  const matrixData = useMemo(() => {
    if (!firstShotMetrics) return null;

    const rows = firstShotMetrics as {
      distance_bucket: number;
      targets: number;
      first_shot_hit_rate: number | null;
      avg_time_to_first_shot_sec: number | null;
    }[];

    const buckets = rows
      .map((r) => {
        const targets = r.targets ?? 0;
        const rate = r.first_shot_hit_rate ?? 0;
        const hits = targets * rate;
        const accuracyPct = targets > 0 ? Math.round((hits / targets) * 100) : 0;
        if (r.distance_bucket === 0) {
          return null;
        }
        return {
          bucket: `${r.distance_bucket}m`,
          distance: r.distance_bucket,
          targets,
          hits,
          accuracyPct, // percent 0–100
          avgTime: r.avg_time_to_first_shot_sec,
        };
      })
      .filter((b) => b !== null)
      .sort((a, b) => a.distance - b.distance);

    const totalTargets = buckets.reduce((s, b) => s + b.targets, 0);
    const totalHits = buckets.reduce((s, b) => s + b.hits, 0);

    return {
      buckets,
      overallAccuracy: totalTargets > 0 ? (totalHits / totalTargets) * 100 : 0,
      best: buckets.reduce(
        (best, b) => (b.targets > 0 && (best == null || b.accuracyPct > best.accuracyPct) ? b : best),
        null as (typeof buckets)[number] | null,
      ),
      mostEngaged: buckets.reduce((most, b) => (b.targets > (most?.targets ?? 0) ? b : most), null as (typeof buckets)[number] | null),
    };
  }, [firstShotMetrics]);

  if (!matrixData || matrixData.buckets.length === 0) {
    return (
      <div
        className={`rounded-xl p-4 text-center ${
          theme === "dark" ? "bg-zinc-900/50" : "bg-white"
        } border ${theme === "dark" ? "border-zinc-700/50" : "border-gray-200"} shadow-sm`}
      >
        <p className={`text-xs ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>No first shot data available</p>
      </div>
    );
  }

  const { overallAccuracy, best, mostEngaged } = matrixData;

  return (
    <div
      className={`rounded-xl p-4 ${
        theme === "dark" ? "bg-zinc-900/50" : "bg-white"
      } border ${theme === "dark" ? "border-zinc-700/50" : "border-gray-200"} shadow-sm`}
    >
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className={`text-sm font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Accuracy Analytics</h4>
        </div>
        <p className={`text-xs ${theme === "dark" ? "text-zinc-400" : "text-gray-500"}`}>Distance-based performance metrics</p>
      </div>

      {/* Key Insights */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-3 rounded-lg text-center ${theme === "dark" ? "bg-zinc-800/40" : "bg-gray-50"} border ${theme === "dark" ? "border-zinc-700/30" : "border-gray-100"}`}
        >
          <Crosshair className={`w-4 h-4 mx-auto mb-2 ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`} />
          <div className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{Math.round(overallAccuracy)}%</div>
          <div className={`text-[10px] font-medium ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>Overall Accuracy</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`p-3 rounded-lg text-center ${theme === "dark" ? "bg-zinc-800/40" : "bg-gray-50"} border ${theme === "dark" ? "border-zinc-700/30" : "border-gray-100"}`}
        >
          <Target className={`w-4 h-4 mx-auto mb-2 ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`} />
          <div className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{best ? best.bucket : "—"}</div>
          <div className={`text-[10px] font-medium ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>Best Range</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`p-3 rounded-lg text-center ${theme === "dark" ? "bg-zinc-800/40" : "bg-gray-50"} border ${theme === "dark" ? "border-zinc-700/30" : "border-gray-100"}`}
        >
          <Activity className={`w-4 h-4 mx-auto mb-2 ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`} />
          <div className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{mostEngaged ? mostEngaged.targets : 0}</div>
          <div className={`text-[10px] font-medium ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>Most Active Targets</div>
        </motion.div>
      </div>

      {/* Analytics Chart */}
      <div
        className={`rounded-lg p-3 mb-4 ${theme === "dark" ? "bg-zinc-800/20" : "bg-gray-50"} border ${theme === "dark" ? "border-zinc-700/20" : "border-gray-100"}`}
      >
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={matrixData.buckets} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={theme === "dark" ? "#8b5cf6" : "#8b5cf6"} stopOpacity={0.8} />
                <stop offset="95%" stopColor={theme === "dark" ? "#8b5cf6" : "#8b5cf6"} stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="colorTargets" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={theme === "dark" ? "#06b6d4" : "#06b6d4"} stopOpacity={0.8} />
                <stop offset="95%" stopColor={theme === "dark" ? "#06b6d4" : "#06b6d4"} stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 6" stroke={theme === "dark" ? "#3f3f46" : "#e5e7eb"} opacity={0.4} vertical={false} />
            <XAxis
              dataKey="bucket"
              tick={{
                fontSize: 11,
                fill: theme === "dark" ? "#a1a1aa" : "#525252",
                fontWeight: 500,
              }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              yAxisId="left"
              domain={[0, 100]}
              tick={{
                fontSize: 11,
                fill: theme === "dark" ? "#a1a1aa" : "#525252",
                fontWeight: 500,
              }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `${value}%`}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{
                fontSize: 11,
                fill: theme === "dark" ? "#a1a1aa" : "#525252",
                fontWeight: 500,
              }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: theme === "dark" ? "#18181b" : "#ffffff",
                border: `1px solid ${theme === "dark" ? "#27272a" : "#e5e7eb"}`,
                borderRadius: 8,
                fontSize: 11,
                padding: "8px 12px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              }}
              formatter={(value: any, name: string) => {
                if (name === "accuracyPct") return [`${value}%`, "Hit Rate"];
                if (name === "targets") return [value, "Targets"];
                return [value, name];
              }}
              labelStyle={{
                color: theme === "dark" ? "#a1a1aa" : "#525252",
                fontWeight: 600,
              }}
            />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="accuracyPct"
              stroke={theme === "dark" ? "#8b5cf6" : "#8b5cf6"}
              strokeWidth={2}
              fill="url(#colorAccuracy)"
              name="accuracyPct"
            />
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="targets"
              stroke={theme === "dark" ? "#06b6d4" : "#06b6d4"}
              strokeWidth={2}
              fill="url(#colorTargets)"
              name="targets"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Enhanced Legend */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${theme === "dark" ? "bg-purple-500" : "bg-purple-500"}`}></div>
            <span className={`text-xs font-medium ${theme === "dark" ? "text-zinc-300" : "text-gray-700"}`}>Hit Rate</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${theme === "dark" ? "bg-cyan-500" : "bg-cyan-500"}`}></div>
            <span className={`text-xs font-medium ${theme === "dark" ? "text-zinc-300" : "text-gray-700"}`}>Targets</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Clock className={`w-3 h-3 ${theme === "dark" ? "text-zinc-400" : "text-gray-500"}`} />
          <span className={`text-xs ${theme === "dark" ? "text-zinc-400" : "text-gray-500"}`}>Time to First Shot</span>
        </div>
      </div>
    </div>
  );
}
