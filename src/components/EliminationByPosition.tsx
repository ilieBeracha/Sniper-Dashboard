import { useTheme } from "@/contexts/ThemeContext";
import { User, UserCheck, Activity, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { useStore } from "zustand";
import { useStatsStore } from "@/store/statsStore";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, RadialBarChart, RadialBar } from "recharts";
import { EliminationByPositionResponse } from "@/types/stats";
// If PositionScore enum includes stale values (e.g., Crouching), don't rely on it here.

type BucketName = "Lying" | "Sitting" | "Standing" | "Operational" | "Total";

const BUCKETS: BucketName[] = ["Lying", "Sitting", "Standing", "Operational", "Total"];
const VISIBLE_BUCKETS: BucketName[] = ["Lying", "Sitting", "Standing", "Operational"];

export default function EliminationByPosition() {
  const { theme } = useTheme();
  const { eliminationByPosition } = useStore(useStatsStore);

  // Normalize: aggregate by bucket in case server returns multiple users
  const raw: EliminationByPositionResponse[] = eliminationByPosition || [];
  const byBucket = raw.reduce<Record<string, { targets: number; eliminated: number; pct: number }>>((acc, row) => {
    const bucket = (row.bucket || "").trim();
    if (!BUCKETS.includes(bucket as BucketName)) return acc;
    const cur = acc[bucket] || { targets: 0, eliminated: 0, pct: 0 };
    cur.targets += row.targets || 0;
    cur.eliminated += row.eliminated || 0;
    acc[bucket] = cur;
    return acc;
  }, {});

  // Compute percentages AFTER aggregation
  VISIBLE_BUCKETS.forEach((b) => {
    const v = byBucket[b];
    if (v) v.pct = v.targets > 0 ? v.eliminated / v.targets : 0;
  });

  const totalTargets = byBucket["Total"]?.targets || 0;
  const totalEliminated = byBucket["Total"]?.eliminated || 0;
  const totalPct = totalTargets > 0 ? totalEliminated / totalTargets : 0;

  // Early exit
  if (raw.length === 0 || totalTargets === 0) return null;

  // Colors (compact, professional)
  const COLORS = {
    lying: theme === "dark" ? "#f59e0b" : "#f97316",
    sitting: theme === "dark" ? "#10b981" : "#059669",
    standing: theme === "dark" ? "#8b5cf6" : "#7c3aed",
    operational: theme === "dark" ? "#3b82f6" : "#2563eb",
  } as const;

  const textMain = theme === "dark" ? "text-white" : "text-gray-900";
  const textSub = theme === "dark" ? "text-zinc-500" : "text-gray-500";

  const getPositionIcon = (position: BucketName) => {
    switch (position) {
      case "Sitting":
        return User;
      case "Standing":
        return UserCheck;
      default:
        return Activity; // Lying / Operational → generic
    }
  };

  // Early exit with placeholder
  if (!raw.length || totalTargets === 0) {
    return (
      <div
        className={`p-4 rounded-lg text-center border ${
          theme === "dark" ? "bg-zinc-800/30 border-zinc-700 text-zinc-400" : "bg-gray-50 border-gray-200 text-gray-500"
        }`}
      >
        <p className="text-sm font-medium">No elimination data available</p>
        <p className="text-xs mt-1">Adjust filters or run a new session</p>
      </div>
    );
  }

  // Chart data
  const pieData = VISIBLE_BUCKETS.map((b) => ({
    name: b,
    value: byBucket[b]?.eliminated || 0,
    percentage: Math.round((byBucket[b]?.pct || 0) * 100),
    fill: b === "Lying" ? COLORS.lying : b === "Sitting" ? COLORS.sitting : b === "Standing" ? COLORS.standing : COLORS.operational,
  })).filter((d) => d.value > 0);

  const radialData = VISIBLE_BUCKETS.map((b) => ({
    name: b,
    value: Math.round((byBucket[b]?.pct || 0) * 100),
    fill: b === "Lying" ? COLORS.lying : b === "Sitting" ? COLORS.sitting : b === "Standing" ? COLORS.standing : COLORS.operational,
  }));

  return (
    <div className="p-2">
      {/* Header KPIs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
        className={`grid grid-cols-2 gap-2 p-2 rounded-lg mb-3 ${theme === "dark" ? "bg-zinc-800/30" : "bg-gray-50"}`}
      >
        <div className="text-center">
          <div className={`text-base font-semibold ${theme === "dark" ? "text-emerald-400" : "text-emerald-600"}`}>
            {totalEliminated.toLocaleString()}
          </div>
          <div className={`text-[10px] ${textSub}`}>Eliminated</div>
        </div>
        <div className="text-center">
          <div className={`text-base font-semibold ${theme === "dark" ? "text-violet-400" : "text-violet-600"}`}>{Math.round(totalPct * 100)}%</div>
          <div className={`text-[10px] ${textSub}`}>Success Rate</div>
        </div>
      </motion.div>

      {/* Charts Container */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        {/* Pie Chart — distribution of eliminated by position */}
        <div>
          <h5 className={`text-[10px] font-medium ${textSub} mb-1`}>Distribution</h5>
          <ResponsiveContainer width="100%" height={120}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={25} outerRadius={45} paddingAngle={2} dataKey="value">
                {pieData.map((item, idx) => (
                  <Cell key={`cell-${idx}`} fill={item.fill} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Radial Bar — success rates by position */}
        <div>
          <h5 className={`text-[10px] font-medium ${textSub} mb-1`}>Success Rates</h5>
          <ResponsiveContainer width="100%" height={120}>
            <RadialBarChart cx="50%" cy="50%" innerRadius="30%" outerRadius="90%" data={radialData}>
              <RadialBar dataKey="value" cornerRadius={4}>
                {radialData.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={entry.fill} />
                ))}
              </RadialBar>
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === "dark" ? "#18181b" : "#ffffff",
                  border: `1px solid ${theme === "dark" ? "#27272a" : "#e5e7eb"}`,
                  borderRadius: 4,
                  fontSize: 10,
                  padding: "2px 6px",
                }}
                formatter={(value: any, entry: any) => [`${value}%`, entry?.payload?.name || ""]}
              />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Position Cards */}
      <div className="space-y-2">
        {VISIBLE_BUCKETS.map((position) => {
          const v = byBucket[position];
          if (!v) return null;

          const Icon = getPositionIcon(position);
          const successRate = Math.round((v.pct || 0) * 100);
          const isHigh = successRate > 70;

          return (
            <div
              key={position}
              className={`p-2 rounded-lg border ${theme === "dark" ? "bg-zinc-800/20 border-zinc-800" : "bg-gray-50 border-gray-200"}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <Icon
                    className={`w-3 h-3 ${
                      position === "Lying"
                        ? "text-orange-500"
                        : position === "Sitting"
                          ? "text-emerald-500"
                          : position === "Standing"
                            ? "text-violet-500"
                            : "text-blue-500"
                    }`}
                  />
                  <span className={`text-[10px] font-medium ${textMain}`}>{position} Position</span>
                </div>
                {isHigh && (
                  <div className="flex items-center gap-0.5">
                    <TrendingUp className={`w-2.5 h-2.5 ${theme === "dark" ? "text-emerald-400" : "text-emerald-500"}`} />
                    <span className={`text-[9px] ${theme === "dark" ? "text-emerald-400" : "text-emerald-500"}`}>High</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <div className={`text-sm font-semibold ${textMain}`}>{v.targets.toLocaleString()}</div>
                  <div className={`text-[9px] ${textSub}`}>Targets</div>
                </div>
                <div>
                  <div className={`text-sm font-semibold ${textMain}`}>{v.eliminated.toLocaleString()}</div>
                  <div className={`text-[9px] ${textSub}`}>Eliminated</div>
                </div>
                <div>
                  <div className={`text-sm font-semibold ${textMain}`}>{successRate}%</div>
                  <div className={`text-[9px] ${textSub}`}>Success</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-1.5">
                <div className={`h-0.5 rounded-full overflow-hidden ${theme === "dark" ? "bg-zinc-800" : "bg-gray-200"}`}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${successRate}%` }}
                    transition={{ duration: 0.5 }}
                    className={`h-full ${
                      position === "Lying"
                        ? "bg-orange-500"
                        : position === "Sitting"
                          ? "bg-emerald-500"
                          : position === "Standing"
                            ? "bg-violet-500"
                            : "bg-blue-500"
                    }`}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
