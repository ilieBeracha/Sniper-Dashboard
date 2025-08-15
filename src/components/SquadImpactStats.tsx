import { useEffect, useMemo } from "react";
import { useStore } from "zustand";
import { performanceStore } from "@/store/performance";
import { userStore } from "@/store/userStore";
import { TrendingUp, TrendingDown, Minus, Target, Users, Zap, Activity, Trophy, Medal, Award } from "lucide-react";
import { RadialBarChart, RadialBar, Legend, ResponsiveContainer, Tooltip } from "recharts";
import { useTheme } from "@/contexts/ThemeContext";

export default function SquadImpactStats() {
  const { user } = useStore(userStore);
  const { squadWeaponStats, isLoading, getSquadWeaponStats } = useStore(performanceStore);
  const { theme } = useTheme();

  // Fetch squad impact stats on mount
  useEffect(() => {
    if (!user?.team_id) return;
    getSquadWeaponStats(user.team_id, null, null);
  }, [user?.team_id, getSquadWeaponStats]);

  const stats = useMemo(() => {
    if (!squadWeaponStats || squadWeaponStats.length === 0) return null;

    const totalShots = squadWeaponStats.reduce((acc: number, d: any) => acc + (d.total_shots || 0), 0);
    const totalHits = squadWeaponStats.reduce((acc: number, d: any) => acc + (d.total_hits || 0), 0);
    
    // Calculate overall squad hit rate
    const hitRate = totalShots > 0 ? (totalHits / totalShots) * 100 : 0;
    
    // Calculate squad impact as the difference between current hit rate and baseline (50%)
    // Positive impact means performing above baseline, negative means below
    const baselineHitRate = 50; // 50% is considered baseline performance
    const squadImpact = hitRate - baselineHitRate;
    
    const activeUsers = new Set(squadWeaponStats.map((d: any) => d.user_id)).size;

    const userPerformance: { [key: string]: any } = {};
    squadWeaponStats.forEach((stat: any) => {
      const userName = `${stat.first_name} ${stat.last_name}`;
      if (!userPerformance[userName]) {
        userPerformance[userName] = { name: userName, shots: 0, hits: 0, sessions: 0 };
      }
      userPerformance[userName].shots += stat.total_shots || 0;
      userPerformance[userName].hits += stat.total_hits || 0;
      userPerformance[userName].sessions += 1;
    });

    const topPerformers = Object.values(userPerformance)
      .map((u: any) => ({
        ...u,
        accuracy: u.shots > 0 ? Math.round((u.hits / u.shots) * 100) : 0,
      }))
      .sort((a, b) => b.accuracy - a.accuracy)
      .slice(0, 5);

    return { totalShots, totalHits, squadImpact, hitRate, activeUsers, topPerformers };
  }, [squadWeaponStats]);

  const radialData = stats
    ? [
        { name: "Hit Rate", value: Math.round(stats.hitRate), fill: theme === "dark" ? "#10b981" : "#059669" },
        { name: "Impact", value: Math.round(Math.min(Math.abs(stats.squadImpact), 100)), fill: theme === "dark" ? "#3b82f6" : "#2563eb" },
        { name: "Activity", value: Math.min(stats.activeUsers * 20, 100), fill: theme === "dark" ? "#f59e0b" : "#d97706" },
      ]
    : [];

  return (
    <div
      className={`rounded-xl p-3 border shadow-sm h-full transition-all duration-300 ${
        theme === "dark" ? "bg-zinc-900/50 backdrop-blur-sm border-zinc-700/50" : "bg-white border-gray-200/80"
      }`}
    >
      <div className="mb-2">
        <div className="flex items-center gap-2 mb-1">
          <div
            className={`p-1.5 rounded-lg ${
              theme === "dark" ? "bg-emerald-500/20 border border-emerald-500/30" : "bg-emerald-100 border border-emerald-300/50"
            }`}
          >
            <Activity className={`w-3 h-3 ${theme === "dark" ? "text-emerald-400" : "text-emerald-600"}`} />
          </div>
          <div>
            <h4 className={`text-sm font-semibold ${theme === "dark" ? "text-zinc-200" : "text-gray-800"}`}>Squad Impact Analysis</h4>
            <p className={`text-[10px] ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>Team-wide performance metrics</p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-6">
          <div className="relative">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-emerald-200 border-t-emerald-600 mx-auto mb-2"></div>
          </div>
          <p className={`text-xs font-medium ${theme === "dark" ? "text-zinc-400" : "text-gray-500"}`}>Loading squad impact data...</p>
        </div>
      ) : stats ? (
        <div className="space-y-3">
          {/* Compact Key Metrics */}
          <div className="grid grid-cols-2 gap-2">
            <StatCard icon={Target} color="emerald" value={stats.totalShots.toLocaleString()} label="Total Shots" theme={theme} />
            <StatCard icon={Target} color="blue" value={`${Math.round(stats.hitRate)}%`} label="Hit Rate" theme={theme} />
            <StatCard icon={Users} color="amber" value={stats.activeUsers.toString()} label="Active Users" theme={theme} />
            <ImpactCard squadImpact={stats.squadImpact} theme={theme} />
          </div>

          {/* Compact Charts Row */}
          <div className="">
            {/* Radial Chart */}
            <div
              className={`rounded-lg border overflow-hidden ${theme === "dark" ? "bg-zinc-800/30 border-zinc-700/50" : "bg-gray-50 border-gray-200"}`}
            >
              <h5
                className={`text-xs font-medium py-1 text-center border-b ${theme === "dark" ? "text-zinc-300 border-zinc-700" : "text-gray-700 border-gray-200"}`}
              >
                Performance Overview
              </h5>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart
                    cx="50%"
                    cy="50%"
                    innerRadius="15%"
                    outerRadius="90%"
                    data={radialData}
                  >
                    <RadialBar dataKey="value" cornerRadius={4} />
                    <Legend layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ fontSize: "9px" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: theme === "dark" ? "#18181b" : "#ffffff",
                        border: `1px solid ${theme === "dark" ? "#27272a" : "#e5e7eb"}`,
                        borderRadius: "8px",
                        fontSize: "9px",
                      }}
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Compact Top Performers */}
          <TopPerformers topPerformers={stats.topPerformers} theme={theme} />
        </div>
      ) : (
        <div className="text-center py-6">
          <div
            className={`p-2 rounded-full mx-auto mb-2 w-10 h-10 flex items-center justify-center ${
              theme === "dark" ? "bg-zinc-800/50 border border-zinc-700/50" : "bg-gray-100 border border-gray-200"
            }`}
          >
            <Target className={`h-5 w-5 ${theme === "dark" ? "text-zinc-500" : "text-gray-400"}`} />
          </div>
          <p className={`text-xs font-medium ${theme === "dark" ? "text-zinc-400" : "text-gray-500"}`}>No training data available</p>
        </div>
      )}
    </div>
  );
}

/* ===== Compact Helper Components ===== */

function StatCard({ icon, color, value, label, theme }: { icon: React.ElementType; color: string; value: string; label: string; theme: string }) {
  const Icon = icon;
  const colorClasses = {
    emerald:
      theme === "dark" ? "from-emerald-500/20 to-emerald-600/20 border-emerald-500/30" : "from-emerald-100 to-emerald-200 border-emerald-300/50",
    blue: theme === "dark" ? "from-blue-500/20 to-blue-600/20 border-blue-500/30" : "from-blue-100 to-blue-200 border-blue-300/50",
    amber: theme === "dark" ? "from-amber-500/20 to-amber-600/20 border-amber-500/30" : "from-amber-100 to-amber-200 border-amber-300/50",
  };

  return (
    <div
      className={`p-2 rounded-lg border transition-all duration-200 hover:scale-102 ${
        theme === "dark" ? "bg-zinc-800/30 border-zinc-700/50" : "bg-gray-50 border-gray-200"
      }`}
    >
      <div className="flex items-center justify-between mb-1">
        <div className={`p-1 rounded-md bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]}`}>
          <Icon className={`w-3 h-3 ${theme === "dark" ? `text-${color}-400` : `text-${color}-600`}`} />
        </div>
        <div className={`w-1.5 h-1.5 rounded-full bg-${color}-500 animate-pulse`} />
      </div>
      <div className={`text-sm font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{value}</div>
      <div className={`text-[10px] ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>{label}</div>
    </div>
  );
}

function ImpactCard({ squadImpact, theme }: { squadImpact: number; theme: string }) {
  const getImpactColor = (impact: number) => {
    if (impact > 0) return "emerald";
    if (impact < 0) return "rose";
    return "gray";
  };

  const color = getImpactColor(squadImpact);

  return (
    <div
      className={`p-2 rounded-lg border transition-all duration-200 hover:scale-102 ${
        theme === "dark" ? "bg-zinc-800/30 border-zinc-700/50" : "bg-gray-50 border-gray-200"
      }`}
    >
      <div className="flex items-center justify-between mb-1">
        <div
          className={`p-1 rounded-md ${
            theme === "dark"
              ? `bg-gradient-to-br from-${color}-500/20 to-${color}-600/20 border border-${color}-500/30`
              : `bg-gradient-to-br from-${color}-100 to-${color}-200 border border-${color}-300/50`
          }`}
        >
          <Zap className={`w-3 h-3 ${theme === "dark" ? `text-${color}-400` : `text-${color}-600`}`} />
        </div>
        <div className={`w-1.5 h-1.5 rounded-full bg-${color}-500 animate-pulse`} />
      </div>
      <div className={`text-sm font-bold flex items-center gap-0.5 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
        {squadImpact > 0 ? (
          <TrendingUp className="w-3 h-3 text-emerald-500" />
        ) : squadImpact < 0 ? (
          <TrendingDown className="w-3 h-3 text-rose-500" />
        ) : (
          <Minus className="w-3 h-3 text-gray-500" />
        )}
        {squadImpact > 0 ? '+' : ''}{squadImpact.toFixed(1)}%
      </div>
      <div className={`text-[10px] ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>Squad Impact</div>
    </div>
  );
}

function TopPerformers({ topPerformers, theme }: { topPerformers: any[]; theme: string }) {
  const getRankIcon = (index: number) => {
    if (index === 0) return Trophy;
    if (index === 1) return Medal;
    if (index === 2) return Award;
    return null;
  };

  return (
    <div className={`p-2 rounded-lg border ${theme === "dark" ? "bg-zinc-800/30 border-zinc-700/50" : "bg-gray-50 border-gray-200"}`}>
      <h5 className={`text-xs font-semibold mb-2 text-center ${theme === "dark" ? "text-zinc-300" : "text-gray-700"}`}>🏆 Top Performers</h5>
      <div className="space-y-1.5">
        {topPerformers.map((performer, index) => {
          const RankIcon = getRankIcon(index);
          return (
            <div
              key={performer.name}
              className={`p-1.5 rounded-md border transition-all duration-200 hover:scale-102 ${
                theme === "dark" ? "bg-zinc-800/20 border-zinc-700/30 hover:border-zinc-600/50" : "bg-white border-gray-200/80 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      index === 0
                        ? theme === "dark"
                          ? "bg-amber-500/30 text-amber-400 border border-amber-500/50"
                          : "bg-amber-100 text-amber-700 border border-amber-400/50"
                        : index === 1
                          ? theme === "dark"
                            ? "bg-gray-500/30 text-gray-300 border border-gray-500/50"
                            : "bg-gray-100 text-gray-600 border border-gray-400/50"
                          : index === 2
                            ? theme === "dark"
                              ? "bg-amber-600/30 text-amber-300 border border-amber-600/50"
                              : "bg-amber-200 text-amber-800 border border-amber-500/50"
                            : theme === "dark"
                              ? "bg-zinc-700/50 text-zinc-300 border border-zinc-600/50"
                              : "bg-gray-100 text-gray-700 border border-gray-300"
                    }`}
                  >
                    {RankIcon && <RankIcon className="w-2.5 h-2.5" />}
                    {!RankIcon && index + 1}
                  </div>
                  <div>
                    <div className={`text-xs font-medium ${theme === "dark" ? "text-zinc-200" : "text-gray-800"}`}>{performer.name}</div>
                    <div className={`text-[10px] ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>{performer.sessions} sessions</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-bold ${theme === "dark" ? "text-emerald-400" : "text-emerald-600"}`}>{performer.accuracy}%</div>
                  <div className={`text-[10px] ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>{performer.shots} shots</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}