import { useState, useEffect, useRef } from "react";
import { LineChart, Line, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { performanceStore } from "@/store/performance";
import { useStore } from "zustand";
import { useTheme } from "@/contexts/ThemeContext";

const UserGroupingSummary = () => {
  const { groupingSummary, getGroupingSummary, groupingSummaryLoading } = useStore(performanceStore);
  const containerRef = useRef<HTMLDivElement>(null);
  const [chartHeight, setChartHeight] = useState(260);
  const { theme } = useTheme();

  useEffect(() => {
    getGroupingSummary();
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      const updateHeight = () => {
        const containerHeight = containerRef?.current?.offsetHeight;
        const statsHeight = 60;
        const newChartHeight = Math.max((containerHeight as number) - statsHeight - 100, 180);
        setChartHeight(newChartHeight);
      };

      updateHeight();
      window.addEventListener("resize", updateHeight);
      return () => window.removeEventListener("resize", updateHeight);
    }
  }, [containerRef.current]);

  if (groupingSummaryLoading) {
    return (
      <div className="h-64 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!groupingSummary) {
    return (
      <div className={`h-64 flex justify-center items-center transition-colors duration-200 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
        <div className="text-center">
          <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>No grouping data available</p>
        </div>
      </div>
    );
  }

  const recentData =
    groupingSummary.last_five_groups?.map((item, index) => {
      const date = new Date(item.created_at);
      const formattedDate = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

      return {
        label: `#${groupingSummary.last_five_groups.length - index}`, // #1 = latest
        cm_dispersion: item.cm_dispersion,
        formattedDate,
      };
    }) ?? [];

  return (
    <div ref={containerRef} className="flex flex-col h-full w-full">
      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        <div className={`p-3 rounded text-center ${theme === "dark" ? "bg-[#1A1A1A]" : "bg-gray-100"}`}>
          <div className="text-lg font-medium text-indigo-400">{groupingSummary.avg_dispersion ?? "-"}</div>
          <div className="text-xs text-gray-500">Average CM</div>
        </div>
        <div className={`p-3 rounded text-center ${theme === "dark" ? "bg-[#1A1A1A]" : "bg-gray-100"}`}>
          <div className="text-lg font-medium text-green-400">{groupingSummary.best_dispersion ?? "-"}</div>
          <div className="text-xs text-gray-500">Best CM</div>
        </div>
        <div className={`p-3 rounded text-center ${theme === "dark" ? "bg-[#1A1A1A]" : "bg-gray-100"}`}>
          <div className="text-lg font-medium text-amber-400">{groupingSummary.avg_time_to_group ?? "-"}</div>
          <div className="text-xs text-gray-500">Avg Time</div>
        </div>
        <div className={`p-3 rounded text-center ${theme === "dark" ? "bg-[#1A1A1A]" : "bg-gray-100"}`}>
          <div className="text-lg font-medium text-blue-400">{groupingSummary.total_groupings ?? 0}</div>
          <div className="text-xs text-gray-500">Total Groupings</div>
        </div>
      </div>

      {/* Chart Title */}
      <h3 className={`text-center text-sm font-semibold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
        Recent Dispersion Over Last 5 Groupings
      </h3>

      {/* Chart */}
      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height={chartHeight}>
          <LineChart data={recentData} margin={{ top: 0, right: 16, left: 8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme === "dark" ? "#333" : "#e5e7eb"} />
            <XAxis dataKey="label" stroke={theme === "dark" ? "#9ca3af" : "#4b5563"} />
            <Tooltip
              formatter={(value: number) => [`${value} cm`, "Dispersion"]}
              labelFormatter={(_, payload) => {
                const point = payload?.[0]?.payload;
                return point?.formattedDate ? `Date: ${point.formattedDate}` : "";
              }}
              contentStyle={{
                backgroundColor: theme === "dark" ? "#161616" : "#ffffff",
                borderColor: theme === "dark" ? "#444444" : "#d1d5db",
                border: `1px solid ${theme === "dark" ? "#444444" : "#d1d5db"}`,
                borderRadius: "6px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",

              }}
              itemStyle={{ color: theme === "dark" ? "#CCCCCC" : "#374151" }}
              labelStyle={{ color: theme === "dark" ? "#AAAAAA" : "#6b7280" }}
              cursor={{ stroke: theme === "dark" ? "#444444" : "#d1d5db", strokeWidth: 1 }}
            />
            <Line
              type="monotone"
              dataKey="cm_dispersion"
              stroke="#7F5AF0"
              strokeWidth={2}
              dot={{ r: 4, strokeWidth: 2, fill: "#7F5AF0" }}
              activeDot={{ r: 5, fill: "#7F5AF0" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default UserGroupingSummary;
