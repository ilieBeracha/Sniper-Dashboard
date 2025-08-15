import { useMemo } from "react";
import { useStore } from "zustand";
import { performanceStore } from "@/store/performance";
import { useTheme } from "@/contexts/ThemeContext";
import { Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { ComposedChart, Line } from "recharts";
import { Target, TrendingUp } from "lucide-react";

export default function ChartMatrix() {
  const { firstShotMatrix, isLoading } = useStore(performanceStore);
  const { theme } = useTheme();

  const matrixData = useMemo(() => {
    if (!firstShotMatrix || isLoading) return null;

    type Row = {
      distance_bucket: number;
      targets: number;
      first_shot_hit_rate: number; // 0..1
      avg_time_to_first_shot_sec: number | null;
      // might contain position in the payload; we ignore it
    };
    const rows = firstShotMatrix as Row[];
    
    // Debug log to see the raw data
    console.log("First Shot Matrix raw data:", rows);

    // Aggregate across positions → per distance bucket
    const byBucket = new Map<number, { bucket: number; targets: number; hits: number; avgTimeSum: number; avgTimeN: number }>();
    for (const r of rows) {
      const b = r.distance_bucket;
      if (!byBucket.has(b)) byBucket.set(b, { bucket: b, targets: 0, hits: 0, avgTimeSum: 0, avgTimeN: 0 });
      const acc = byBucket.get(b)!;
      const targets = r.targets ?? 0;
      const hitRate = r.first_shot_hit_rate ?? 0;
      
      // Ensure hit rate is between 0 and 1
      const validHitRate = Math.max(0, Math.min(1, hitRate));
      
      acc.targets += targets;
      // Calculate hits based on targets and hit rate
      acc.hits += Math.round(targets * validHitRate);
      
      if (typeof r.avg_time_to_first_shot_sec === "number") {
        acc.avgTimeSum += r.avg_time_to_first_shot_sec;
        acc.avgTimeN += 1;
      }
    }
    
    // Debug log to see the aggregated data
    console.log("Aggregated data by bucket:", Array.from(byBucket.entries()));

    const buckets = Array.from(byBucket.values())
      .sort((a, b) => a.bucket - b.bucket)
      .map((x) => {
        const ratePct = x.targets > 0 ? Math.round((x.hits / x.targets) * 100) : 0;
        const avgTime = x.avgTimeN > 0 ? Math.round((x.avgTimeSum / x.avgTimeN) * 10) / 10 : null;
        
        // Debug individual bucket calculations
        console.log(`Bucket ${x.bucket}m: targets=${x.targets}, hits=${x.hits}, rate=${ratePct}%`);
        
        return {
          bucket: `${x.bucket}m`,
          ratePct,
          targets: x.targets,
          avgTime,
        };
      });

    return { buckets };
  }, [firstShotMatrix, isLoading]);

  if (isLoading) {
    return (
      <div className={`rounded-lg p-2 border ${theme === "dark" ? "bg-zinc-900/50 border-zinc-700/50" : "bg-white border-gray-200"}`}>
        <div className="animate-pulse space-y-2">
          <div className={`h-3 rounded w-1/3 ${theme === "dark" ? "bg-zinc-800" : "bg-gray-200"}`}></div>
          <div className="h-24 rounded ${theme === "dark" ? "bg-zinc-800" : "bg-gray-200"}"></div>
        </div>
      </div>
    );
  }

  if (!firstShotMatrix || !matrixData?.buckets || matrixData?.buckets?.length === 0) {
    return (
      <div className={`rounded-lg p-2 border text-center ${theme === "dark" ? "bg-zinc-900/50 border-zinc-700/50" : "bg-white border-gray-200"}`}>
        <p className={`text-xs ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>No first shot data available</p>
      </div>
    );
  }

  // Calculate summary stats
  const totalTargets = matrixData.buckets.reduce((sum, b) => sum + b.targets, 0);
  const weightedHitRate = matrixData.buckets.reduce((sum, b) => sum + (b.ratePct * b.targets), 0) / totalTargets;
  const bestDistance = matrixData.buckets.reduce((best, b) => b.ratePct > best.ratePct ? b : best);

  return (
    <div className={`rounded-lg p-2 border ${theme === "dark" ? "bg-zinc-900/50 border-zinc-700/50" : "bg-white border-gray-200"}`}>
      {/* Compact Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <Target className={`w-3.5 h-3.5 ${theme === "dark" ? "text-zinc-400" : "text-gray-500"}`} />
          <div>
            <h4 className={`text-xs font-medium ${theme === "dark" ? "text-zinc-200" : "text-gray-900"}`}>First-Shot Accuracy</h4>
            <p className={`text-[9px] ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>Hit rate by distance</p>
          </div>
        </div>
        <TrendingUp className={`w-2.5 h-2.5 ${theme === "dark" ? "text-zinc-500" : "text-gray-400"}`} />
      </div>

      {/* Compact Summary Stats */}
      <div className="grid grid-cols-3 gap-1 mb-2">
        <div className={`text-center p-1.5 rounded ${theme === "dark" ? "bg-zinc-800/30" : "bg-gray-50"}`}>
          <div className={`text-sm font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{Math.round(weightedHitRate)}%</div>
          <div className={`text-[9px] ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>Overall</div>
        </div>
        <div className={`text-center p-1.5 rounded ${theme === "dark" ? "bg-zinc-800/30" : "bg-gray-50"}`}>
          <div className={`text-sm font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{bestDistance.bucket}</div>
          <div className={`text-[9px] ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>Best</div>
        </div>
        <div className={`text-center p-1.5 rounded ${theme === "dark" ? "bg-zinc-800/30" : "bg-gray-50"}`}>
          <div className={`text-sm font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{totalTargets}</div>
          <div className={`text-[9px] ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>Targets</div>
        </div>
      </div>

      {/* Compact Chart */}
      <div className="mb-2">
        <ResponsiveContainer width="100%" height={120}>
          <ComposedChart data={matrixData.buckets} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme === "dark" ? "#3f3f46" : "#e5e7eb"} opacity={0.3} />
            <XAxis
              dataKey="bucket"
              tick={{ fontSize: 9, fill: theme === "dark" ? "#a1a1aa" : "#525252" }}
              axisLine={{ stroke: theme === "dark" ? "#3f3f46" : "#e5e7eb", strokeWidth: 1 }}
              tickLine={false}
            />
            <YAxis
              yAxisId="left"
              tick={{ fontSize: 9, fill: theme === "dark" ? "#a1a1aa" : "#525252" }}
              domain={[0, 100]}
              axisLine={{ stroke: theme === "dark" ? "#3f3f46" : "#e5e7eb", strokeWidth: 1 }}
              tickLine={false}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 9, fill: theme === "dark" ? "#a1a1aa" : "#525252" }}
              axisLine={{ stroke: theme === "dark" ? "#3f3f46" : "#e5e7eb", strokeWidth: 1 }}
              tickLine={false}
            />
            <Tooltip
              formatter={(v: any, n: string) => {
                if (n === "Hit Rate") return [`${v}%`, "Hit Rate"];
                if (n === "Targets") return [v, "Targets"];
                return [v, n];
              }}
              labelFormatter={(label) => `${label}`}
              contentStyle={{
                backgroundColor: theme === "dark" ? "#18181b" : "#ffffff",
                border: `1px solid ${theme === "dark" ? "#27272a" : "#e5e7eb"}`,
                borderRadius: 4,
                fontSize: 10,
                padding: "4px 6px",
              }}
            />
            <Bar 
              yAxisId="left" 
              dataKey="ratePct" 
              name="Hit Rate" 
              fill={theme === "dark" ? "#10b981" : "#059669"} 
              radius={[2, 2, 0, 0]}
              opacity={0.8}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="targets"
              name="Targets"
              dot={false}
              stroke={theme === "dark" ? "#3b82f6" : "#2563eb"}
              strokeWidth={1.5}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Compact Distance Grid */}
      <div className="grid grid-cols-4 gap-1">
        {matrixData.buckets.slice(0, 8).map((b) => (
          <div 
            key={b.bucket} 
            className={`p-1 rounded text-center ${
              theme === "dark" ? "bg-zinc-800/30" : "bg-gray-50"
            }`}
          >
            <div className={`text-[9px] ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>{b.bucket}</div>
            <div className={`text-xs font-semibold ${
              b.ratePct >= 75 ? "text-green-500" : 
              b.ratePct >= 50 ? "text-yellow-500" : 
              "text-red-500"
            }`}>
              {b.ratePct}%
            </div>
            <div className={`text-[8px] ${theme === "dark" ? "text-zinc-600" : "text-gray-400"}`}>{b.targets}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
