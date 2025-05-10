import { Card } from "@heroui/react";
import BaseTabs from "./BaseTabs";
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
  const [selectedTab, setSelectedTab] = useState("");
  const rangeOptions = Array.from({ length: 9 }, (_, i) => ((i + 1) * 100).toString());

  useEffect(() => {
    if (squadStats.length !== 0) {
      setChartData(squadStats as any);
    } else {
      setChartData([]);
    }
  }, [squadStats]);

  const tabs = [
    { name: "Distance", current: selectedTab === "Distance", dropdown: rangeOptions },
    { name: "Position", current: Object.values(PositionScore).includes(selectedTab as PositionScore), dropdown: Object.values(PositionScore) },
  ];

  const handleSelectedTabs = async (tab: string) => {
    setSelectedTab(tab);

    let position: string | null = null;
    let distance: number | null = null;
    console.log(Object.values(PositionScore).includes(tab as PositionScore));
    if (Object.values(PositionScore).includes(tab as PositionScore)) {
      position = tab;
    } else if (!isNaN(Number(tab))) {
      distance = Number(tab);
    }

    await getSquadStats(user?.team_id as string, position as PositionScore | null, distance as number | null);
  };

  const resetFilters = async () => {
    setSelectedTab("");
    await getSquadStats(user?.team_id as string, null, null);
  };

  return (
    <BaseDashboardCard
      header={
        <div className="flex flex-row items-center justify-between gap-4">
          <BaseTabs
            selectedTab={selectedTab}
            handleSelectedTab={handleSelectedTabs}
            tabs={tabs}
            resetFilters={() => resetFilters()}
            header={<h2 className="font-semibold text-white flex items-center gap-2">Squad Stats</h2>}
          />
        </div>
      }
    >
      <Card className="bg-transparent justify-center rounded-xl w-full h-full flex flex-col items-center gap-4">
        {chartData.length === 0 ? (
          <NoDataDisplay />
        ) : (
          <>
            <ResponsiveContainer width="97%" maxHeight={380} height={340}>
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
          </>
        )}
      </Card>
    </BaseDashboardCard>
  );
}
