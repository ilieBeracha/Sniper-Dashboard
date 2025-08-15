import { useMemo, useEffect } from "react";
import { useStore } from "zustand";
import { performanceStore } from "@/store/performance";
import { userStore } from "@/store/userStore";
import { useTheme } from "@/contexts/ThemeContext";
import { motion } from "framer-motion";
import { Users, Trophy, Target, RefreshCw, Shield } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export default function SquadImpactStats() {
  const { squadWeaponStats, getSquadWeaponStats, isLoading } = useStore(performanceStore);
  const { user } = useStore(userStore);
  const { theme } = useTheme();

  useEffect(() => {
    if (user?.team_id) {
      getSquadWeaponStats(user.team_id, null, null);
    }
  }, [user?.team_id, getSquadWeaponStats]);

  const handleRefresh = () => {
    if (user?.team_id) {
      getSquadWeaponStats(user.team_id, null, null);
    }
  };

  const { totalHits, topPerformers, overallAccuracy, squadStats } = useMemo(() => {
    if (!squadWeaponStats || squadWeaponStats.length === 0) {
      return { totalHits: 0, topPerformers: [], overallAccuracy: 0, squadStats: null };
    }

    let hits = 0;
    let misses = 0;
    const userStats = new Map();

    squadWeaponStats.forEach((stat: any) => {
      const userName = stat.user_name || 'Unknown';
      const userHits = stat.hits || 0;
      const userMisses = stat.misses || 0;
      
      hits += userHits;
      misses += userMisses;

      if (!userStats.has(userName)) {
        userStats.set(userName, { name: userName, hits: 0, misses: 0, total: 0, accuracy: 0 });
      }
      
      const user = userStats.get(userName);
      user.hits += userHits;
      user.misses += userMisses;
      user.total += userHits + userMisses;
      user.accuracy = user.total > 0 ? Math.round((user.hits / user.total) * 100) : 0;
    });

    const accuracy = hits + misses > 0 ? Math.round((hits / (hits + misses)) * 100) : 0;
    const performers = Array.from(userStats.values())
      .filter(user => user.total > 0)
      .sort((a, b) => b.accuracy - a.accuracy)
      .slice(0, 4);

    return {
      totalHits: hits,
      topPerformers: performers,
      overallAccuracy: accuracy,
      squadStats: {
        totalShots: hits + misses,
        avgAccuracy: performers.length > 0 
          ? Math.round(performers.reduce((acc, p) => acc + p.accuracy, 0) / performers.length)
          : 0,
        activeMembers: userStats.size
      }
    };
  }, [squadWeaponStats]);

  if (isLoading) {
    return (
      <div className={`rounded-xl p-3 ${theme === "dark" ? "bg-zinc-900/50" : "bg-white"} 
        border ${theme === "dark" ? "border-zinc-700/50" : "border-gray-200"}`}>
        <div className="animate-pulse space-y-3">
          <div className={`h-4 rounded w-1/3 ${theme === "dark" ? "bg-zinc-800" : "bg-gray-200"}`}></div>
          <div className={`h-32 rounded ${theme === "dark" ? "bg-zinc-800" : "bg-gray-200"}`}></div>
        </div>
      </div>
    );
  }

  const chartData = [
    { name: 'Accuracy', value: overallAccuracy, fill: theme === "dark" ? '#71717a' : '#6b7280' },
    { name: 'Remaining', value: 100 - overallAccuracy, fill: theme === "dark" ? '#27272a' : '#f3f4f6' }
  ];

  return (
    <div className={`rounded-xl p-3 h-full ${theme === "dark" ? "bg-zinc-900/50" : "bg-white"} 
      border ${theme === "dark" ? "border-zinc-700/50" : "border-gray-200"}`}>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className={`text-sm font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            🎯 Squad Performance
          </h4>
          <p className={`text-xs ${theme === "dark" ? "text-zinc-400" : "text-gray-500"}`}>
            Team shooting stats
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRefresh}
          className={`p-1.5 rounded-lg ${
            theme === "dark" ? "bg-zinc-800 hover:bg-zinc-700" : "bg-gray-100 hover:bg-gray-200"
          } transition-colors`}
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </motion.button>
      </div>

      {/* Main Stats Section */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        {/* Accuracy Ring Chart */}
        <div className={`relative rounded-lg p-3 ${
          theme === "dark" ? "bg-zinc-800/30" : "bg-gray-50"
        }`}>
          <div className="relative h-28">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={45}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  {overallAccuracy}%
                </div>
                <div className={`text-[10px] ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>
                  Accuracy
                </div>
                <div className={`text-[9px] font-medium mt-0.5 ${
                  overallAccuracy > 70 ? "text-green-500" : 
                  overallAccuracy > 40 ? "text-yellow-500" : "text-red-500"
                }`}>
                  {overallAccuracy > 70 ? "Sharp!" : 
                   overallAccuracy > 40 ? "Improving" : "Practice needed"}
                </div>
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
            className={`flex items-center justify-between p-2 rounded-lg ${
              theme === "dark" ? "bg-zinc-800/30" : "bg-gray-100"
            }`}
          >
            <div className="flex items-center gap-2">
              <Target className={`w-3.5 h-3.5 ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`} />
              <span className={`text-xs ${theme === "dark" ? "text-zinc-300" : "text-gray-700"}`}>
                Total Hits
              </span>
            </div>
            <div className="text-right">
              <span className={`text-sm font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                {totalHits.toLocaleString()}
              </span>
              <div className={`text-[9px] ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>
                {totalHits > 1000 ? "Active squad" : "More practice"}
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className={`flex items-center justify-between p-2 rounded-lg ${
              theme === "dark" ? "bg-zinc-800/30" : "bg-gray-100"
            }`}
          >
            <div className="flex items-center gap-2">
              <Users className={`w-3.5 h-3.5 ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`} />
              <span className={`text-xs ${theme === "dark" ? "text-zinc-300" : "text-gray-700"}`}>
                Active Squad
              </span>
            </div>
            <span className={`text-sm font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              {squadStats?.activeMembers || 0}
            </span>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className={`flex items-center justify-between p-2 rounded-lg ${
              theme === "dark" ? "bg-zinc-800/30" : "bg-gray-100"
            }`}
          >
            <div className="flex items-center gap-2">
              <Shield className={`w-3.5 h-3.5 ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`} />
              <span className={`text-xs ${theme === "dark" ? "text-zinc-300" : "text-gray-700"}`}>
                Total Shots
              </span>
            </div>
            <span className={`text-sm font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              {squadStats?.totalShots.toLocaleString() || 0}
            </span>
          </motion.div>
        </div>
      </div>

      {/* Top Performers Section */}
      <div className={`rounded-lg p-2.5 ${theme === "dark" ? "bg-zinc-800/30" : "bg-gray-50"}`}>
        <div className="flex items-center gap-2 mb-2">
          <Trophy className={`w-3.5 h-3.5 ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`} />
          <h5 className={`text-xs font-medium ${theme === "dark" ? "text-zinc-300" : "text-gray-700"}`}>
            Top Performers:
          </h5>
        </div>
        
        <div className="space-y-1.5">
          {topPerformers.length > 0 ? (
            topPerformers.map((performer, index) => {
              const medals = ['🥇', '🥈', '🥉', '🏅'];
              return (
                <motion.div
                  key={performer.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center gap-2 p-2 rounded-lg ${
                    theme === "dark" ? "bg-zinc-900/50" : "bg-white"
                  }`}
                >
                  <span className="text-sm">{medals[index]}</span>
                  <div className="flex-1">
                    <div className={`text-xs font-medium ${
                      theme === "dark" ? "text-zinc-200" : "text-gray-800"
                    }`}>
                      {performer.name}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="flex-1 h-1.5 rounded-full bg-zinc-700/30 overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${performer.accuracy}%` }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className={`h-full rounded-full ${
                            theme === "dark" ? "bg-zinc-600" : "bg-gray-500"
                          }`}
                        />
                      </div>
                      <span className={`text-[10px] font-medium ${
                        theme === "dark" ? "text-zinc-400" : "text-gray-600"
                      }`}>
                        {performer.accuracy}%
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xs font-semibold ${
                      theme === "dark" ? "text-zinc-300" : "text-gray-700"
                    }`}>
                      {performer.hits}
                    </div>
                    <div className={`text-[10px] ${
                      theme === "dark" ? "text-zinc-500" : "text-gray-500"
                    }`}>
                      hits
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className={`text-center py-3 text-xs ${
              theme === "dark" ? "text-zinc-500" : "text-gray-500"
            }`}>
              No data yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}