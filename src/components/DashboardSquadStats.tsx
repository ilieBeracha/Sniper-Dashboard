import { Card } from "@heroui/react";
import BaseDropBox from "./BaseDropBox";
import { ResponsiveContainer, BarChart, Bar, XAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { SquadStats } from "@/types/performance";
import BaseDashboardCard from "./BaseDashboardCard";
import { useEffect, useState } from "react";
import { PositionScore } from "@/types/score";
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
  const [chartData, setChartData] = useState<SquadStats[]>([]);
  const { getSquadStats, squadStats } = useStore(performanceStore);
  const [selectedFilter, setSelectedFilter] = useState<"distance" | "position" | "">("");
  const [selectedDistance, setSelectedDistance] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();

  const rangeOptions = [
    { id: "short", label: "Short Range (0-300m)" },
    { id: "medium", label: "Medium Range (300-500m)" },
    { id: "long", label: "Long Range (500-900m)" },
  ];

  const positionOptions = Object.values(PositionScore).map((position) => ({
    id: position,
    label: position,
  }));

  const filterOptions = [
    { id: "", label: "All" },
    { id: "distance", label: "Distance" },
    { id: "position", label: "Position" },
  ];

  useEffect(() => {
    if (squadStats.length !== 0) {
      setChartData(squadStats as any);
    } else {
      setChartData([]);
    }
    setIsLoading(false);
  }, [squadStats]);

  useEffect(() => {
    setIsLoading(true);
    getSquadStats(user?.team_id as string, null, null);
  }, [user?.team_id]);

  const handleFilterChange = async (filter: string) => {
    setSelectedFilter(filter as "distance" | "position" | "");

    if (filter !== "distance") {
      setSelectedDistance("");
    }
    if (filter !== "position") {
      setSelectedPosition("");
    }

    if (filter === "") {
      setIsLoading(true);
      await getSquadStats(user?.team_id as string, null, null);
    }
  };
  const handleDistanceChange = async (distance: string) => {
    setSelectedDistance(distance);
    setIsLoading(true);
    getSquadStats(user?.team_id as string, null, distance);
  };

  const handlePositionChange = async (position: string) => {
    setSelectedPosition(position);
    setIsLoading(true);
    await getSquadStats(user?.team_id as string, position as PositionScore | null, null);
  };

  const resetFilters = async () => {
    setSelectedFilter("");
    setSelectedDistance("");
    setSelectedPosition("");
    setIsLoading(true);
    await getSquadStats(user?.team_id as string, null, null);
  };

  return (
    <BaseDashboardCard
      header={
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 w-full text-sm">
          <h2 className={`font-semibold text-sm flex items-center gap-2 flex-shrink-0 transition-colors duration-200 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Squad Stats</h2>
        </div>
      }
    >
      <Card className={`bg-transparent justify-center rounded-xl w-full h-full flex flex-col items-center gap-4 text-sm transition-colors duration-200 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
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

                {selectedFilter === "position" && (
                  <div className="w-full sm:w-auto min-w-[120px] sm:min-w-[120px] text-sm">
                    <BaseDropBox tabs={positionOptions} activeTab={selectedPosition} setActiveTab={handlePositionChange} />
                  </div>
                )}

                {(selectedFilter || selectedDistance || selectedPosition) && (
                  <button
                    onClick={resetFilters}
                    className={`w-full sm:w-auto px-4 py-2 text-xs rounded-lg transition-colors whitespace-nowrap duration-200 ${theme === "dark" ? "bg-zinc-800 hover:bg-zinc-700 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-700"}`}
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            </div>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-[300px] w-full">
                <div className="relative w-12 h-12 text-sm">
                  <div className={`absolute top-0 left-0 w-full h-full border-4 rounded-full transition-colors duration-200 ${theme === "dark" ? "border-zinc-700" : "border-gray-300"}`}></div>
                  <div className={`absolute top-0 left-0 w-full h-full border-4 border-t-4 rounded-full animate-spin transition-colors duration-200 ${theme === "dark" ? "border-t-zinc-400" : "border-t-gray-600"}`}></div>
                </div>
                <p className={`mt-4 text-sm transition-colors duration-200 ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>Loading data...</p>
              </div>
            ) : chartData.length === 0 ? (
              <NoDataDisplay />
            ) : (
              <ResponsiveContainer width="100%" maxHeight={300} height={300} className="text-sm">
                <BarChart data={chartData} barCategoryGap={16} barGap={isMobile ? 2 : 6} margin={{ top: 20, right: 0, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="transparent" />
                  <XAxis dataKey="name" stroke={theme === "dark" ? "#9ca3af" : "#4b5563"} style={{ fontSize: "12px", paddingBottom: "10px" }} />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    content={({ label, payload }) => (
                      <div className={`p-2 rounded shadow transition-colors duration-200 ${theme === "dark" ? "bg-zinc-800 text-white hover:bg-zinc-700" : "bg-white text-gray-900 hover:bg-gray-50 border border-gray-200"}`}>
                        <p className="text-xs font-semibold">{label}</p>
                        {payload?.map((p, i) => (
                          <p key={i} className="text-sm">
                            {p.name}: {formatValue(p.value as number, "number")}
                          </p>
                        ))}
                      </div>
                    )}
                  />
                  <Legend iconType="circle" />
                  <Bar dataKey="performance" name="Performance" fill="url(#gradientPerformance)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="accuracy" name="Accuracy" fill="url(#gradientAccuracy)" radius={[4, 4, 0, 0]} />
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
                  <XAxis dataKey="name" stroke={theme === "dark" ? "#9ca3af" : "#4b5563"} style={{ fontSize: "12px", paddingBottom: "10px" }} />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    content={({ label, payload }) => (
                      <div className={`p-2 rounded shadow transition-colors duration-200 ${theme === "dark" ? "bg-zinc-800 text-white hover:bg-zinc-700" : "bg-white text-gray-900 hover:bg-gray-50 border border-gray-200"}`}>
                        <p className="text-xs font-semibold">{label}</p>
                        {payload?.map((p, i) => (
                          <p key={i} className="text-sm">
                            {p.name}: {formatValue(p.value as number, "number")}
                          </p>
                        ))}
                      </div>
                    )}
                  />
                  <Legend iconType="circle" />
                  <Bar dataKey="performance" name="Performance" fill="url(#gradientPerformance)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="accuracy" name="Accuracy" fill="url(#gradientAccuracy)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="elimination" name="Elimination" fill="url(#gradientElimination)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="coordination" name="Coordination" fill="url(#gradientCoordination)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </Card>
    </BaseDashboardCard>
  );
}
