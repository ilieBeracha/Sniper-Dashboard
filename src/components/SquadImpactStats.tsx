import { useMemo, useEffect } from "react";
import { useStore } from "zustand";
import { performanceStore } from "@/store/performance";
import { useTheme } from "@/contexts/ThemeContext";
import { motion } from "framer-motion";
import { Users, Trophy, TrendingUp, RefreshCw } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export default function SquadImpactStats() {
  const { squadWeaponStats, getSquadWeaponStats, isLoading } = useStore(performanceStore);
  const { theme } = useTheme();

  useEffect(() => {
    getSquadWeaponStats();
  }, [getSquadWeaponStats]);

  const handleRefresh = () => {
    getSquadWeaponStats();
  };

  const { totalHits, totalMisses, topPerformers, weaponPerformance, overallAccuracy } = useMemo(() => {
    if (!squadWeaponStats || squadWeaponStats.length === 0) {
      return { totalHits: 0, totalMisses: 0, topPerformers: [], weaponPerformance: [], overallAccuracy: 0 };
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
        userStats.set(userName, { name: userName, hits: 0, misses: 0, total: 0 });
      }
      
      const user = userStats.get(userName);
      user.hits += userHits;
      user.misses += userMisses;
      user.total += userHits + userMisses;
    });

    const accuracy = hits + misses > 0 ? Math.round((hits / (hits + misses)) * 100) : 0;
    const performers = Array.from(userStats.values())
      .filter(user => user.total > 0)
      .sort((a, b) => b.hits - a.hits)
      .slice(0, 3);

    const pieData = [
      { name: 'Hits', value: hits, color: theme === "dark" ? '#10b981' : '#059669' },
      { name: 'Misses', value: misses, color: theme === "dark" ? '#ef4444' : '#dc2626' }
    ];

    return {
      totalHits: hits,
      totalMisses: misses,
      topPerformers: performers,
      weaponPerformance: pieData,
      overallAccuracy: accuracy
    };
  }, [squadWeaponStats, theme]);

  if (isLoading) {
    return (
      <div className={`rounded-lg p-2 border ${theme === "dark" ? "bg-zinc-900/50 border-zinc-700/50" : "bg-white border-gray-200"}`}>
        <div className="animate-pulse space-y-2">
          <div className={`h-3 rounded w-1/3 ${theme === "dark" ? "bg-zinc-800" : "bg-gray-200"}`}></div>
          <div className={`h-20 rounded ${theme === "dark" ? "bg-zinc-800" : "bg-gray-200"}`}></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-lg p-2 border h-full ${theme === "dark" ? "bg-zinc-900/50 border-zinc-700/50" : "bg-white border-gray-200"}`}>
      {/* Compact Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <Users className={`w-3.5 h-3.5 ${theme === "dark" ? "text-zinc-400" : "text-gray-500"}`} />
          <h4 className={`text-xs font-medium ${theme === "dark" ? "text-zinc-200" : "text-gray-900"}`}>Squad Impact</h4>
        </div>
        <button
          onClick={handleRefresh}
          className={`p-1 rounded hover:bg-zinc-800/50 transition-colors ${
            theme === "dark" ? "text-zinc-400 hover:text-zinc-200" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <RefreshCw className="w-3 h-3" />
        </button>
      </div>

      {/* Compact Stats Grid */}
      <div className="grid grid-cols-2 gap-1 mb-2">
        <div className={`p-1.5 rounded text-center ${theme === "dark" ? "bg-zinc-800/30" : "bg-gray-50"}`}>
          <div className={`text-sm font-bold text-green-500`}>{totalHits}</div>
          <div className={`text-[9px] ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>Hits</div>
        </div>
        <div className={`p-1.5 rounded text-center ${theme === "dark" ? "bg-zinc-800/30" : "bg-gray-50"}`}>
          <div className={`text-sm font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{overallAccuracy}%</div>
          <div className={`text-[9px] ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>Accuracy</div>
        </div>
      </div>

      {/* Compact Chart and Top Performers */}
      <div className="grid grid-cols-2 gap-2">
        {/* Pie Chart */}
        <div className="relative">
          <ResponsiveContainer width="100%" height={80}>
            <PieChart>
              <Pie
                data={weaponPerformance}
                cx="50%"
                cy="50%"
                innerRadius={15}
                outerRadius={30}
                paddingAngle={2}
                dataKey="value"
              >
                {weaponPerformance.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: any) => value.toLocaleString()}
                contentStyle={{
                  backgroundColor: theme === "dark" ? "#18181b" : "#ffffff",
                  border: `1px solid ${theme === "dark" ? "#27272a" : "#e5e7eb"}`,
                  borderRadius: 4,
                  fontSize: 10,
                  padding: "4px 6px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          {totalHits + totalMisses === 0 && (
            <div className={`absolute inset-0 flex items-center justify-center text-[10px] ${
              theme === "dark" ? "text-zinc-500" : "text-gray-500"
            }`}>
              No data
            </div>
          )}
        </div>

        {/* Top Performers */}
        <div>
          <div className="flex items-center gap-1 mb-1">
            <Trophy className={`w-2.5 h-2.5 ${theme === "dark" ? "text-yellow-500" : "text-yellow-600"}`} />
            <span className={`text-[9px] font-medium ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>Top</span>
          </div>
          <div className="space-y-1">
            {topPerformers.length > 0 ? (
              topPerformers.map((performer, index) => (
                <motion.div
                  key={performer.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center justify-between p-1 rounded ${
                    theme === "dark" ? "bg-zinc-800/30" : "bg-gray-50"
                  }`}
                >
                  <span className={`text-[9px] truncate flex-1 ${
                    theme === "dark" ? "text-zinc-300" : "text-gray-700"
                  }`}>
                    {performer.name}
                  </span>
                  <span className={`text-[9px] font-medium ${
                    theme === "dark" ? "text-green-400" : "text-green-600"
                  }`}>
                    {performer.hits}
                  </span>
                </motion.div>
              ))
            ) : (
              <div className={`text-[9px] text-center py-2 ${
                theme === "dark" ? "text-zinc-500" : "text-gray-500"
              }`}>
                No performers yet
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Summary */}
      <div className={`mt-2 pt-2 border-t ${theme === "dark" ? "border-zinc-800" : "border-gray-200"} flex items-center justify-between`}>
        <div className="flex items-center gap-1">
          <TrendingUp className={`w-2.5 h-2.5 ${theme === "dark" ? "text-zinc-500" : "text-gray-400"}`} />
          <span className={`text-[9px] ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>
            Total shots: {totalHits + totalMisses}
          </span>
        </div>
        <span className={`text-[9px] ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>
          {topPerformers.length} active
        </span>
      </div>
    </div>
  );
}