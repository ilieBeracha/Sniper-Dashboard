import { Card } from "@heroui/react";
import BaseDropBox from "./BaseDropBox";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import BaseDashboardCard from "./BaseDashboardCard";
import { useEffect, useState } from "react";
import { performanceStore } from "@/store/performance";
import { userStore } from "@/store/userStore";
import { useStore } from "zustand";
import NoDataDisplay from "./BaseNoData";
import { isMobile } from "react-device-detect";
import { useTheme } from "@/contexts/ThemeContext";
const formatValue = (value: number, type: string | undefined) => {
  if (type === "number") {
    if (value >= 1000000) return (value / 1_000_000).toFixed(1) + "M";
    if (value >= 1000) return (value / 1000).toFixed(0) + "k";
    return value.toLocaleString();
  }
  if (type === "percentage") return `${value}%`;
  return value;
};

export default function DashboardSquadStats() {
  const { user } = useStore(userStore);
  const [chartData, setChartData] = useState<any[]>([]);
  const { getSquadStats, squadStats } = useStore(performanceStore);
  const [selectedFilter, setSelectedFilter] = useState<string>("");
  const [selectedDistance, setSelectedDistance] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();

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
    if (squadStats.length !== 0) {
      const roleMap: Record<string, Record<string, number>> = {};

      squadStats.forEach(({ first_name, last_name, role_or_weapon, hit_percentage }) => {
        const user = `${first_name} ${last_name}`;
        if (!roleMap[role_or_weapon]) roleMap[role_or_weapon] = {};
        roleMap[role_or_weapon][user] = hit_percentage;
      });

      const allUsers = Array.from(new Set(squadStats.map(({ first_name, last_name }) => `${first_name} ${last_name}`)));

      const data = Object.entries(roleMap).map(([role_or_weapon, userHits]) => {
        const entry: Record<string, any> = { role_or_weapon };

        // Ensure every user has a value (even if 0)
        allUsers.forEach((user) => {
          entry[user] = userHits[user] ?? 0;
        });

        return entry;
      });

      setChartData(data);
    } else {
      setChartData([]);
    }
    setIsLoading(false);
  }, [squadStats]);

  useEffect(() => {
    setIsLoading(true);
    getSquadStats(null, null);
  }, [user?.squad_id]);

  const handleFilterChange = async (filter: string) => {
    setSelectedFilter(filter);
    if (filter !== "distance") setSelectedDistance("");
    if (filter === "") {
      setIsLoading(true);
      await getSquadStats(null, null);
    }
  };

  const handleDistanceChange = async (distance: string) => {
    setSelectedDistance(distance);
    setIsLoading(true);
    await getSquadStats(null, distance);
  };

  const resetFilters = async () => {
    setSelectedFilter("");
    setSelectedDistance("");
    setIsLoading(true);
    await getSquadStats(null, null);
  };

  return (
    <BaseDashboardCard
      header={
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 w-full text-sm">
          <h2
            className={`font-semibold text-sm flex items-center gap-2 flex-shrink-0 transition-colors duration-200 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Role Impact on Squad Hit %
          </h2>
        </div>
      }
      tooltipContent="This data shows how the squad performed while this person was in the given role. It is NOT their individual hit percentage in that role."
      >
      <Card
        className={`bg-transparent justify-center rounded-xl w-full h-full flex flex-col items-center gap-4 text-sm transition-colors duration-200 ${
          theme === "dark" ? "text-white" : "text-gray-900"
        }`}
      >
        <div className="w-full h-full flex flex-col items-center justify-center gap-4">
          <div className={`w-full h-full text-sm transition-colors duration-200 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            <div className="flex flex-col lg:flex-row items-start text-sm lg:items-center justify-between gap-4 w-full px-2 mt-2">
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
                    className={`w-full sm:w-auto px-4 py-2 text-xs rounded-lg transition-colors whitespace-nowrap duration-200 ${
                      theme === "dark" ? "bg-zinc-800 hover:bg-zinc-700 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                    }`}
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-[300px] w-full">
                <div className="relative w-12 h-12 text-sm">
                  <div
                    className={`absolute top-0 left-0 w-full h-full border-4 rounded-full transition-colors duration-200 ${
                      theme === "dark" ? "border-zinc-700" : "border-gray-300"
                    }`}
                  />
                  <div
                    className={`absolute top-0 left-0 w-full h-full border-4 border-t-4 rounded-full animate-spin transition-colors duration-200 ${
                      theme === "dark" ? "border-t-zinc-400" : "border-t-gray-600"
                    }`}
                  />
                </div>
                <p className={`mt-4 text-sm transition-colors duration-200 ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>
                  Loading data...
                </p>
              </div>
            ) : chartData.length === 0 ? (
              <NoDataDisplay />
            ) : (
              // ...imports and all code above remain unchanged...

              <ResponsiveContainer width="100%" height={350} className="text-sm">
                <BarChart data={chartData} margin={{ top: 20, right: 20, left: 20, bottom: 30 }} barCategoryGap={isMobile ? 8 : 16}>
                  {/* Define gradients */}
                  <defs>
                    <linearGradient id="gradientPerformance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4ade80" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#4ade80" stopOpacity={0.2} />
                    </linearGradient>
                    <linearGradient id="gradientAccuracy" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.2} />
                    </linearGradient>
                    <linearGradient id="gradientElimination" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f87171" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#f87171" stopOpacity={0.2} />
                    </linearGradient>
                    <linearGradient id="gradientCoordination" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#a78bfa" stopOpacity={0.2} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" stroke="transparent" />
                  <XAxis dataKey="role_or_weapon" stroke={theme === "dark" ? "#9ca3af" : "#4b5563"} style={{ fontSize: "12px" }} />
                  <YAxis
                    stroke={theme === "dark" ? "#9ca3af" : "#4b5563"}
                    domain={[0, 100]}
                    label={{ value: "Hit %", angle: -90, position: "insideLeft" }}
                  />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    content={({ label, payload }) => (
                      <div
                        className={`p-2 rounded shadow ${theme === "dark" ? "bg-zinc-800 text-white" : "bg-white text-gray-900 border border-gray-200"}`}
                      >
                        <p className="text-xs font-semibold">{label}</p>
                        {payload?.map((p, i) => (
                          <p key={i} className="text-sm">
                            {p.name}: {formatValue(p.value as number, "percentage")}
                          </p>
                        ))}
                      </div>
                    )}
                  />
                  <Legend />

                  {/* Assign gradient fills cyclically */}
                  {[...new Set(squadStats.map((s) => `${s.first_name} ${s.last_name}`))].map((user, index) => {
                    const gradientIds = [
                      "url(#gradientPerformance)",
                      "url(#gradientAccuracy)",
                      "url(#gradientElimination)",
                      "url(#gradientCoordination)",
                    ];
                    return <Bar key={user} dataKey={user} name={user} fill={gradientIds[index % gradientIds.length]} />;
                  })}
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </Card>
    </BaseDashboardCard>
  );
}
