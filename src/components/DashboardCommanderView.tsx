import { useEffect, useState } from "react";
import { useStore } from "zustand";
import { userStore } from "@/store/userStore";
import { performanceStore } from "@/store/performance";
import { Card } from "@heroui/react";
import BaseDashboardCard from "./base/BaseDashboardCard";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import NoDataDisplay from "./base/BaseNoData";
import { useTheme } from "@/contexts/ThemeContext";

const CommanderView = () => {
  const { theme } = useTheme();
  const { user } = useStore(userStore);
  const {
    squadMajorityPerformance,
    fetchSquadMajorityPerformance
  } = useStore(performanceStore);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!user?.team_id) return;
      await fetchSquadMajorityPerformance(user.team_id);
      setLoading(false);
    };
    load();
  }, [user?.team_id]);

  const getColor = (pct: number) => {
    if (pct >= 75) return "#2CB67D";
    if (pct >= 50) return "#FF8906";
    return "#F25F4C";
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Squad Metrics */}
      <BaseDashboardCard
        header="Squad Metrics (Majority Sessions)"
        tooltipContent="Only includes sessions where the squad was the majority."
      >
        {loading || !squadMajorityPerformance ? (
          <div className="py-10 text-center text-sm text-gray-500">Loading performance...</div>
        ) : squadMajorityPerformance.length === 0 ? (
          <NoDataDisplay />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {squadMajorityPerformance.map((squad, idx) => {
              const percentage = squad.hit_percentage || 0;
              const gaugeData = [
                { name: "Hit", value: percentage },
                { name: "Miss", value: 100 - percentage },
              ];
              const hitColor = getColor(percentage);

              return (
                <Card
                  key={idx}
                  className={`rounded-xl p-4 transition-colors duration-200 ${theme === "dark" ? "bg-zinc-900 text-white" : "bg-white text-gray-900"}`}
                >
                  <h3 className="text-lg font-semibold mb-3 text-center">{squad.squad_name}</h3>
                  <div className="flex flex-col items-center">
                    <div className="relative w-32 h-20">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={gaugeData}
                            cx="50%"
                            cy="80%"
                            startAngle={180}
                            endAngle={0}
                            innerRadius="60%"
                            outerRadius="90%"
                            paddingAngle={0}
                            dataKey="value"
                            cornerRadius={6}
                          >
                            <Cell fill={hitColor} />
                            <Cell fill={theme === "dark" ? "#333" : "#e5e7eb"} />
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center mt-2">
                        <span className="text-xl font-bold">{percentage.toFixed(1)}%</span>
                        <span className="text-xs uppercase tracking-wider text-gray-500">Accuracy</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-2 mt-3 w-full text-xs">
                      {[
                        { label: "Shots", value: squad.total_shots },
                        { label: "Hits", value: squad.total_hits },
                        { label: "Sessions", value: squad.total_sessions },
                        { label: "Time to 1st Shot", value: `${squad.avg_time_to_first_shot?.toFixed(2)}s` },
                        { label: "Elimination Rate", value: `${squad.elimination_rate?.toFixed(1)}%` },
                      ].map((item, i) => (
                        <div key={i} className={`p-2 rounded-lg ${theme === "dark" ? "bg-[#1A1A1A]" : "bg-gray-100"}`}>
                          <div className="flex justify-between">
                            <span className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>{item.label}</span>
                            <span>{item.value}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </BaseDashboardCard>
    </div>
  );
};

export default CommanderView;
