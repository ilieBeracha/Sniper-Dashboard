import { useEffect, useState } from "react";
import { useStore } from "zustand";
import { userStore } from "@/store/userStore";
import { performanceStore } from "@/store/performance";
import { Card } from "@heroui/react";
import { ResponsiveContainer, RadialBarChart, RadialBar } from "recharts";
import NoDataDisplay from "./base/BaseNoData";
import { useTheme } from "@/contexts/ThemeContext";
import UserRoleAccuracyTable from "./UserRoleAccuracyTable";
import { Target, Clock, TrendingUp, Users, Activity, Award } from "lucide-react";

const CommanderView = () => {
  const { theme } = useTheme();
  const { user } = useStore(userStore);
  const { squadMajorityPerformance, fetchSquadMajorityPerformance, commanderUserRoleBreakdown, fetchCommanderUserRoleBreakdown } =
    useStore(performanceStore);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!user?.team_id) return;
      await fetchSquadMajorityPerformance(user.team_id);
      await fetchCommanderUserRoleBreakdown(user.team_id);
      setLoading(false);
    };
    load();
  }, [user?.team_id]);

  const getColor = (pct: number) => {
    if (pct >= 75) return "#10b981"; // Green
    if (pct >= 50) return "#f59e0b"; // Amber
    return "#ef4444"; // Red
  };

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className={`rounded-2xl p-6 animate-pulse ${theme === "dark" ? "bg-zinc-800" : "bg-gray-100"}`}>
          <div className={`h-4 w-32 rounded mb-4 ${theme === "dark" ? "bg-zinc-700" : "bg-gray-200"}`} />
          <div className={`h-32 w-full rounded-lg mb-4 ${theme === "dark" ? "bg-zinc-700" : "bg-gray-200"}`} />
          <div className="space-y-2">
            <div className={`h-12 w-full rounded-lg ${theme === "dark" ? "bg-zinc-700" : "bg-gray-200"}`} />
            <div className={`h-12 w-full rounded-lg ${theme === "dark" ? "bg-zinc-700" : "bg-gray-200"}`} />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Commander Dashboard</h1>
        <p className={`mt-1 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Monitor squad performance and team metrics</p>
      </div>

      {/* Squad Metrics */}
      {loading ? (
        <LoadingSkeleton />
      ) : squadMajorityPerformance?.length === 0 ? (
        <NoDataDisplay />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {squadMajorityPerformance
            ?.filter((squad) => squad.squad_name)
            .map((squad, idx) => {
              if (!squad) return null;
              const percentage = squad.hit_percentage || 0;

              const hitColor = getColor(percentage);

              return (
                <Card
                  key={idx}
                  className={`group rounded-2xl p-6 transition-all duration-300 hover:shadow-xl border ${
                    theme === "dark"
                      ? "bg-zinc-900 hover:bg-zinc-800 border-zinc-800 hover:border-zinc-700"
                      : "bg-white hover:bg-gray-50 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {/* Squad Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${theme === "dark" ? "bg-zinc-800" : "bg-gray-100"}`}>
                        <Users className="w-5 h-5" style={{ color: hitColor }} />
                      </div>
                      <div>
                        <h3 className={`text-lg font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{squad.squad_name}</h3>
                        <p className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>{squad.total_sessions} sessions</p>
                      </div>
                    </div>
                    <Award className="w-5 h-5" style={{ color: percentage >= 75 ? hitColor : theme === "dark" ? "#4b5563" : "#d1d5db" }} />
                  </div>

                  {/* Accuracy Chart */}
                  <div className="flex flex-col items-center mb-6">
                    <div className="relative w-40 h-40">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart
                          cx="50%"
                          cy="50%"
                          innerRadius="60%"
                          outerRadius="90%"
                          data={[{ value: percentage, fill: hitColor }]}
                          startAngle={90}
                          endAngle={-270}
                        >
                          <RadialBar
                            dataKey="value"
                            cornerRadius={10}
                            fill={hitColor}
                            background={{ fill: theme === "dark" ? "#27272a" : "#f3f4f6" }}
                          />
                        </RadialBarChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={`text-3xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{percentage.toFixed(0)}%</span>
                        <span className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Accuracy</span>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-3 w-full">
                      {[
                        { icon: Target, label: "Total Shots", value: squad.total_shots.toLocaleString(), color: "blue" },
                        { icon: Activity, label: "Total Hits", value: squad.total_hits.toLocaleString(), color: "green" },
                        { icon: Clock, label: "Avg Time", value: `${squad.avg_time_to_first_shot?.toFixed(1)}s`, color: "purple" },
                        { icon: TrendingUp, label: "Elim Rate", value: `${squad.elimination_rate?.toFixed(0)}%`, color: "amber" },
                      ].map((item, i) => (
                        <div
                          key={i}
                          className={`p-3 rounded-xl transition-colors ${
                            theme === "dark" ? "bg-zinc-800 hover:bg-zinc-700" : "bg-gray-50 hover:bg-gray-100"
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <item.icon
                              className={`w-4 h-4 ${
                                item.color === "blue"
                                  ? "text-blue-500"
                                  : item.color === "green"
                                    ? "text-green-500"
                                    : item.color === "purple"
                                      ? "text-purple-500"
                                      : "text-amber-500"
                              }`}
                            />
                          </div>
                          <div className={`text-lg font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{item.value}</div>
                          <div className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>{item.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              );
            })}
        </div>
      )}

      {/* User Accuracy by Role */}
      <UserRoleAccuracyTable loading={loading} commanderUserRoleBreakdown={commanderUserRoleBreakdown} theme={theme} />
    </div>
  );
};

export default CommanderView;
