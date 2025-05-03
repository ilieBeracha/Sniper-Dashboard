import { DayNightPerformance } from "@/types/performance";
import { Sun, Moon, Target, Zap, Timer, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

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
      color: "#60a5fa",
    },
  ];

  return (
    <>
      <div className="flex gap-1 mb-4  p-1 bg-zinc-900/50 rounded-lg">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === id ? "bg-zinc-700 text-white" : "text-zinc-400 hover:text-white"
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="h-full max-h-[300px] pt-2 max-w-[600px] mx-auto">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <XAxis dataKey="name" tick={{ fill: "#a1a1aa", fontSize: 12, spreadMethod: "align" }} axisLine={{ stroke: "#3f3f46" }} />
            <YAxis
              tick={{ fill: "#a1a1aa", fontSize: 12 }}
              axisLine={{ stroke: "#3f3f46" }}
              tickFormatter={(value) => `${value}${activeTab === "reaction" ? "s" : "%"}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#18181818",
                border: "1px solid #3f3f46",
                borderRadius: "0.5rem",
                padding: "0.5rem",
                color: "#fff",
              }}
              formatter={(value: number) => [`${value}${activeTab === "reaction" ? " sec" : "%"}`, activeMetric?.label]}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="flex justify-between border-t pt-2 border-zinc-700/50">
        <div className="flex items-center gap-2">
          <Sun size={22} className="text-amber-400" />
          <span className="text-sm text-zinc-400">{dayData?.total_missions || 0} missions</span>
        </div>
        <div className="flex items-center gap-2">
          <Moon size={22} className="text-blue-400" />
          <span className="text-sm text-zinc-400">{nightData?.total_missions || 0} missions</span>
        </div>
      </div>
    </>
  );
}
