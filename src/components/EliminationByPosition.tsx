import { useTheme } from "@/contexts/ThemeContext";
import { User, UserCheck, Activity, TrendingUp } from "lucide-react";
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

  const textMain = theme === "dark" ? "text-white" : "text-gray-900";
  const textSub = theme === "dark" ? "text-zinc-500" : "text-gray-500";

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
    <div className="p-2">
      {total && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className={`grid grid-cols-3 gap-2 p-2 rounded-lg mb-3 ${theme === "dark" ? "bg-zinc-800/30" : "bg-gray-50"}`}
        >
          <div className="text-center">
            <div className={`text-base font-semibold ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`}>{total.toLocaleString()}</div>
            <div className={`text-[10px] ${textSub}`}>Total Targets</div>
          </div>
          <div className="text-center">
            <div className={`text-base font-semibold ${theme === "dark" ? "text-emerald-400" : "text-emerald-600"}`}>
              {totalEliminated.toLocaleString()}
            </div>
            <div className={`text-[10px] ${textSub}`}>Eliminated</div>
          </div>
          <div className="text-center">
            <div className={`text-base font-semibold ${theme === "dark" ? "text-violet-400" : "text-violet-600"}`}>
              {Math.round((totalEliminated / total) * 100)}%
            </div>
            <div className={`text-[10px] ${textSub}`}>Success Rate</div>
          </div>
        </motion.div>
      )}

      {/* Charts Container */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        {/* Pie Chart */}
        <div>
          <h5 className={`text-[10px] font-medium ${textSub} mb-1`}>Distribution</h5>
          <ResponsiveContainer width="100%" height={120}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={25} outerRadius={45} paddingAngle={2} dataKey="value">
                {pieData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      index === 0
                        ? theme === "dark"
                          ? "#f59e0b"
                          : "#f97316"
                        : index === 1
                          ? theme === "dark"
                            ? "#10b981"
                            : "#059669"
                          : index === 2
                            ? theme === "dark"
                              ? "#8b5cf6"
                              : "#7c3aed"
                            : theme === "dark"
                              ? "#3b82f6"
                              : "#2563eb"
                    }
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === "dark" ? "#18181b" : "#ffffff",
                  border: `1px solid ${theme === "dark" ? "#27272a" : "#e5e7eb"}`,
                  borderRadius: 4,
                  fontSize: 10,
                  padding: "2px 6px",
                }}
                formatter={(value: any) => [`${value} eliminated`, ""]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Radial Bar Chart */}
        <div>
          <h5 className={`text-[10px] font-medium ${textSub} mb-1`}>Success Rates</h5>
          <ResponsiveContainer width="100%" height={120}>
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
                  borderRadius: 4,
                  fontSize: 10,
                  padding: "2px 6px",
                }}
                formatter={(value: any) => [`${value}%`, "Success Rate"]}
              />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Position Cards */}
      <div className="space-y-2">
        {Object.values(PositionScore).map((position) => {
          const posData = data.find((d) => d.bucket === position);
          if (!posData) return null;

          const Icon = getPositionIcon(position);
          const successRate = Math.round((posData.elimination_pct || 0) * 100);
          const isHighPerforming = successRate > 70;

          return (
            <div
              key={position}
              className={`p-2 rounded-lg border ${theme === "dark" ? "bg-zinc-800/20 border-zinc-800" : "bg-gray-50 border-gray-200"}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <Icon
                    className={`w-3 h-3 ${
                      position === PositionScore.Lying
                        ? "text-orange-500"
                        : position === PositionScore.Sitting
                          ? "text-emerald-500"
                          : position === PositionScore.Standing
                            ? "text-violet-500"
                            : "text-blue-500"
                    }`}
                  />
                  <span className={`text-[10px] font-medium ${textMain}`}>{position} Position</span>
                </div>
                {isHighPerforming && (
                  <div className="flex items-center gap-0.5">
                    <TrendingUp className={`w-2.5 h-2.5 ${theme === "dark" ? "text-emerald-400" : "text-emerald-500"}`} />
                    <span className={`text-[9px] ${theme === "dark" ? "text-emerald-400" : "text-emerald-500"}`}>High</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <div className={`text-sm font-semibold ${textMain}`}>{posData.targets.toLocaleString()}</div>
                  <div className={`text-[9px] ${textSub}`}>Targets</div>
                </div>
                <div>
                  <div className={`text-sm font-semibold ${textMain}`}>{posData.eliminated.toLocaleString()}</div>
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
                    transition={{ duration: 0.6, delay: position === PositionScore.Sitting ? 0.2 : 0.3 }}
                    className={`h-full ${
                      position === PositionScore.Lying
                        ? "bg-orange-500"
                        : position === PositionScore.Sitting
                          ? "bg-emerald-500"
                          : position === PositionScore.Standing
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
