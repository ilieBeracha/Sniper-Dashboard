import { useTheme } from "@/contexts/ThemeContext";
import { TrendingUp, TrendingDown, Calendar, Target, Activity, Zap, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import { useStore } from "zustand";
import { useStatsStore } from "@/store/statsStore";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart } from "recharts";
import { format, parseISO } from "date-fns";

export default function WeeklyTrends() {
  const { theme } = useTheme();
  const { weeklyTrends } = useStore(useStatsStore);
  const [groupByWeapon, setGroupByWeapon] = useState(false);

  const data = weeklyTrends || [];

  const processedData = useMemo(() => {
    if (!data.length) return { chartData: [], stats: null, trend: null };

    const groupedByWeek = data.reduce(
      (acc, item) => {
        const week = format(parseISO(item.week_start), "MMM d");
        if (!acc[week]) {
          acc[week] = {
            week,
            shots: 0,
            hits: 0,
            targets: 0,
            eliminated: 0,
            sessions: 0,
            hitRate: 0,
            eliminationRate: 0,
          };
        }
        acc[week].shots += item.shots;
        acc[week].hits += item.hits;
        acc[week].targets += item.targets;
        acc[week].eliminated += item.eliminated;
        acc[week].sessions += item.sessions;
        return acc;
      },
      {} as Record<string, any>,
    );

    const chartData = Object.values(groupedByWeek).map((week: any) => ({
      ...week,
      hitRate: week.shots > 0 ? Math.round((week.hits / week.shots) * 100) : 0,
      eliminationRate: week.targets > 0 ? Math.round((week.eliminated / week.targets) * 100) : 0,
    }));

    const totalShots = chartData.reduce((s, w) => s + w.shots, 0);
    const totalHits = chartData.reduce((s, w) => s + w.hits, 0);
    const totalTargets = chartData.reduce((s, w) => s + w.targets, 0);
    const totalEliminated = chartData.reduce((s, w) => s + w.eliminated, 0);

    const stats = {
      avgWeeklyShots: Math.round(totalShots / chartData.length),
      avgWeeklyTargets: Math.round(totalTargets / chartData.length),
      overallHitRate: totalShots > 0 ? Math.round((totalHits / totalShots) * 100) : 0,
      overallEliminationRate: totalTargets > 0 ? Math.round((totalEliminated / totalTargets) * 100) : 0,
    };

    const trend =
      chartData.length > 1
        ? {
            hitRateChange: chartData[chartData.length - 1].hitRate - chartData[0].hitRate,
            shotsChange: ((chartData[chartData.length - 1].shots - chartData[0].shots) / chartData[0].shots) * 100,
          }
        : null;

    return { chartData, stats, trend };
  }, [data]);

  const iconColor = theme === "dark" ? "text-zinc-400" : "text-gray-600";
  const border = theme === "dark" ? "border-zinc-800" : "border-gray-200";
  const textMain = theme === "dark" ? "text-white" : "text-gray-900";
  const textSub = theme === "dark" ? "text-zinc-400" : "text-gray-600";

  const { chartData, stats, trend } = processedData;

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div
      className={`rounded-lg p-2 sm:p-3 ${theme === "dark" ? "bg-zinc-900/50" : "bg-white"} 
      border ${border}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h4 className={`text-xs sm:text-sm font-semibold ${textMain}`}>Weekly Trends</h4>
          <p className={`text-[10px] sm:text-xs ${textSub} hidden sm:block`}>Performance over time</p>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setGroupByWeapon(!groupByWeapon)}
            className={`px-1.5 py-0.5 rounded-md text-[9px] sm:text-[10px] font-medium transition-colors
              ${
                groupByWeapon
                  ? theme === "dark"
                    ? "bg-zinc-700 text-zinc-200"
                    : "bg-gray-200 text-gray-700"
                  : theme === "dark"
                    ? "bg-zinc-800 text-zinc-400"
                    : "bg-gray-100 text-gray-600"
              }`}
          >
            {groupByWeapon ? "By Weapon" : "All"}
          </button>
          <BarChart3 className={`w-3 h-3 ${iconColor}`} />
        </div>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-1.5 rounded-md text-center ${theme === "dark" ? "bg-zinc-800/40" : "bg-gray-50"}`}
          >
            <Activity className={`w-3 h-3 mx-auto mb-0.5 ${iconColor}`} />
            <div className={`text-sm sm:text-base font-bold ${textMain}`}>{stats.avgWeeklyShots.toLocaleString()}</div>
            <div className={`text-[9px] ${textSub}`}>Shots/Week</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`p-1.5 rounded-md text-center ${theme === "dark" ? "bg-zinc-800/40" : "bg-gray-50"}`}
          >
            <Target className={`w-3 h-3 mx-auto mb-0.5 ${iconColor}`} />
            <div className={`text-sm sm:text-base font-bold ${textMain}`}>{stats.avgWeeklyTargets.toLocaleString()}</div>
            <div className={`text-[9px] ${textSub}`}>Targets/Week</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`p-1.5 rounded-md text-center ${theme === "dark" ? "bg-zinc-800/40" : "bg-gray-50"}`}
          >
            <Zap className={`w-3 h-3 mx-auto mb-0.5 ${iconColor}`} />
            <div className={`text-sm sm:text-base font-bold ${textMain}`}>{stats.overallHitRate}%</div>
            <div className={`text-[9px] ${textSub}`}>Hit Rate</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`p-1.5 rounded-md text-center ${theme === "dark" ? "bg-zinc-800/40" : "bg-gray-50"}`}
          >
            <Calendar className={`w-3 h-3 mx-auto mb-0.5 ${iconColor}`} />
            <div className={`text-sm sm:text-base font-bold ${textMain}`}>{stats.overallEliminationRate}%</div>
            <div className={`text-[9px] ${textSub}`}>Elimination</div>
          </motion.div>
        </div>
      )}

      {/* Main Chart */}
      <div className={`rounded-md p-2 mb-2 ${theme === "dark" ? "bg-zinc-800/20" : "bg-gray-50"}`}>
        <ResponsiveContainer width="100%" height={120}>
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorHitRate" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={theme === "dark" ? "#10b981" : "#059669"} stopOpacity={0.8} />
                <stop offset="95%" stopColor={theme === "dark" ? "#10b981" : "#059669"} stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="colorElimination" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={theme === "dark" ? "#f59e0b" : "#d97706"} stopOpacity={0.8} />
                <stop offset="95%" stopColor={theme === "dark" ? "#f59e0b" : "#d97706"} stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 6" stroke={theme === "dark" ? "#3f3f46" : "#e5e7eb"} opacity={0.4} vertical={false} />
            <XAxis dataKey="week" tick={{ fontSize: 9, fill: theme === "dark" ? "#a1a1aa" : "#525252" }} axisLine={false} tickLine={false} />
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
                if (name === "hitRate") return [`${value}%`, "Hit Rate"];
                if (name === "eliminationRate") return [`${value}%`, "Elimination"];
                return [value.toLocaleString(), name];
              }}
            />
            <Area type="monotone" dataKey="hitRate" stroke={theme === "dark" ? "#10b981" : "#059669"} strokeWidth={2} fill="url(#colorHitRate)" />
            <Area
              type="monotone"
              dataKey="eliminationRate"
              stroke={theme === "dark" ? "#f59e0b" : "#d97706"}
              strokeWidth={2}
              fill="url(#colorElimination)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Volume Chart */}
      <div className={`rounded-md p-2 mb-2 ${theme === "dark" ? "bg-zinc-800/20" : "bg-gray-50"}`}>
        <h5 className={`text-[10px] font-medium mb-1 ${textSub}`}>Training Volume</h5>
        <ResponsiveContainer width="100%" height={80}>
          <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 6" stroke={theme === "dark" ? "#3f3f46" : "#e5e7eb"} opacity={0.3} vertical={false} />
            <XAxis dataKey="week" hide />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                backgroundColor: theme === "dark" ? "#18181b" : "#ffffff",
                border: `1px solid ${theme === "dark" ? "#27272a" : "#e5e7eb"}`,
                borderRadius: 8,
                fontSize: 11,
              }}
              formatter={(value: any) => value.toLocaleString()}
            />
            <Line
              type="monotone"
              dataKey="shots"
              stroke={theme === "dark" ? "#8b5cf6" : "#7c3aed"}
              strokeWidth={1.5}
              dot={{ r: 2 }}
              activeDot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="targets"
              stroke={theme === "dark" ? "#06b6d4" : "#0891b2"}
              strokeWidth={1.5}
              dot={{ r: 2 }}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Trend Indicators */}
      {trend && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${theme === "dark" ? "bg-emerald-500" : "bg-emerald-600"}`}></div>
              <span className={`text-[9px] font-medium ${textSub}`}>Hit</span>
            </div>
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${theme === "dark" ? "bg-amber-500" : "bg-amber-600"}`}></div>
              <span className={`text-[9px] font-medium ${textSub}`}>Elim</span>
            </div>
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${theme === "dark" ? "bg-purple-500" : "bg-purple-600"}`}></div>
              <span className={`text-[9px] font-medium ${textSub}`}>Shots</span>
            </div>
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${theme === "dark" ? "bg-cyan-500" : "bg-cyan-600"}`}></div>
              <span className={`text-[9px] font-medium ${textSub}`}>Targets</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {trend.hitRateChange !== 0 && (
              <div
                className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[9px] font-medium
                ${
                  trend.hitRateChange > 0
                    ? theme === "dark"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-emerald-100 text-emerald-600"
                    : theme === "dark"
                      ? "bg-red-500/20 text-red-400"
                      : "bg-red-100 text-red-600"
                }`}
              >
                {trend.hitRateChange > 0 ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                {Math.abs(trend.hitRateChange)}%
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
