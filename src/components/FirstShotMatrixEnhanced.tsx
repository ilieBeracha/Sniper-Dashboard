import { useTheme } from "@/contexts/ThemeContext";
import { Target, Clock, Crosshair, Activity, AlertCircle } from "lucide-react";
import { useMemo } from "react";
import { useStore } from "zustand";
import { useStatsStore } from "@/store/statsStore";
import { XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine, Area, AreaChart } from "recharts";

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

    // Calculate performance benchmarks
    const excellentThreshold = 80;
    const goodThreshold = 60;

    const zones = [
      {
        name: "Close",
        range: "0-300m",
        data: chartData.filter((d) => d.distance <= 300),
        color: theme === "dark" ? "#10b981" : "#059669",
        benchmark: 85, // Expected hit rate for close range
      },
      {
        name: "Medium",
        range: "300-600m",
        data: chartData.filter((d) => d.distance > 300 && d.distance <= 600),
        color: theme === "dark" ? "#f59e0b" : "#d97706",
        benchmark: 70, // Expected hit rate for medium range
      },
      {
        name: "Long",
        range: "600m+",
        data: chartData.filter((d) => d.distance > 600),
        color: theme === "dark" ? "#ef4444" : "#dc2626",
        benchmark: 50, // Expected hit rate for long range
      },
    ].map((zone) => {
      const avgHitRate = zone.data.length > 0 ? Math.round(zone.data.reduce((s, d) => s + d.hitRate, 0) / zone.data.length) : 0;
      const totalTargets = zone.data.reduce((s, d) => s + d.targets, 0);
      const trend = avgHitRate >= zone.benchmark ? "up" : avgHitRate >= zone.benchmark - 10 ? "neutral" : "down";
      const performance = avgHitRate >= excellentThreshold ? "excellent" : avgHitRate >= goodThreshold ? "good" : "needs-improvement";

      return {
        ...zone,
        avgHitRate,
        totalTargets,
        trend,
        performance,
        vsBenchmark: avgHitRate - zone.benchmark,
      };
    });

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
      {/* Key Metrics with Performance Indicators */}
      {stats && (
        <div className="grid grid-cols-4 gap-1.5 mb-2">
          <div className={`p-1.5 rounded text-center relative ${bgSecondary}`}>
            <Crosshair className={`w-2.5 h-2.5 mx-auto mb-0.5 text-emerald-500`} />
            <div className={`text-xs font-semibold ${textMain}`}>
              {stats.avgHitRate}%{stats.avgHitRate >= 80 && <span className="text-emerald-500 text-[8px] ml-0.5">●</span>}
              {stats.avgHitRate >= 60 && stats.avgHitRate < 80 && <span className="text-yellow-500 text-[8px] ml-0.5">●</span>}
              {stats.avgHitRate < 60 && <span className="text-red-500 text-[8px] ml-0.5">●</span>}
            </div>
            <div className={`text-[9px] ${textSub}`}>Hit Rate</div>
          </div>

          <div className={`p-1.5 rounded text-center ${bgSecondary}`}>
            <Clock className={`w-2.5 h-2.5 mx-auto mb-0.5 text-blue-500`} />
            <div className={`text-xs font-semibold ${textMain}`}>
              {stats.avgTime}s{parseFloat(stats.avgTime) <= 2 && <span className="text-emerald-500 text-[8px] ml-0.5">●</span>}
              {parseFloat(stats.avgTime) > 2 && parseFloat(stats.avgTime) <= 4 && <span className="text-yellow-500 text-[8px] ml-0.5">●</span>}
              {parseFloat(stats.avgTime) > 4 && <span className="text-red-500 text-[8px] ml-0.5">●</span>}
            </div>
            <div className={`text-[9px] ${textSub}`}>Avg TTF</div>
          </div>

          <div className={`p-1.5 rounded text-center ${bgSecondary}`}>
            <Target className={`w-2.5 h-2.5 mx-auto mb-0.5 text-orange-500`} />
            <div className={`text-xs font-semibold ${textMain}`}>{stats.bestRange?.distance || "—"}m</div>
            <div className={`text-[9px] ${textSub}`}>Optimal</div>
          </div>

          <div className={`p-1.5 rounded text-center ${bgSecondary}`}>
            <Activity className={`w-2.5 h-2.5 mx-auto mb-0.5 text-violet-500`} />
            <div className={`text-xs font-semibold ${textMain}`}>{stats.totalTargets.toLocaleString()}</div>
            <div className={`text-[9px] ${textSub}`}>Targets</div>
          </div>
        </div>
      )}

      {/* Performance Curve with Benchmarks */}
      <div className={`rounded p-1.5 mb-2 ${bgSecondary}`}>
        <div className={`text-[9px] font-medium ${textSub} mb-1`}>Hit Rate vs Distance</div>
        <ResponsiveContainer width="100%" height={120}>
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
            <defs>
              <linearGradient id="colorHitRate" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={theme === "dark" ? "#8b5cf6" : "#7c3aed"} stopOpacity={0.8} />
                <stop offset="95%" stopColor={theme === "dark" ? "#8b5cf6" : "#7c3aed"} stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={theme === "dark" ? "#3f3f46" : "#e5e7eb"} opacity={0.3} />
            <XAxis
              dataKey="distance"
              tick={{ fontSize: 9, fill: theme === "dark" ? "#71717a" : "#9ca3af" }}
              axisLine={false}
              tickLine={false}
              label={{
                value: "Distance (m)",
                position: "insideBottom",
                offset: -5,
                style: { fontSize: 8, fill: theme === "dark" ? "#71717a" : "#9ca3af" },
              }}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 9, fill: theme === "dark" ? "#71717a" : "#9ca3af" }}
              axisLine={false}
              tickLine={false}
              label={{ value: "Hit %", angle: -90, position: "insideLeft", style: { fontSize: 8, fill: theme === "dark" ? "#71717a" : "#9ca3af" } }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: theme === "dark" ? "#18181b" : "#ffffff",
                border: `1px solid ${theme === "dark" ? "#3f3f46" : "#e5e7eb"}`,
                borderRadius: 4,
                fontSize: 10,
                padding: "4px 8px",
              }}
              formatter={(value: any, name: string) => {
                if (name === "hitRate") return [`${value}%`, "Hit Rate"];
                return [value, name];
              }}
            />
            <ReferenceLine y={80} stroke={theme === "dark" ? "#10b981" : "#059669"} strokeDasharray="5 5" strokeOpacity={0.5} />
            <ReferenceLine y={60} stroke={theme === "dark" ? "#f59e0b" : "#d97706"} strokeDasharray="5 5" strokeOpacity={0.5} />
            <ReferenceLine y={40} stroke={theme === "dark" ? "#ef4444" : "#dc2626"} strokeDasharray="5 5" strokeOpacity={0.5} />
            <Area type="monotone" dataKey="hitRate" stroke={theme === "dark" ? "#8b5cf6" : "#7c3aed"} strokeWidth={2} fill="url(#colorHitRate)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Zone Performance Bars */}

      {/* Zone Performance Cards with Insights */}
      <div className="grid grid-cols-3 gap-1.5">
        {zones.map((zone) => (
          <div key={zone.name} className={`p-1.5 rounded relative ${bgSecondary}`}>
            <div className="flex items-center justify-between mb-0.5">
              <span className={`text-[10px] font-medium ${textMain}`}>{zone.name}</span>
            </div>
            <div className="flex items-baseline gap-1">
              <div className={`text-sm font-semibold`} style={{ color: zone.color }}>
                {zone.avgHitRate === 0 ? "—" : zone.avgHitRate + "%"}
              </div>
            </div>
            <div className={`text-[9px] ${textSub}`}>
              {zone.totalTargets.toLocaleString()} shots • {zone.range}
            </div>
            <div className="mt-1">
              <div className={`h-1 rounded-full overflow-hidden relative ${theme === "dark" ? "bg-zinc-800" : "bg-gray-200"}`}>
                <div className="absolute top-0 h-full w-px bg-zinc-600" style={{ left: `${zone.benchmark}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
