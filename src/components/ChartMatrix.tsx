import { useMemo } from "react";
import { useStore } from "zustand";
import { performanceStore } from "@/store/performance";
import { useTheme } from "@/contexts/ThemeContext";
import { Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart } from "recharts";
import { Target, TrendingUp, Activity, Crosshair } from "lucide-react";
import { motion } from "framer-motion";

export default function ChartMatrix() {
  const { firstShotMatrix, isLoading } = useStore(performanceStore);
  const { theme } = useTheme();

  const matrixData = useMemo(() => {
    if (!firstShotMatrix || isLoading) return null;

    type Row = {
      distance_bucket: number;
      targets: number;
      first_shot_hit_rate: number;
      avg_time_to_first_shot_sec: number | null;
    };
    const rows = firstShotMatrix as Row[];
    
    console.log("First Shot Matrix raw data:", rows);

    const byBucket = new Map<number, { bucket: number; targets: number; hits: number; avgTimeSum: number; avgTimeN: number }>();
    for (const r of rows) {
      const b = r.distance_bucket;
      if (!byBucket.has(b)) byBucket.set(b, { bucket: b, targets: 0, hits: 0, avgTimeSum: 0, avgTimeN: 0 });
      const acc = byBucket.get(b)!;
      const targets = r.targets ?? 0;
      const hitRate = r.first_shot_hit_rate ?? 0;
      
      const validHitRate = Math.max(0, Math.min(1, hitRate));
      
      acc.targets += targets;
      acc.hits += Math.round(targets * validHitRate);
      
      if (typeof r.avg_time_to_first_shot_sec === "number") {
        acc.avgTimeSum += r.avg_time_to_first_shot_sec;
        acc.avgTimeN += 1;
      }
    }
    
    console.log("Aggregated data by bucket:", Array.from(byBucket.entries()));

    const buckets = Array.from(byBucket.values())
      .sort((a, b) => a.bucket - b.bucket)
      .map((x) => {
        const ratePct = x.targets > 0 ? Math.round((x.hits / x.targets) * 100) : 0;
        const avgTime = x.avgTimeN > 0 ? Math.round((x.avgTimeSum / x.avgTimeN) * 10) / 10 : null;
        
        console.log(`Bucket ${x.bucket}m: targets=${x.targets}, hits=${x.hits}, rate=${ratePct}%`);
        
        return {
          bucket: `${x.bucket}m`,
          distance: x.bucket,
          ratePct,
          targets: x.targets,
          avgTime,
          efficiency: ratePct * (x.targets / 100), // Efficiency score
        };
      });

    return { buckets };
  }, [firstShotMatrix, isLoading]);

  if (isLoading) {
    return (
      <div className={`rounded-xl p-3 ${theme === "dark" ? "bg-zinc-900/50" : "bg-white"} 
        border ${theme === "dark" ? "border-zinc-700/50" : "border-gray-200"}`}>
        <div className="animate-pulse space-y-3">
          <div className={`h-4 rounded w-1/3 ${theme === "dark" ? "bg-zinc-800" : "bg-gray-200"}`}></div>
          <div className={`h-40 rounded ${theme === "dark" ? "bg-zinc-800" : "bg-gray-200"}`}></div>
        </div>
      </div>
    );
  }

  if (!firstShotMatrix || !matrixData?.buckets || matrixData?.buckets?.length === 0) {
    return (
      <div className={`rounded-xl p-3 text-center ${theme === "dark" ? "bg-zinc-900/50" : "bg-white"} 
        border ${theme === "dark" ? "border-zinc-700/50" : "border-gray-200"}`}>
        <p className={`text-xs ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>No first shot data available</p>
      </div>
    );
  }

  const totalTargets = matrixData.buckets.reduce((sum, b) => sum + b.targets, 0);
  const weightedHitRate = matrixData.buckets.reduce((sum, b) => sum + (b.ratePct * b.targets), 0) / totalTargets;
  const bestDistance = matrixData.buckets.reduce((best, b) => b.ratePct > best.ratePct ? b : best);
  const mostEngaged = matrixData.buckets.reduce((most, b) => b.targets > most.targets ? b : most);

  return (
    <div className={`rounded-xl p-3 ${theme === "dark" ? "bg-zinc-900/50" : "bg-white"} 
      border ${theme === "dark" ? "border-zinc-700/50" : "border-gray-200"}`}>
      
      {/* Header */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <h4 className={`text-sm font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            📈 Accuracy Analytics
          </h4>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className={`w-3 h-0.5 rounded ${theme === "dark" ? "bg-zinc-500" : "bg-gray-500"}`} />
              <span className={`text-[10px] ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>
                Hit Rate
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className={`w-3 h-0.5 rounded ${theme === "dark" ? "bg-zinc-600" : "bg-gray-600"}`} />
              <span className={`text-[10px] ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>
                Volume
              </span>
            </div>
          </div>
        </div>
        <p className={`text-xs ${theme === "dark" ? "text-zinc-400" : "text-gray-500"}`}>
          By distance
        </p>
      </div>

      {/* Key Insights */}
      <div className="grid grid-cols-4 gap-2 mb-3">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-2.5 rounded-lg text-center ${
            theme === "dark" ? "bg-zinc-800/30" : "bg-gray-100"
          }`}
        >
          <Crosshair className={`w-4 h-4 mx-auto mb-1 ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`} />
          <div className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            {Math.round(weightedHitRate)}%
          </div>
          <div className={`text-[10px] ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>
            Overall Accuracy
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`p-2.5 rounded-lg text-center ${
            theme === "dark" ? "bg-zinc-800/30" : "bg-gray-100"
          }`}
        >
          <Target className={`w-4 h-4 mx-auto mb-1 ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`} />
          <div className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            {bestDistance.bucket}
          </div>
          <div className={`text-[10px] ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>
            Best Range
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`p-2.5 rounded-lg text-center ${
            theme === "dark" ? "bg-zinc-800/30" : "bg-gray-100"
          }`}
        >
          <Activity className={`w-4 h-4 mx-auto mb-1 ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`} />
          <div className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            {totalTargets}
          </div>
          <div className={`text-[10px] ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>
            Total Targets
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`p-2.5 rounded-lg text-center ${
            theme === "dark" ? "bg-zinc-800/30" : "bg-gray-100"
          }`}
        >
          <TrendingUp className={`w-4 h-4 mx-auto mb-1 ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`} />
          <div className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            {mostEngaged.bucket}
          </div>
          <div className={`text-[10px] ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>
            Most Active Range
          </div>
        </motion.div>
      </div>

      {/* Analytics Chart */}
      <div className={`rounded-lg p-2 mb-3 ${theme === "dark" ? "bg-zinc-800/30" : "bg-gray-50"}`}>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={matrixData.buckets} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={theme === "dark" ? "#71717a" : "#6b7280"} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={theme === "dark" ? "#71717a" : "#6b7280"} stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorTargets" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={theme === "dark" ? "#52525b" : "#4b5563"} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={theme === "dark" ? "#52525b" : "#4b5563"} stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={theme === "dark" ? "#3f3f46" : "#e5e7eb"} opacity={0.3} />
            <XAxis 
              dataKey="bucket" 
              tick={{ fontSize: 10, fill: theme === "dark" ? "#a1a1aa" : "#525252" }}
              axisLine={{ stroke: theme === "dark" ? "#3f3f46" : "#e5e7eb" }}
            />
            <YAxis 
              yAxisId="left"
              tick={{ fontSize: 10, fill: theme === "dark" ? "#a1a1aa" : "#525252" }}
              axisLine={{ stroke: theme === "dark" ? "#3f3f46" : "#e5e7eb" }}
              domain={[0, 100]}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 10, fill: theme === "dark" ? "#a1a1aa" : "#525252" }}
              axisLine={{ stroke: theme === "dark" ? "#3f3f46" : "#e5e7eb" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: theme === "dark" ? "#18181b" : "#ffffff",
                border: `1px solid ${theme === "dark" ? "#27272a" : "#e5e7eb"}`,
                borderRadius: 8,
                fontSize: 11,
                padding: "8px 12px",
              }}
              formatter={(value: any, name: string) => {
                if (name === "ratePct") return [`${value}%`, "Hit Rate"];
                if (name === "targets") return [value, "Targets"];
                return [value, name];
              }}
            />
            <Area 
              yAxisId="left"
              type="monotone" 
              dataKey="ratePct" 
              stroke={theme === "dark" ? "#71717a" : "#6b7280"}
              fillOpacity={1} 
              fill="url(#colorAccuracy)"
              strokeWidth={2}
            />
            <Area 
              yAxisId="right"
              type="monotone" 
              dataKey="targets" 
              stroke={theme === "dark" ? "#52525b" : "#4b5563"}
              fillOpacity={1} 
              fill="url(#colorTargets)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Heat Map Grid */}
      <div>
        <h5 className={`text-xs font-medium mb-2 ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>
          Performance Heat Map:
        </h5>
        <div className="grid grid-cols-4 gap-1.5">
          {matrixData.buckets.map((b, index) => {
            const bgColor = b.ratePct >= 75 
              ? theme === "dark" ? "bg-zinc-700/50" : "bg-gray-200"
              : b.ratePct >= 50 
                ? theme === "dark" ? "bg-zinc-800/50" : "bg-gray-100"
                : theme === "dark" ? "bg-zinc-800/30" : "bg-gray-50";
            
            return (
              <motion.div 
                key={b.bucket}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className={`relative p-3 rounded-lg ${bgColor} 
                  border ${theme === "dark" ? "border-zinc-700/30" : "border-gray-200"} 
                  hover:scale-105 transition-transform cursor-default`}
              >
                <div className={`text-xs font-medium ${theme === "dark" ? "text-zinc-300" : "text-gray-700"}`}>
                  {b.bucket}
                </div>
                <div className={`text-lg font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  {b.ratePct}%
                </div>
                <div className={`text-[10px] ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>
                  {b.targets} targets
                </div>
                {/* Efficiency indicator */}
                <div className="absolute top-1 right-1">
                  <div className={`w-1.5 h-1.5 rounded-full ${
                    b.efficiency > 50 ? theme === "dark" ? "bg-zinc-400" : "bg-gray-600" : 
                    b.efficiency > 25 ? theme === "dark" ? "bg-zinc-500" : "bg-gray-500" : 
                    theme === "dark" ? "bg-zinc-600" : "bg-gray-400"
                  }`} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
