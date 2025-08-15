import { useEffect, useMemo } from "react";
import { useStore } from "zustand";
import { performanceStore } from "@/store/performance";
import { userStore } from "@/store/userStore";
import { TrendingUp, TrendingDown, Minus, Target, Users, Zap, Activity, Trophy, Medal, Award, RefreshCw } from "lucide-react";
import { ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from "recharts";
import { useTheme } from "@/contexts/ThemeContext";

export default function SquadImpactStats() {
  const { user } = useStore(userStore);
  const { squadWeaponStats, isLoading, getSquadWeaponStats } = useStore(performanceStore);
  const { theme } = useTheme();

  // Fetch squad impact stats on mount and add refresh capability
  const refreshData = async () => {
    if (!user?.team_id) return;
    console.log("Refreshing squad weapon stats...");
    await getSquadWeaponStats(user.team_id, null, null);
  };

  useEffect(() => {
    refreshData();
  }, [user?.team_id]);

  // Add debug logging
  useEffect(() => {
    console.log("Squad weapon stats updated:", squadWeaponStats);
  }, [squadWeaponStats]);

  const stats = useMemo(() => {
    if (!squadWeaponStats || squadWeaponStats.length === 0) return null;

    const totalShots = squadWeaponStats.reduce((acc: number, d: any) => acc + (d.total_shots || 0), 0);
    const totalHits = squadWeaponStats.reduce((acc: number, d: any) => acc + (d.total_hits || 0), 0);
    const avgImpact = squadWeaponStats.reduce((acc: number, d: any) => acc + (d.hit_rate || 0), 0) / squadWeaponStats.length;
    const hitRate = totalShots > 0 ? (totalHits / totalShots) * 100 : 0;
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
      .slice(0, 3); // Reduced to 3 for more compact display

    console.log("Calculated stats:", { totalShots, totalHits, hitRate, activeUsers });
    return { totalShots, totalHits, avgImpact, hitRate, activeUsers, topPerformers };
  }, [squadWeaponStats]);

  const pieData = stats
    ? [
        { name: "Hits", value: stats.totalHits, fill: theme === "dark" ? "#10b981" : "#059669" },
        { name: "Misses", value: stats.totalShots - stats.totalHits, fill: theme === "dark" ? "#374151" : "#e5e7eb" },
      ]
    : [];

  return (
    <div
      className={`rounded-lg p-2 border shadow-sm h-full transition-all duration-300 ${
        theme === "dark" ? "bg-zinc-900/50 backdrop-blur-sm border-zinc-700/50" : "bg-white border-gray-200/80"
      }`}
    >
      <div className="mb-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div
              className={`p-1 rounded ${
                theme === "dark" ? "bg-emerald-500/20 border border-emerald-500/30" : "bg-emerald-100 border border-emerald-300/50"
              }`}
            >
              <Activity className={`w-3 h-3 ${theme === "dark" ? "text-emerald-400" : "text-emerald-600"}`} />
            </div>
            <div>
              <h4 className={`text-xs font-semibold ${theme === "dark" ? "text-zinc-200" : "text-gray-800"}`}>Squad Impact</h4>
              <p className={`text-[9px] ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>Team performance metrics</p>
            </div>
          </div>
          <button
            onClick={refreshData}
            disabled={isLoading}
            className={`p-1 rounded transition-all duration-200 ${
              theme === "dark" 
                ? "hover:bg-zinc-800 disabled:opacity-50" 
                : "hover:bg-gray-100 disabled:opacity-50"
            }`}
          >
            <RefreshCw className={`w-3 h-3 ${isLoading ? "animate-spin" : ""} ${theme === "dark" ? "text-zinc-400" : "text-gray-500"}`} />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-emerald-200 border-t-emerald-600 mx-auto mb-1"></div>
          </div>
          <p className={`text-[10px] font-medium ${theme === "dark" ? "text-zinc-400" : "text-gray-500"}`}>Loading squad data...</p>
        </div>
      ) : stats ? (
        <div className="space-y-2">
          {/* Compact Key Metrics */}
          <div className="grid grid-cols-4 gap-1">
            <StatCard icon={Target} value={stats.totalShots.toLocaleString()} label="Shots" theme={theme} />
            <StatCard icon={Target} value={`${Math.round(stats.hitRate)}%`} label="Hit%" theme={theme} accent="emerald" />
            <StatCard icon={Users} value={stats.activeUsers.toString()} label="Active" theme={theme} />
            <ImpactCard avgImpact={stats.avgImpact} theme={theme} />
          </div>

          {/* Compact Chart */}
          <div className="grid grid-cols-2 gap-1.5">
            {/* Pie Chart */}
            <div
              className={`rounded border p-1 ${theme === "dark" ? "bg-zinc-800/30 border-zinc-700/50" : "bg-gray-50 border-gray-200"}`}
            >
              <h5
                className={`text-[9px] font-medium text-center mb-0.5 ${theme === "dark" ? "text-zinc-300" : "text-gray-700"}`}
              >
                Hit Distribution
              </h5>
              <div className="h-20">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={15}
                      outerRadius={30}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: theme === "dark" ? "#18181b" : "#ffffff",
                        border: `1px solid ${theme === "dark" ? "#27272a" : "#e5e7eb"}`,
                        borderRadius: "6px",
                        fontSize: "9px",
                        padding: "4px 8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Stats Summary */}
            <div
              className={`rounded border p-1.5 ${theme === "dark" ? "bg-zinc-800/30 border-zinc-700/50" : "bg-gray-50 border-gray-200"}`}
            >
              <h5
                className={`text-[9px] font-medium text-center mb-1 ${theme === "dark" ? "text-zinc-300" : "text-gray-700"}`}
              >
                Performance Stats
              </h5>
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className={`text-[9px] ${theme === "dark" ? "text-zinc-400" : "text-gray-500"}`}>Total Hits</span>
                  <span className={`text-[10px] font-medium ${theme === "dark" ? "text-emerald-400" : "text-emerald-600"}`}>
                    {stats.totalHits.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`text-[9px] ${theme === "dark" ? "text-zinc-400" : "text-gray-500"}`}>Accuracy</span>
                  <span className={`text-[10px] font-medium ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`}>
                    {stats.hitRate.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`text-[9px] ${theme === "dark" ? "text-zinc-400" : "text-gray-500"}`}>Avg Impact</span>
                  <span className={`text-[10px] font-medium flex items-center gap-0.5`}>
                    {stats.avgImpact > 0 ? (
                      <TrendingUp className="w-2.5 h-2.5 text-emerald-500" />
                    ) : stats.avgImpact < 0 ? (
                      <TrendingDown className="w-2.5 h-2.5 text-rose-500" />
                    ) : (
                      <Minus className="w-2.5 h-2.5 text-gray-500" />
                    )}
                    <span className={stats.avgImpact > 0 ? "text-emerald-500" : stats.avgImpact < 0 ? "text-rose-500" : "text-gray-500"}>
                      {Math.abs(stats.avgImpact).toFixed(1)}%
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Compact Top Performers */}
          <TopPerformers topPerformers={stats.topPerformers} theme={theme} />
        </div>
      ) : (
        <div className="text-center py-4">
          <div
            className={`p-1.5 rounded-full mx-auto mb-1 w-8 h-8 flex items-center justify-center ${
              theme === "dark" ? "bg-zinc-800/50 border border-zinc-700/50" : "bg-gray-100 border border-gray-200"
            }`}
          >
            <Target className={`h-4 w-4 ${theme === "dark" ? "text-zinc-500" : "text-gray-400"}`} />
          </div>
          <p className={`text-[10px] font-medium ${theme === "dark" ? "text-zinc-400" : "text-gray-500"}`}>No training data available</p>
          <button
            onClick={refreshData}
            className={`mt-2 text-[9px] px-2 py-1 rounded border transition-all ${
              theme === "dark" 
                ? "border-zinc-700 hover:bg-zinc-800 text-zinc-400" 
                : "border-gray-300 hover:bg-gray-100 text-gray-600"
            }`}
          >
            Load Data
          </button>
        </div>
      )}
    </div>
  );
}

/* ===== Compact Helper Components ===== */

function StatCard({ icon, value, label, theme, accent }: { icon: React.ElementType; value: string; label: string; theme: string; accent?: string }) {
  const Icon = icon;
  
  return (
    <div
      className={`p-1 rounded-md border transition-all duration-200 ${
        theme === "dark" ? "bg-zinc-800/30 border-zinc-700/50" : "bg-gray-50 border-gray-200"
      }`}
    >
      <Icon className={`w-2.5 h-2.5 mx-auto mb-0.5 ${
        accent === "emerald" 
          ? theme === "dark" ? "text-emerald-400" : "text-emerald-600"
          : theme === "dark" ? "text-zinc-400" : "text-gray-600"
      }`} />
      <div className={`text-[10px] font-bold text-center ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{value}</div>
      <div className={`text-[8px] text-center ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>{label}</div>
    </div>
  );
}

function ImpactCard({ avgImpact, theme }: { avgImpact: number; theme: string }) {
  return (
    <div
      className={`p-1 rounded-md border transition-all duration-200 ${
        theme === "dark" ? "bg-zinc-800/30 border-zinc-700/50" : "bg-gray-50 border-gray-200"
      }`}
    >
      <Zap className={`w-2.5 h-2.5 mx-auto mb-0.5 ${
        avgImpact > 0 
          ? theme === "dark" ? "text-emerald-400" : "text-emerald-600"
          : avgImpact < 0
            ? theme === "dark" ? "text-rose-400" : "text-rose-600"
            : theme === "dark" ? "text-zinc-400" : "text-gray-600"
      }`} />
      <div className={`text-[10px] font-bold text-center flex items-center justify-center gap-0.5 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
        {avgImpact > 0 ? (
          <TrendingUp className="w-2 h-2 text-emerald-500" />
        ) : avgImpact < 0 ? (
          <TrendingDown className="w-2 h-2 text-rose-500" />
        ) : (
          <Minus className="w-2 h-2 text-gray-500" />
        )}
        {Math.abs(avgImpact).toFixed(1)}%
      </div>
      <div className={`text-[8px] text-center ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>Impact</div>
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
    <div className={`p-1.5 rounded-lg border ${theme === "dark" ? "bg-zinc-800/30 border-zinc-700/50" : "bg-gray-50 border-gray-200"}`}>
      <h5 className={`text-[9px] font-semibold mb-1 text-center ${theme === "dark" ? "text-zinc-300" : "text-gray-700"}`}>🏆 Top Performers</h5>
      <div className="space-y-1">
        {topPerformers.map((performer, index) => {
          const RankIcon = getRankIcon(index);
          return (
            <div
              key={performer.name}
              className={`p-1 rounded-md border transition-all duration-200 hover:scale-102 ${
                theme === "dark" ? "bg-zinc-800/20 border-zinc-700/30 hover:border-zinc-600/50" : "bg-white border-gray-200/80 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold ${
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
                    {RankIcon && <RankIcon className="w-2 h-2" />}
                    {!RankIcon && index + 1}
                  </div>
                  <div>
                    <div className={`text-[9px] font-medium ${theme === "dark" ? "text-zinc-200" : "text-gray-800"}`}>{performer.name}</div>
                    <div className={`text-[9px] ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>{performer.sessions} sessions</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-xs font-bold ${theme === "dark" ? "text-emerald-400" : "text-emerald-600"}`}>{performer.accuracy}%</div>
                  <div className={`text-[9px] ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>{performer.shots} shots</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}