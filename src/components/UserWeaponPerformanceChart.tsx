import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";
import { useTheme } from "@/contexts/ThemeContext";
import { useStore } from "zustand";
import { useStatsStore } from "@/store/statsStore";
import { motion } from "framer-motion";
import { Crosshair, Award, Sparkles } from "lucide-react";
import { useMemo } from "react";

export default function UserWeaponPerformanceChart() {
  const { userWeaponPerformance, userWeaponPerformanceLoading } = useStore(useStatsStore);
  const { theme } = useTheme();

  // Normalize & format rows for chart - truncate long weapon names
  const rows = useMemo(() => {
    return (userWeaponPerformance || []).map((r) => ({
      ...r,
      weaponLabel: (r.weapon_name ?? "Unknown").length > 8 
        ? (r.weapon_name ?? "Unknown").substring(0, 8) + "..."
        : (r.weapon_name ?? "Unknown"),
      fullName: r.weapon_name ?? "Unknown Weapon",
      hitPct100: Math.round((r.hit_pct ?? 0) * 100),
      elimPct100: Math.round((r.elimination_pct ?? 0) * 100),
    }));
  }, [userWeaponPerformance]);

  const isEmpty = rows.length === 0;

  const gridStroke = theme === "dark" ? "#27272a" : "#e5e7eb";
  const axisColor = theme === "dark" ? "#a1a1aa" : "#4b5563";

  const colorBar = theme === "dark" ? "#3b82f6" : "#2563eb"; // Shots
  const colorLine1 = theme === "dark" ? "#10b981" : "#059669"; // Hit %
  const colorLine2 = theme === "dark" ? "#8b5cf6" : "#7c3aed"; // Elim %

  // Get best weapon based on combined score
  const bestWeapon = useMemo(() => {
    if (rows.length === 0) return null;
    return rows.reduce((best, current) => {
      const currentScore = (current.hitPct100 + current.elimPct100) / 2;
      const bestScore = (best.hitPct100 + best.elimPct100) / 2;
      return currentScore > bestScore ? current : best;
    });
  }, [rows]);

  if (userWeaponPerformanceLoading) {
    return (
      <div className="p-6">
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className={`h-20 rounded-xl animate-pulse ${theme === "dark" ? "bg-zinc-800/50" : "bg-gray-100/50"}`} />
          ))}
        </div>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="p-6">
        <div className="flex flex-col items-center justify-center h-48">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
            className={`p-3 rounded-full mb-3 ${
              theme === "dark" ? "bg-gradient-to-br from-violet-500/20 to-purple-500/20" : "bg-gradient-to-br from-violet-200/50 to-purple-200/50"
            }`}
          >
            <Crosshair className="w-10 h-10 text-violet-500" />
          </motion.div>
          <p className={`text-sm font-medium ${theme === "dark" ? "text-zinc-300" : "text-gray-700"}`}>No Weapon Data Available</p>
          <p className={`text-xs mt-1 ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>
            Complete sessions with different weapons to see performance
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${theme === "dark" ? "bg-zinc-900/50" : "bg-white"}`}>
      {/* Chart Section */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-violet-500" />
            <h4 className={`text-sm font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Weapon Performance Analysis</h4>
          </div>
          {bestWeapon && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs ${
                theme === "dark"
                  ? "bg-gradient-to-r from-violet-500/20 to-purple-500/20 text-violet-300 border border-violet-500/30"
                  : "bg-gradient-to-r from-violet-100 to-purple-100 text-violet-700 border border-violet-200"
              }`}
            >
              <Award className="w-3 h-3" />
              <span className="font-medium">Best: {bestWeapon.weaponLabel}</span>
            </motion.div>
          )}
        </div>

        <div style={{ width: "100%", height: 260 }}>
          <ResponsiveContainer>
            <ComposedChart data={rows} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
              <CartesianGrid stroke={gridStroke} strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="weaponLabel" tick={{ fill: axisColor, fontSize: 11 }} interval={0} height={38} tickMargin={8} />
              <YAxis yAxisId="left" tick={{ fill: axisColor, fontSize: 11 }} width={36} tickFormatter={(v) => `${v}`} />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fill: axisColor, fontSize: 11 }}
                width={36}
                domain={[0, 100]}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === "dark" ? "rgba(24, 24, 27, 0.95)" : "rgba(255, 255, 255, 0.95)",
                  border: `1px solid ${theme === "dark" ? "rgba(63, 63, 70, 0.5)" : "rgba(229, 231, 235, 0.5)"}`,
                  borderRadius: 12,
                  fontSize: 12,
                  padding: "10px 12px",
                  backdropFilter: "blur(8px)",
                }}
                formatter={(value: number, name: string) => {
                  if (name === "Hit %") return [`${value}%`, name];
                  if (name === "Elim %") return [`${value}%`, name];
                  return [value.toLocaleString(), name];
                }}
                labelFormatter={(label: string) => label}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} iconType="circle" />

              {/* Bars: Shots (left axis) */}
              <Bar yAxisId="left" dataKey="shots" name="Shots" barSize={24} radius={[8, 8, 0, 0]} fill={colorBar} opacity={0.8} />

              {/* Lines: Hit% & Elim% (right axis) */}
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="hitPct100"
                name="Hit %"
                stroke={colorLine1}
                strokeWidth={2.5}
                dot={{ r: 3, fill: colorLine1 }}
                activeDot={{ r: 5 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="elimPct100"
                name="Elim %"
                stroke={colorLine2}
                strokeWidth={2.5}
                dot={{ r: 3, fill: colorLine2 }}
                activeDot={{ r: 5 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Mini Compact Table */}
      <div className="px-2 pb-2">
        <div className={`rounded ${theme === "dark" ? "bg-zinc-800/20" : "bg-gray-50/30"}`}>
          {/* Tiny Header */}
          <div className={`px-2 py-1 border-b ${theme === "dark" ? "border-zinc-700/30" : "border-gray-200/30"}`}>
            <span className={`text-[10px] ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>Top Weapons</span>
          </div>

          {/* Top 3 weapons inline */}
          <div className="p-1.5 space-y-1">
            {rows.slice(0, 3).map((weapon, index) => {
              const score = (weapon.hitPct100 + weapon.elimPct100) / 2;
              return (
                <div
                  key={weapon.weapon_id}
                  className={`flex items-center justify-between px-1.5 py-0.5 text-[10px] ${
                    theme === "dark" ? "hover:bg-zinc-700/20" : "hover:bg-gray-100/20"
                  }`}
                >
                  {/* Rank & Name */}
                  <div className="flex items-center gap-1 flex-1">
                    <span className={`font-bold ${index === 0 ? "text-amber-400" : index === 1 ? "text-gray-400" : "text-orange-400"}`}>
                      {index + 1}
                    </span>
                    <span className={`truncate ${theme === "dark" ? "text-zinc-300" : "text-gray-700"}`}>{weapon.weapon_name}</span>
                  </div>

                  {/* Inline Stats */}
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className={weapon.hitPct100 >= 70 ? "text-emerald-500" : weapon.hitPct100 >= 50 ? "text-amber-500" : "text-red-500"}>
                      {weapon.hitPct100}%
                    </span>
                    <span className={weapon.elimPct100 >= 70 ? "text-emerald-500" : weapon.elimPct100 >= 50 ? "text-amber-500" : "text-red-500"}>
                      {weapon.elimPct100}%
                    </span>
                    <span
                      className={`px-1 rounded ${
                        score >= 70
                          ? "bg-emerald-500/20 text-emerald-400"
                          : score >= 50
                            ? "bg-amber-500/20 text-amber-400"
                            : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {score.toFixed(0)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
