import { useMemo } from "react";
import { useStore } from "zustand";
import { performanceStore } from "@/store/performance";
import { useTheme } from "@/contexts/ThemeContext";
import { Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { ComposedChart, Line, Legend } from "recharts";

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

    // Aggregate across positions → per distance bucket
    const byBucket = new Map<number, { bucket: number; targets: number; hits: number; avgTimeSum: number; avgTimeN: number }>();
    for (const r of rows) {
      const b = r.distance_bucket;
      if (!byBucket.has(b)) byBucket.set(b, { bucket: b, targets: 0, hits: 0, avgTimeSum: 0, avgTimeN: 0 });
      const acc = byBucket.get(b)!;
      acc.targets += r.targets ?? 0;
      acc.hits += Math.round((r.targets ?? 0) * (r.first_shot_hit_rate ?? 0));
      if (typeof r.avg_time_to_first_shot_sec === "number") {
        acc.avgTimeSum += r.avg_time_to_first_shot_sec;
        acc.avgTimeN += 1;
      }
    }

    const buckets = Array.from(byBucket.values())
      .sort((a, b) => a.bucket - b.bucket)
      .map((x) => {
        const ratePct = x.targets > 0 ? Math.round((x.hits / x.targets) * 100) : 0;
        const avgTime = x.avgTimeN > 0 ? Math.round((x.avgTimeSum / x.avgTimeN) * 10) / 10 : null;
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
      <div className={theme === "dark" ? "bg-zinc-900/50 backdrop-blur-sm p-3" : "bg-white shadow-sm p-3"}>
        <div className="animate-pulse space-y-2">
          <div className={`h-3 rounded w-1/3 ${theme === "dark" ? "bg-zinc-800" : "bg-gray-200"}`}></div>
          <div className="grid grid-cols-4 gap-1">
            {[...Array(20)].map((_, i) => (
              <div key={i} className={`h-8 rounded ${theme === "dark" ? "bg-zinc-800" : "bg-gray-200"}`}></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!firstShotMatrix || !matrixData?.buckets || matrixData?.buckets?.length === 0) {
    return (
      <div className={theme === "dark" ? "bg-zinc-900/50 backdrop-blur-sm p-3 text-center" : "bg-white shadow-sm p-3 text-center"}>
        <p className={`text-xs ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>No first shot data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Distance Bucket Performance */}
      <div className={`rounded-xl p-4 border shadow-sm h-full ${theme === "dark" ? "bg-zinc-900/40 border-zinc-700" : "bg-white border-gray-200"}`}>
        <div className="mb-6">
          <h4 className={`text-sm font-semibold ${theme === "dark" ? "text-zinc-200" : "text-gray-800"}`}>First-Shot Hit Rate by Distance</h4>
          <p className={`text-xs mt-0.5 ${theme === "dark" ? "text-zinc-400" : "text-gray-500"}`}>Bars = Hit rate (%), line = Targets (volume)</p>
        </div>

        <ResponsiveContainer width="100%" height={200}>
          <ComposedChart data={matrixData.buckets} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme === "dark" ? "#3f3f46" : "#e5e7eb"} opacity={0.6} />
            <XAxis
              dataKey="bucket"
              tick={{ fontSize: 10, fill: theme === "dark" ? "#a1a1aa" : "#525252" }}
              axisLine={{ stroke: theme === "dark" ? "#3f3f46" : "#e5e7eb", strokeWidth: 1 }}
              tickLine={false}
            />
            <YAxis
              yAxisId="left"
              tick={{ fontSize: 10, fill: theme === "dark" ? "#a1a1aa" : "#525252" }}
              domain={[0, 100]}
              axisLine={{ stroke: theme === "dark" ? "#3f3f46" : "#e5e7eb", strokeWidth: 1 }}
              tickLine={false}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 10, fill: theme === "dark" ? "#a1a1aa" : "#525252" }}
              axisLine={{ stroke: theme === "dark" ? "#3f3f46" : "#e5e7eb", strokeWidth: 1 }}
              tickLine={false}
            />
            <Tooltip
              formatter={(v: any, n: string) => {
                if (n === "ratePct") return [`${v}%`, "Hit rate"];
                if (n === "targets") return [v, "Targets"];
                return [v, n];
              }}
              labelFormatter={(label) => `${label}`}
              contentStyle={{
                backgroundColor: theme === "dark" ? "#18181b" : "#ffffff",
                border: `1px solid ${theme === "dark" ? "#27272a" : "#e5e7eb"}`,
                borderRadius: 8,
                fontSize: 11,
              }}
            />
            <Legend verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: 12 }} />
            <Bar yAxisId="left" dataKey="ratePct" name="Hit rate" fill={theme === "dark" ? "#34d399" : "#10b981"} radius={[3, 3, 0, 0]} />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="targets"
              name="Targets"
              dot={false}
              stroke={theme === "dark" ? "#60a5fa" : "#2563eb"}
              strokeWidth={2}
            />
          </ComposedChart>
        </ResponsiveContainer>

        {/* Tiny chips row */}
        <div className="mt-3 grid grid-cols-3 gap-2">
          {matrixData.buckets.slice(0, 3).map((b) => (
            <div key={b.bucket} className={`${theme === "dark" ? "bg-zinc-800/30" : "bg-gray-50"} rounded-md p-2 text-center`}>
              <div className={`text-[10px] ${theme === "dark" ? "text-zinc-400" : "text-gray-500"}`}>{b.bucket}</div>
              <div className={`text-base font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{b.ratePct}%</div>
              <div className={`text-[10px] ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>{b.targets} targets</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
