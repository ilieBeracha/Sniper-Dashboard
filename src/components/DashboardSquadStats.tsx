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
    // Initial load
    setIsLoading(true);
    getSquadStats(user?.team_id as string, null, null);
  }, [user?.team_id]);

  const handleFilterChange = async (filter: string) => {
    setSelectedFilter(filter as "distance" | "position" | "");

    // Only reset the other filter, not the one being selected
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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px] w-full">
        <div className="relative w-12 h-12">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-zinc-700 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-t-zinc-400 rounded-full animate-spin"></div>
        </div>
        <p className="mt-4 text-zinc-400 text-sm">Loading data...</p>
      </div>
    );
  }

  return (
    <BaseDashboardCard
      header={
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 w-full">
          <h2 className="font-semibold text-white flex items-center gap-2 flex-shrink-0">Squad Stats</h2>
        </div>
      }
    >
      <Card className="bg-transparent justify-center rounded-xl w-full h-full flex flex-col items-center gap-4">
        <div className="w-full h-full">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 w-full px-2 mt-2">
            <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-2 sm:gap-4 w-full lg:w-auto">
              <div className="w-full sm:w-auto min-w-[120px] sm:min-w-[160px]">
                <BaseDropBox tabs={filterOptions} activeTab={selectedFilter} setActiveTab={handleFilterChange} />
              </div>

              {selectedFilter === "distance" && (
                <div className="w-full sm:w-auto min-w-[200px] sm:min-w-[240px]">
                  <BaseDropBox tabs={rangeOptions} activeTab={selectedDistance} setActiveTab={handleDistanceChange} />
                </div>
              )}

              {selectedFilter === "position" && (
                <div className="w-full sm:w-auto min-w-[120px] sm:min-w-[160px]">
                  <BaseDropBox tabs={positionOptions} activeTab={selectedPosition} setActiveTab={handlePositionChange} />
                </div>
              )}

              {(selectedFilter || selectedDistance || selectedPosition) && (
                <button
                  onClick={resetFilters}
                  className="w-full sm:w-auto px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm rounded-lg transition-colors whitespace-nowrap"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>
          {chartData.length === 0 ? (
            <NoDataDisplay />
          ) : (
            <ResponsiveContainer width="100%" maxHeight={300} height={300}>
              <BarChart data={chartData} barCategoryGap={16} barGap={8} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
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
                <XAxis dataKey="name" stroke="#9ca3af" style={{ fontSize: "12px", paddingBottom: "10px" }} />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  content={({ label, payload }) => (
                    <div className="bg-zinc-800 text-white p-2 rounded shadow hover:bg-zinc-700">
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
      </Card>
    </BaseDashboardCard>
  );
}
