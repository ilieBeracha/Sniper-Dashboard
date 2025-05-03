import { performanceStore } from "@/store/performance";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

import { useStore } from "zustand";

export default function DashboardSquadComparison() {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-3 shadow-lg">
          <p className="text-white font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
              {entry.dataKey !== "reaction" ? "%" : "s"}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  const { bestSquadConfigurations } = useStore(performanceStore);
  // Prepare data for squad performance chart
  const getSquadChartData = () => {
    return bestSquadConfigurations.map((config) => ({
      name: config.squad_name,
      performance: config.overall_performance_score,
      accuracy: config.avg_squad_accuracy,
      elimination: config.avg_squad_elimination_rate,
      coordination: config.coordination_score,
    }));
  };
  return (
    <div className="col-span-12 xl:col-span-7">
      <div className="bg-zinc-900/30 rounded-xl p-6 border border-zinc-800/50">
        <h4 className="text-lg font-semibold text-white mb-4">Squad Performance Comparison</h4>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={getSquadChartData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="name" tick={{ fill: "#71717a", fontSize: 12 }} axisLine={{ stroke: "#3f3f46" }} />
              <YAxis tick={{ fill: "#71717a", fontSize: 12 }} axisLine={{ stroke: "#3f3f46" }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="performance" name="Overall Performance" fill="#4ade80" radius={[4, 4, 0, 0]} />
              <Bar dataKey="accuracy" name="Accuracy" fill="#60a5fa" radius={[4, 4, 0, 0]} />
              <Bar dataKey="elimination" name="Elimination" fill="#f87171" radius={[4, 4, 0, 0]} />
              <Bar dataKey="coordination" name="Coordination" fill="#a78bfa" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
