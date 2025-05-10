import { DayNightPerformance } from "@/types/performance";
import { Sun, Moon, Target, Zap, Timer, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import NoDataDisplay from "./BaseNoData";
import BaseDropBox from "./BaseDropBox";

export default function DashboardDayNightPerformance({ dayNightPerformance }: { dayNightPerformance: DayNightPerformance[] }) {
  const [activeTab, setActiveTab] = useState("accuracy");

  const dayData = dayNightPerformance.find((item) => item.day_night === "day");
  const nightData = dayNightPerformance.find((item) => item.day_night === "night");

  const tabs = [
    { id: "accuracy", label: "Accuracy", icon: Target, key: "accuracy" },
    { id: "first_shot", label: "First Shot", icon: Zap, key: "first_shot_success_rate" },
    { id: "reaction", label: "Reaction", icon: Timer, key: "avg_reaction_time" },
    { id: "elimination", label: "Elimination", icon: CheckCircle2, key: "elimination_rate" },
  ];

  const activeMetric = tabs.find((tab) => tab.id === activeTab);

  const chartData = [
    {
      name: "Day",
      value: parseFloat((dayData?.[activeMetric?.key as keyof DayNightPerformance] as string) || "0"),
      color: "#fbbf24",
    },
    {
      name: "Night",
      value: parseFloat((nightData?.[activeMetric?.key as keyof DayNightPerformance] as string) || "0"),
      color: "#3b82f6",
    },
  ];

  const isEmpty = chartData.every((d) => d.value === 0);

  return isEmpty ? (
    <NoDataDisplay />
  ) : (
    <>
      {/* Tabs */}
      <BaseDropBox tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Pie Chart */}
      <div className="h-[300px] w-full max-w-xs mx-auto px-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              contentStyle={{
                backgroundColor: "#181818",
                border: "1px solid #3f3f46",
                borderRadius: "0.5rem",
                padding: "0.5rem",
                color: "#fff",
              }}
              formatter={(value: number) => [`${value}${activeTab === "reaction" ? " sec" : "%"}`, activeMetric?.label]}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Mission Summary */}
      <div className="flex justify-between border-t pt-2 border-zinc-700/50">
        <div className="flex items-center gap-2">
          <Sun size={20} className="text-amber-400" />
          <span className="text-sm text-zinc-400">{dayData?.total_missions || 0} missions</span>
        </div>
        <div className="flex items-center gap-2">
          <Moon size={20} className="text-blue-400" />
          <span className="text-sm text-zinc-400">{nightData?.total_missions || 0} missions</span>
        </div>
      </div>
    </>
  );
}
