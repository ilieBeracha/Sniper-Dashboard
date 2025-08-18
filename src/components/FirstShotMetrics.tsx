import { useTheme } from "@/contexts/ThemeContext";
import { Crosshair, Sun, Moon, Activity } from "lucide-react";
import { motion } from "framer-motion";
import { useStore } from "zustand";
import { useStatsStore } from "@/store/statsStore";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

export default function FirstShotMetrics() {
  const { theme } = useTheme();
  const { firstShotMetrics } = useStore(useStatsStore);

  const data = firstShotMetrics || [];

  const overall = data.find((d) => d.scope === "OVERALL");
  const day = data.find((d) => d.scope === "DAY");
  const night = data.find((d) => d.scope === "NIGHT");

  const chartData = [
    {
      name: "Day",
      value: day?.first_shot_hit_pct ? Math.round(day.first_shot_hit_pct * 100) : 0,
      engagements: day?.engagements || 0,
      time: day?.median_ttf_sec || 0,
    },
    {
      name: "Night",
      value: night?.first_shot_hit_pct ? Math.round(night.first_shot_hit_pct * 100) : 0,
      engagements: night?.engagements || 0,
      time: night?.median_ttf_sec || 0,
    },
  ];

  const formatTime = (seconds: number | null) => {
    if (!seconds) return "—";
    return `${seconds.toFixed(1)}s`;
  };

  const textMain = theme === "dark" ? "text-white" : "text-gray-900";
  const textSub = theme === "dark" ? "text-zinc-400" : "text-gray-600";

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div
      className={`rounded-xl p-4 ${theme === "dark" ? "bg-zinc-900" : "bg-white"} 
      border ${theme === "dark" ? "border-zinc-800" : "border-gray-200"}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className={`text-sm font-semibold ${textMain}`}>First Shot Performance</h4>
          <p className={`text-xs ${textSub} mt-0.5`}>Accuracy metrics by time of day</p>
        </div>
        <Crosshair className={`w-4 h-4 ${theme === "dark" ? "text-violet-500" : "text-violet-400"}`} />
      </div>

      {/* Overall Stats Card */}
      {overall && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className={`grid grid-cols-3 gap-4 p-3 rounded-lg mb-4
            ${theme === "dark" ? "bg-zinc-800/30" : "bg-gray-50"}`}
        >
          <div className="text-center">
            <div className={`text-2xl font-bold ${theme === "dark" ? "text-emerald-400" : "text-emerald-600"}`}>
              {Math.round((overall.first_shot_hit_pct || 0) * 100)}%
            </div>
            <div className={`text-xs ${textSub}`}>Hit Rate</div>
          </div>

          <div className="text-center">
            <div className={`text-2xl font-bold ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`}>{overall.engagements.toLocaleString()}</div>
            <div className={`text-xs ${textSub}`}>Engagements</div>
          </div>

          <div className="text-center">
            <div className={`text-2xl font-bold ${theme === "dark" ? "text-violet-400" : "text-violet-600"}`}>
              {formatTime(overall.median_ttf_sec)}
            </div>
            <div className={`text-xs ${textSub}`}>Avg TTF</div>
          </div>
        </motion.div>
      )}

      {/* Day/Night Comparison Chart */}
      <div className="mb-4">
        <h5 className={`text-xs font-medium ${textSub} mb-3`}>Performance Comparison</h5>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: theme === "dark" ? "#71717a" : "#6b7280" }} axisLine={false} tickLine={false} />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 11, fill: theme === "dark" ? "#71717a" : "#6b7280" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: theme === "dark" ? "#18181b" : "#ffffff",
                border: `1px solid ${theme === "dark" ? "#27272a" : "#e5e7eb"}`,
                borderRadius: 6,
                fontSize: 11,
              }}
              formatter={(value: any, name: string) => {
                if (name === "value") return [`${value}%`, "Hit Rate"];
                return [value, name];
              }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              <Cell fill={theme === "dark" ? "#f59e0b" : "#f97316"} />
              <Cell fill={theme === "dark" ? "#6366f1" : "#4f46e5"} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Day/Night Detailed Stats */}
      <div className="grid grid-cols-2 gap-3">
        {/* Day Stats */}
        <div className={`p-3 rounded-lg border ${theme === "dark" ? "bg-zinc-800/20 border-zinc-800" : "bg-gray-50 border-gray-200"}`}>
          <div className="flex items-center gap-2 mb-3">
            <Sun className={`w-4 h-4 ${theme === "dark" ? "text-amber-500" : "text-amber-500"}`} />
            <span className={`text-xs font-medium ${textMain}`}>Day Performance</span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-baseline">
              <span className={`text-xs ${textSub}`}>Accuracy</span>
              <span className={`text-lg font-semibold ${textMain}`}>{day ? `${Math.round(day.first_shot_hit_pct * 100)}%` : "—"}</span>
            </div>

            <div className="flex justify-between items-baseline">
              <span className={`text-xs ${textSub}`}>Sessions</span>
              <span className={`text-sm font-medium ${textMain}`}>{day?.sessions.toLocaleString() || "—"}</span>
            </div>

            <div className="flex justify-between items-baseline">
              <span className={`text-xs ${textSub}`}>Avg TTF</span>
              <span className={`text-sm font-medium ${textMain}`}>{formatTime(day?.median_ttf_sec || null)}</span>
            </div>

            {day && (
              <div className={`mt-3 pt-3 border-t ${theme === "dark" ? "border-zinc-800" : "border-gray-200"}`}>
                <div className="flex justify-between items-center">
                  <span className={`text-xs ${textSub}`}>Efficiency</span>
                  <Activity className={`w-3 h-3 ${theme === "dark" ? "text-zinc-600" : "text-gray-400"}`} />
                </div>
                <div className={`mt-1 h-1 rounded-full overflow-hidden ${theme === "dark" ? "bg-zinc-800" : "bg-gray-200"}`}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.round(day.first_shot_hit_pct * 100)}%` }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className={`h-full ${theme === "dark" ? "bg-amber-500" : "bg-amber-400"}`}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Night Stats */}
        <div className={`p-3 rounded-lg border ${theme === "dark" ? "bg-zinc-800/20 border-zinc-800" : "bg-gray-50 border-gray-200"}`}>
          <div className="flex items-center gap-2 mb-3">
            <Moon className={`w-4 h-4 ${theme === "dark" ? "text-indigo-500" : "text-indigo-500"}`} />
            <span className={`text-xs font-medium ${textMain}`}>Night Performance</span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-baseline">
              <span className={`text-xs ${textSub}`}>Accuracy</span>
              <span className={`text-lg font-semibold ${textMain}`}>{night ? `${Math.round(night.first_shot_hit_pct * 100)}%` : "—"}</span>
            </div>

            <div className="flex justify-between items-baseline">
              <span className={`text-xs ${textSub}`}>Sessions</span>
              <span className={`text-sm font-medium ${textMain}`}>{night?.sessions.toLocaleString() || "—"}</span>
            </div>

            <div className="flex justify-between items-baseline">
              <span className={`text-xs ${textSub}`}>Avg TTF</span>
              <span className={`text-sm font-medium ${textMain}`}>{formatTime(night?.median_ttf_sec || null)}</span>
            </div>

            {night && (
              <div className={`mt-3 pt-3 border-t ${theme === "dark" ? "border-zinc-800" : "border-gray-200"}`}>
                <div className="flex justify-between items-center">
                  <span className={`text-xs ${textSub}`}>Efficiency</span>
                  <Activity className={`w-3 h-3 ${theme === "dark" ? "text-zinc-600" : "text-gray-400"}`} />
                </div>
                <div className={`mt-1 h-1 rounded-full overflow-hidden ${theme === "dark" ? "bg-zinc-800" : "bg-gray-200"}`}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.round(night.first_shot_hit_pct * 100)}%` }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className={`h-full ${theme === "dark" ? "bg-indigo-500" : "bg-indigo-400"}`}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
