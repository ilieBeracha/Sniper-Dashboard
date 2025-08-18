import { useMemo } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { motion } from "framer-motion";
import { Users, Trophy, Target, RefreshCw, Shield } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useStore } from "zustand";
import { useStatsStore } from "@/store/statsStore";

export default function SquadImpactStats() {
  const { eliminationByPosition, statsOverviewTotals } = useStore(useStatsStore);
  const { theme } = useTheme();

  const { totalHits, topPerformers, overallAccuracy, squadStats, eliminationStats } = useMemo(() => {
    if (!statsOverviewTotals && !eliminationByPosition) {
      return { totalHits: 0, topPerformers: [], overallAccuracy: 0, squadStats: null, eliminationStats: null };
    }

    // Get overall stats from statsOverviewTotals
    const hits = statsOverviewTotals?.hits || 0;
    const targets = statsOverviewTotals?.targets || 0;
    const accuracy = statsOverviewTotals?.hit_pct || 0;
    const sessions = statsOverviewTotals?.sessions || 0;

    // Process elimination by position data
    const eliminationData = eliminationByPosition || [];
    const positionStats = eliminationData.map(pos => ({
      position: pos.bucket,
      targets: pos.targets,
      eliminated: pos.eliminated,
      percentage: Math.round(pos.elimination_pct * 100)
    }));

    // Create mock top performers data (since we don't have individual user data yet)
    const performers = [
      { name: "Top Performer", hits: Math.round(hits * 0.3), total: Math.round(targets * 0.25), accuracy: 95 },
      { name: "Squad Member 2", hits: Math.round(hits * 0.25), total: Math.round(targets * 0.25), accuracy: 88 },
      { name: "Squad Member 3", hits: Math.round(hits * 0.22), total: Math.round(targets * 0.25), accuracy: 82 },
      { name: "Squad Member 4", hits: Math.round(hits * 0.23), total: Math.round(targets * 0.25), accuracy: 78 },
    ].filter(p => p.total > 0);

    return {
      totalHits: hits,
      topPerformers: performers,
      overallAccuracy: accuracy,
      squadStats: {
        totalShots: targets,
        avgAccuracy: accuracy,
        activeMembers: sessions,
      },
      eliminationStats: positionStats,
    };
  }, [statsOverviewTotals, eliminationByPosition]);

  const chartData = [
    { name: "Accuracy", value: overallAccuracy, fill: theme === "dark" ? "#71717a" : "#6b7280" },
    { name: "Remaining", value: 100 - overallAccuracy, fill: theme === "dark" ? "#27272a" : "#f3f4f6" },
  ];

  return (
    <div
      className={`rounded-xl p-3 h-full ${theme === "dark" ? "bg-zinc-900/50" : "bg-white"} 
      border ${theme === "dark" ? "border-zinc-700/50" : "border-gray-200"}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className={`text-sm font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Squad Performance</h4>
          <p className={`text-xs ${theme === "dark" ? "text-zinc-400" : "text-gray-500"}`}>Team shooting statistics</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`p-1.5 rounded-lg ${theme === "dark" ? "bg-zinc-800 hover:bg-zinc-700" : "bg-gray-100 hover:bg-gray-200"} transition-colors`}
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </motion.button>
      </div>

      {/* Main Stats Section */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        {/* Accuracy Ring Chart */}
        <div className={`relative rounded-lg p-3 ${theme === "dark" ? "bg-zinc-800/30" : "bg-gray-50"}`}>
          <div className="relative h-28">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} cx="50%" cy="50%" innerRadius={30} outerRadius={45} startAngle={90} endAngle={-270} dataKey="value">
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{overallAccuracy}%</div>
                <div className={`text-[10px] ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>Accuracy</div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="space-y-2">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className={`flex items-center justify-between p-2 rounded-lg ${theme === "dark" ? "bg-zinc-800/30" : "bg-gray-100"}`}
          >
            <div className="flex items-center gap-2">
              <Target className={`w-3.5 h-3.5 ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`} />
              <span className={`text-xs ${theme === "dark" ? "text-zinc-300" : "text-gray-700"}`}>Total Hits</span>
            </div>
            <span className={`text-sm font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{totalHits.toLocaleString()}</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className={`flex items-center justify-between p-2 rounded-lg ${theme === "dark" ? "bg-zinc-800/30" : "bg-gray-100"}`}
          >
            <div className="flex items-center gap-2">
              <Users className={`w-3.5 h-3.5 ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`} />
              <span className={`text-xs ${theme === "dark" ? "text-zinc-300" : "text-gray-700"}`}>Active Squad</span>
            </div>
            <span className={`text-sm font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{squadStats?.activeMembers || 0}</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className={`flex items-center justify-between p-2 rounded-lg ${theme === "dark" ? "bg-zinc-800/30" : "bg-gray-100"}`}
          >
            <div className="flex items-center gap-2">
              <Shield className={`w-3.5 h-3.5 ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`} />
              <span className={`text-xs ${theme === "dark" ? "text-zinc-300" : "text-gray-700"}`}>Total Shots</span>
            </div>
            <span className={`text-sm font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              {squadStats?.totalShots.toLocaleString() || 0}
            </span>
          </motion.div>
        </div>
      </div>

      {/* Elimination by Position Section */}
      {eliminationStats && eliminationStats.length > 0 && (
        <div className={`rounded-lg p-2.5 mb-3 ${theme === "dark" ? "bg-zinc-800/30" : "bg-gray-50"}`}>
          <div className="flex items-center gap-2 mb-2">
            <Target className={`w-3.5 h-3.5 ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`} />
            <h5 className={`text-xs font-medium ${theme === "dark" ? "text-zinc-300" : "text-gray-700"}`}>Elimination by Position</h5>
          </div>
          <div className="space-y-1.5">
            {eliminationStats
              .filter(stat => stat.position !== "Total")
              .map((stat, index) => (
                <div
                  key={stat.position}
                  className={`flex items-center justify-between p-2 rounded-lg ${theme === "dark" ? "bg-zinc-900/50" : "bg-white"}`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${stat.position === "Standing" ? "bg-emerald-500" : "bg-blue-500"}`} />
                    <span className={`text-xs font-medium ${theme === "dark" ? "text-zinc-200" : "text-gray-800"}`}>
                      {stat.position}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className={`text-xs font-semibold ${theme === "dark" ? "text-zinc-300" : "text-gray-700"}`}>
                        {stat.eliminated}/{stat.targets}
                      </div>
                      <div className={`text-[10px] ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>targets</div>
                    </div>
                    <div className={`text-sm font-bold px-2 py-1 rounded-md ${
                      theme === "dark" ? "bg-zinc-800 text-zinc-200" : "bg-gray-100 text-gray-800"
                    }`}>
                      {stat.percentage}%
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Top Performers Section */}
      <div className={`rounded-lg p-2.5 ${theme === "dark" ? "bg-zinc-800/30" : "bg-gray-50"}`}>
        <div className="flex items-center gap-2 mb-2">
          <Trophy className={`w-3.5 h-3.5 ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`} />
          <h5 className={`text-xs font-medium ${theme === "dark" ? "text-zinc-300" : "text-gray-700"}`}>Top Performers</h5>
        </div>

        <div className="space-y-1.5">
          {topPerformers.length > 0 ? (
            topPerformers.map((performer, index) => {
              const medals = ["🥇", "🥈", "🥉", "🏅"];
              return (
                <motion.div
                  key={performer.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center gap-2 p-2 rounded-lg ${theme === "dark" ? "bg-zinc-900/50" : "bg-white"}`}
                >
                  <span className="text-sm">{medals[index]}</span>
                  <div className="flex-1">
                    <div className={`text-xs font-medium ${theme === "dark" ? "text-zinc-200" : "text-gray-800"}`}>{performer.name}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="flex-1 h-1.5 rounded-full bg-zinc-700/30 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${performer.accuracy}%` }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className={`h-full rounded-full ${theme === "dark" ? "bg-zinc-600" : "bg-gray-500"}`}
                        />
                      </div>
                      <span className={`text-[10px] font-medium ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>{performer.accuracy}%</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xs font-semibold ${theme === "dark" ? "text-zinc-300" : "text-gray-700"}`}>{performer.hits}</div>
                    <div className={`text-[10px] ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>hits</div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className={`text-center py-3 text-xs ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>No data available yet</div>
          )}
        </div>
      </div>
    </div>
  );
}
