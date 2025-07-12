import { useEffect, useState } from "react";
import { useStore } from "zustand";
import { squadStore } from "@/store/squadStore";
import { userStore } from "@/store/userStore";
import { performanceStore } from "@/store/performance";
import { Card } from "@heroui/react";
import BaseDashboardCard from "./base/BaseDashboardCard";
import { useTheme } from "@/contexts/ThemeContext";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import BaseDropBox from "./base/BaseDropBox";
import NoDataDisplay from "./base/BaseNoData";

const CommanderView = () => {
  const { theme } = useTheme();
  const { user } = useStore(userStore);
  const { squadsHits, squadsWithMembers, getSquadsHitsByTeamId, getSquadsWithUsersByTeamId } = useStore(squadStore);
  const { squadStats, getSquadStats } = useStore(performanceStore);

  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string>("");
  const [selectedDistance, setSelectedDistance] = useState<string>("");

  const rangeOptions = [
    { id: "short", label: "Short Range (0-300m)" },
    { id: "medium", label: "Medium Range (300-500m)" },
    { id: "long", label: "Long Range (500-900m)" },
  ];

  const filterOptions = [
    { id: "", label: "All" },
    { id: "distance", label: "Distance" },
  ];

  useEffect(() => {
    const load = async () => {
      if (!user?.team_id) return;
      await getSquadsHitsByTeamId(user.team_id);
      await getSquadsWithUsersByTeamId(user.team_id);
      await getSquadStats(null, null);
      setLoading(false);
    };
    load();
  }, [user?.team_id]);

  const handleFilterChange = async (filter: string) => {
    setSelectedFilter(filter);
    if (filter !== "distance") setSelectedDistance("");
    if (filter === "") {
      setLoading(true);
      await getSquadStats(null, null);
      setLoading(false);
    }
  };

  const handleDistanceChange = async (distance: string) => {
    setSelectedDistance(distance);
    setLoading(true);
    await getSquadStats(null, distance);
    setLoading(false);
  };

  const resetFilters = async () => {
    setSelectedFilter("");
    setSelectedDistance("");
    setLoading(true);
    await getSquadStats(null, null);
    setLoading(false);
  };

  const getColor = (pct: number) => {
    if (pct >= 75) return "#2CB67D";
    if (pct >= 50) return "#FF8906";
    return "#F25F4C";
  };

  const SquadChart = ({ squad }: { squad: any }) => {
    const percentage = squad.avg_hit_percentage || 0;
    const gaugeData = [
      { name: "Hit", value: percentage },
      { name: "Miss", value: 100 - percentage },
    ];
    const hitColor = getColor(percentage);

    return (
      <Card className={`rounded-xl p-4 transition-colors duration-200 ${theme === "dark" ? "bg-zinc-900 text-white" : "bg-white text-gray-900"}`}>
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
              <span className={`text-xl font-bold transition-colors duration-200 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                {percentage.toFixed(1)}%
              </span>
              <span className={`text-xs uppercase tracking-wider transition-colors duration-200 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                Accuracy
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-2 mt-3 w-full">
            <div className={`p-2 rounded-lg transition-colors duration-200 ${theme === "dark" ? "bg-[#1A1A1A]" : "bg-gray-100"}`}>
              <div className="flex justify-between">
                <span className={`text-xs transition-colors duration-200 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                  Total Shots
                </span>
                <span className={`text-xs px-1.5 py-0.5 rounded-md transition-colors duration-200 ${theme === "dark" ? "bg-gray-800 text-gray-300" : "bg-gray-200 text-gray-700"}`}>
                  {squad.total_shots || 0}
                </span>
              </div>
            </div>
            <div className={`p-2 rounded-lg transition-colors duration-200 ${theme === "dark" ? "bg-[#1A1A1A]" : "bg-gray-100"}`}>
              <div className="flex justify-between">
                <span className={`text-xs transition-colors duration-200 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                  Total Hits
                </span>
                <span className={`text-xs px-1.5 py-0.5 rounded-md transition-colors duration-200 ${theme === "dark" ? "bg-gray-800 text-gray-300" : "bg-gray-200 text-gray-700"}`}>
                  {squad.total_hits || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <BaseDashboardCard 
        header={
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 w-full text-sm">
            <h2 className={`font-semibold text-sm flex items-center gap-2 flex-shrink-0 transition-colors duration-200 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              Compared Squads Hit Percentage
            </h2>
            <div className="flex flex-col justify-between sm:flex-row flex-wrap items-start text-sm sm:items-center gap-2 sm:gap-4 w-full lg:w-auto">
              <div className="w-full sm:w-auto min-w-[120px] sm:min-w-[160px] text-sm">
                <BaseDropBox tabs={filterOptions} activeTab={selectedFilter} setActiveTab={handleFilterChange} />
              </div>
              {selectedFilter === "distance" && (
                <div className="w-full sm:w-auto min-w-[120px] sm:min-w-[240px] text-sm">
                  <BaseDropBox tabs={rangeOptions} activeTab={selectedDistance} setActiveTab={handleDistanceChange} />
                </div>
              )}
              {(selectedFilter || selectedDistance) && (
                <button
                  onClick={resetFilters}
                  className={`w-full sm:w-auto px-4 py-2 text-xs rounded-lg transition-colors whitespace-nowrap duration-200 ${theme === "dark" ? "bg-zinc-800 hover:bg-zinc-700 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-700"}`}
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>
        }
        tooltipContent="This shows average hit percentage for each squad with position and distance filtering options."
      >
        {loading ? (
          <div className="py-10 text-center text-sm text-gray-500">Loading squad data...</div>
        ) : !squadsHits || squadsHits.length === 0 ? (
          <NoDataDisplay />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            {squadsHits.map((squad, i) => (
              <SquadChart key={i} squad={squad} />
            ))}
          </div>
        )}
      </BaseDashboardCard>

      {/* Squad Hit Percentages & Best/Worst Roles */}
      <BaseDashboardCard
        header="Squad Hit Percentages & Best/Worst Roles"
        tooltipContent="Comparison of squad performance including their best and worst functional roles."
      >
        {loading || !squadStats || squadStats.length === 0 ? (
          <div className="py-10 text-center text-sm text-gray-500">
            {loading ? "Loading squad performance..." : "Not enough squad performance data available."}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 text-sm">
            {Object.entries(
              squadStats.reduce(
                (acc, item) => {
                  const squad = item.squad_name || "Unknown Squad";
                  if (!acc[squad]) acc[squad] = [];
                  acc[squad].push(item);
                  return acc;
                },
                {} as Record<string, typeof squadStats>,
              ),
            ).map(([squadName, stats], idx) => {
              const sorted = [...stats].sort((a, b) => b.hit_percentage - a.hit_percentage);
              const best = sorted[0];
              const worst = sorted[sorted.length - 1];

              return (
                <div key={idx} className={`rounded-xl p-4 border ${theme === "dark" ? "border-zinc-800 bg-zinc-900" : "border-gray-200 bg-white"}`}>
                  <h4 className="font-semibold text-md mb-2">{squadName}</h4>
                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Avg Hit % (by role):</p>
                      <ul className="text-sm mt-1">
                        {stats.map((s, i) => (
                          <li key={i} className="text-sm text-purple-600">
                            {s.role_or_weapon}: {s.hit_percentage?.toFixed(1)}%
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-col gap-2">
                      <div>
                        <p className="text-xs text-green-600 font-semibold">Best Form:</p>
                        <span className="text-sm">
                          {best.role_or_weapon} – {best.hit_percentage.toFixed(1)}%
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-red-500 font-semibold">Worst Form:</p>
                        <span className="text-sm">
                          {worst.role_or_weapon} – {worst.hit_percentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </BaseDashboardCard>

      {/* Squads & Members */}
      <BaseDashboardCard header="Squads & Members" tooltipContent="List of all squads and their users.">
        {loading ? (
          <div className="py-10 text-center text-sm text-gray-500">Loading squad members...</div>
        ) : !squadsWithMembers || squadsWithMembers.length === 0 ? (
          <div className="py-10 text-center text-sm text-gray-400">No squads found.</div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {squadsWithMembers.map((squad, i) => (
              <div key={i} className={`rounded-xl p-4 border ${theme === "dark" ? "border-zinc-800 bg-zinc-900" : "border-gray-200 bg-white"}`}>
                <h4 className="font-semibold text-lg mb-2">{squad.squad_name}</h4>
                <ul className="text-sm text-gray-500 flex flex-wrap gap-2">
                  {squad.users?.map((user: any) => (
                    <li key={user.id} className="bg-purple-100 text-purple-800 px-2 py-1 rounded-md">
                      {user.first_name} {user.last_name} – {user.user_role}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </BaseDashboardCard>
    </div>
  );
};

export default CommanderView;
