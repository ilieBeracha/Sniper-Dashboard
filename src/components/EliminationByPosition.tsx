import { useTheme } from "@/contexts/ThemeContext";
import { User, UserCheck, Activity, TrendingUp, Users } from "lucide-react";
import { motion } from "framer-motion";
import { useStore } from "zustand";
import { useStatsStore } from "@/store/statsStore";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, RadialBarChart, RadialBar } from "recharts";
import { EliminationByPositionResponse } from "@/types/stats";
import { PositionScore } from "@/types/user";

export default function EliminationByPosition() {
  const { theme } = useTheme();
  const { eliminationByPosition } = useStore(useStatsStore);

  const data: EliminationByPositionResponse[] = eliminationByPosition || [];

  const total = data.reduce((acc, d) => acc + d.targets, 0);
  const totalEliminated = data.reduce((acc, d) => acc + d.eliminated, 0);

  const lying = data.find((d) => d.bucket === PositionScore.Lying);
  const sitting = data.find((d) => d.bucket === PositionScore.Sitting);
  const crouching = data.find((d) => d.bucket === PositionScore.Crouching);
  const standing = data.find((d) => d.bucket === PositionScore.Standing);

  const pieData = [
    {
      name: "Lying",
      value: lying?.eliminated || 0,
      percentage: lying?.elimination_pct ? Math.round(lying.elimination_pct * 100) : 0,
    },
    {
      name: "Sitting",
      value: sitting?.eliminated || 0,
      percentage: sitting?.elimination_pct ? Math.round(sitting.elimination_pct * 100) : 0,
    },
    {
      name: "Standing",
      value: standing?.eliminated || 0,
      percentage: standing?.elimination_pct ? Math.round(standing.elimination_pct * 100) : 0,
    },
    {
      name: "Crouching",
      value: crouching?.eliminated || 0,
      percentage: crouching?.elimination_pct ? Math.round(crouching.elimination_pct * 100) : 0,
    },
  ].filter((d) => d.value > 0);

  const radialData = [
    {
      name: "Lying",
      value: lying?.eliminated || 0,
      percentage: lying?.elimination_pct ? Math.round(lying.elimination_pct * 100) : 0,
    },
    {
      name: "Sitting",
      value: sitting?.elimination_pct ? Math.round(sitting.elimination_pct * 100) : 0,
      fill: theme === "dark" ? "#10b981" : "#059669",
    },
    {
      name: "Standing",
      value: standing?.elimination_pct ? Math.round(standing.elimination_pct * 100) : 0,
      fill: theme === "dark" ? "#8b5cf6" : "#7c3aed",
    },
    {
      name: "Crouching",
      value: crouching?.elimination_pct ? Math.round(crouching.elimination_pct * 100) : 0,
      fill: theme === "dark" ? "#3b82f6" : "#2563eb",
    },
  ];

  const border = theme === "dark" ? "border-zinc-800" : "border-gray-200";
  const textMain = theme === "dark" ? "text-white" : "text-gray-900";
  const textSub = theme === "dark" ? "text-zinc-400" : "text-gray-600";

  const getPositionIcon = (position: string) => {
    switch (position) {
      case "Sitting":
        return User;
      case "Standing":
        return UserCheck;
      default:
        return Activity;
    }
  };

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div className={`rounded-xl p-4 ${theme === "dark" ? "bg-zinc-900" : "bg-white"} border ${border}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className={`text-sm font-semibold ${textMain}`}>Position Analysis</h4>
          <p className={`text-xs ${textSub} mt-0.5`}>Elimination performance by shooting position</p>
        </div>
        <Users className={`w-4 h-4 ${theme === "dark" ? "text-emerald-500" : "text-emerald-400"}`} />
      </div>

      {/* Overall Stats */}
      {total && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className={`grid grid-cols-3 gap-4 p-3 rounded-lg mb-4 ${theme === "dark" ? "bg-zinc-800/30" : "bg-gray-50"}`}
        >
          <div className="text-center">
            <div className={`text-2xl font-bold ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`}>{total.toLocaleString()}</div>
            <div className={`text-xs ${textSub}`}>Total Targets</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${theme === "dark" ? "text-emerald-400" : "text-emerald-600"}`}>{totalEliminated.toLocaleString()}</div>
            <div className={`text-xs ${textSub}`}>Eliminated</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${theme === "dark" ? "text-violet-400" : "text-violet-600"}`}>{Math.round((totalEliminated / total) * 100)}%</div>
            <div className={`text-xs ${textSub}`}>Success Rate</div>
          </div>
        </motion.div>
      )}

      {/* Charts Container */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Pie Chart */}
        <div>
          <h5 className={`text-xs font-medium ${textSub} mb-2`}>Distribution</h5>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={30} outerRadius={50} paddingAngle={2} dataKey="value">
                {pieData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      index === 0 ? (theme === "dark" ? "#f59e0b" : "#f97316") : 
                      index === 1 ? (theme === "dark" ? "#10b981" : "#059669") : 
                      index === 2 ? (theme === "dark" ? "#8b5cf6" : "#7c3aed") : 
                      (theme === "dark" ? "#3b82f6" : "#2563eb")
                    }
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === "dark" ? "#18181b" : "#ffffff",
                  border: `1px solid ${theme === "dark" ? "#27272a" : "#e5e7eb"}`,
                  borderRadius: 6,
                  fontSize: 11,
                }}
                formatter={(value: any) => [`${value} eliminated`, ""]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Radial Bar Chart */}
        <div>
          <h5 className={`text-xs font-medium ${textSub} mb-2`}>Success Rates</h5>
          <ResponsiveContainer width="100%" height={140}>
            <RadialBarChart cx="50%" cy="50%" innerRadius="30%" outerRadius="90%" data={radialData}>
              <RadialBar dataKey="value" cornerRadius={4} fill="#8884d8">
                {radialData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </RadialBar>
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === "dark" ? "#18181b" : "#ffffff",
                  border: `1px solid ${theme === "dark" ? "#27272a" : "#e5e7eb"}`,
                  borderRadius: 6,
                  fontSize: 11,
                }}
                formatter={(value: any) => [`${value}%`, "Success Rate"]}
              />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Position Cards */}
      <div className="space-y-3">
        {Object.values(PositionScore).map((position) => {
          const posData = data.find((d) => d.bucket === position);
          if (!posData) return null;

          const Icon = getPositionIcon(position);
          const successRate = Math.round((posData.elimination_pct || 0) * 100);
          const isHighPerforming = successRate > 70;

          return (
            <div
              key={position}
              className={`p-3 rounded-lg border ${theme === "dark" ? "bg-zinc-800/20 border-zinc-800" : "bg-gray-50 border-gray-200"}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${
                    position === PositionScore.Lying ? (theme === "dark" ? "text-orange-500" : "text-orange-500") :
                    position === PositionScore.Sitting ? (theme === "dark" ? "text-emerald-500" : "text-emerald-500") :
                    position === PositionScore.Standing ? (theme === "dark" ? "text-violet-500" : "text-violet-500") :
                    (theme === "dark" ? "text-blue-500" : "text-blue-500")
                  }`} />
                  <span className={`text-xs font-medium ${textMain}`}>{position} Position</span>
                </div>
                {isHighPerforming && (
                  <div className="flex items-center gap-1">
                    <TrendingUp className={`w-3 h-3 ${theme === "dark" ? "text-emerald-400" : "text-emerald-500"}`} />
                    <span className={`text-xs ${theme === "dark" ? "text-emerald-400" : "text-emerald-500"}`}>High Performance</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className={`text-lg font-semibold ${textMain}`}>{posData.targets.toLocaleString()}</div>
                  <div className={`text-xs ${textSub}`}>Targets</div>
                </div>
                <div>
                  <div className={`text-lg font-semibold ${textMain}`}>{posData.eliminated.toLocaleString()}</div>
                  <div className={`text-xs ${textSub}`}>Eliminated</div>
                </div>
                <div>
                  <div className={`text-lg font-semibold ${textMain}`}>{successRate}%</div>
                  <div className={`text-xs ${textSub}`}>Success</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-3">
                <div className={`h-1 rounded-full overflow-hidden ${theme === "dark" ? "bg-zinc-800" : "bg-gray-200"}`}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${successRate}%` }}
                    transition={{ duration: 0.6, delay: position === PositionScore.Sitting ? 0.2 : 0.3 }}
                    className={`h-full ${
                      position === PositionScore.Lying ? (theme === "dark" ? "bg-orange-500" : "bg-orange-400") :
                      position === PositionScore.Sitting ? (theme === "dark" ? "bg-emerald-500" : "bg-emerald-400") :
                      position === PositionScore.Standing ? (theme === "dark" ? "bg-violet-500" : "bg-violet-400") :
                      (theme === "dark" ? "bg-blue-500" : "bg-blue-400")
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
