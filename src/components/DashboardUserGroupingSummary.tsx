import { useState, useEffect, useRef } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { performanceStore } from "@/store/performance";
import { useStore } from "zustand";
import NoDataDisplay from "./BaseNoData";
import BaseButton from "./BaseButton";
import { useTheme } from "@/contexts/ThemeContext";

const UserGroupingSummary = () => {
  const { groupingSummary, getGroupingSummary, groupingSummaryLoading } = useStore(performanceStore);
  const [activeTab, setActiveTab] = useState("recent");
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
        const statsAndTabsHeight = 60;
        const newChartHeight: number = Math.max((containerHeight as number) - statsAndTabsHeight - 100, 180);
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
          <p className={`text-sm transition-colors duration-200 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>No grouping data available</p>
        </div>
      </div>
    );
  }

  // Format data for charts
  const recentData = groupingSummary.last_five_groups
    ?.map((item) => {
      const date = new Date(item.created_at);
      const month = date.toLocaleString("default", { month: "short" });
      const day = date.getDate();

      return {
        ...item,
        formattedDate: `${month} ${day}`,
      };
    })
    .reverse();

  const weaponData = groupingSummary.weapon_breakdown;

  return (
    <div ref={containerRef} style={{ height: "100%" }} className="flex flex-col">
      {groupingSummary.last_five_groups?.length && groupingSummary.weapon_breakdown?.length ? (
        <>
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div className={`p-3 rounded text-center transition-colors duration-200 ${theme === "dark" ? "bg-[#1A1A1A]" : "bg-gray-100"}`}>
              <div className="text-lg font-medium text-indigo-400">{groupingSummary.avg_dispersion}</div>
              <div className={`text-xs transition-colors duration-200 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Average CM</div>
            </div>

            <div className={`p-3 rounded text-center transition-colors duration-200 ${theme === "dark" ? "bg-[#1A1A1A]" : "bg-gray-100"}`}>
              <div className="text-lg font-medium text-green-400">{groupingSummary.best_dispersion}</div>
              <div className={`text-xs transition-colors duration-200 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Best CM</div>
            </div>

            <div className={`p-3 rounded text-center transition-colors duration-200 ${theme === "dark" ? "bg-[#1A1A1A]" : "bg-gray-100"}`}>
              <div className="text-lg font-medium text-amber-400">{groupingSummary.total_groups}</div>
              <div className={`text-xs transition-colors duration-200 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Total</div>
            </div>
          </div>

          {/* Simple tabs */}
          <div className={`flex mb-3 border-b transition-colors duration-200 ${theme === "dark" ? "border-white/5" : "border-gray-200"}`}>
            <BaseButton
              className={`py-1 px-3 text-sm transition-colors duration-200 ${activeTab === "recent" ? "text-indigo-400 border-b border-indigo-400" : theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
              onClick={() => setActiveTab("recent")}
            >
              Recent
              <div className="w-1 h-1 bg-indigo-400 rounded-full"></div>
            </BaseButton>
            <BaseButton
              className={`py-1 px-3 text-sm transition-colors duration-200 ${activeTab === "weapons" ? "text-indigo-400 border-b border-indigo-400" : theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
              onClick={() => setActiveTab("weapons")}
            >
              Weapons
            </BaseButton>
          </div>

          {/* Chart area with auto height */}
          <div className="flex-1  rounded-md py-2 w-full h-full">
            {activeTab === "recent" && (
              <ResponsiveContainer width="100%" height={chartHeight}>
                <LineChart data={recentData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme === "dark" ? "#333" : "#e5e7eb"} />
                  <XAxis dataKey="formattedDate" stroke={theme === "dark" ? "#9ca3af" : "#4b5563"} />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme === "dark" ? "#161616" : "#ffffff",
                      borderColor: theme === "dark" ? "#444444" : "#d1d5db",
                      border: `1px solid ${theme === "dark" ? "#444444" : "#d1d5db"}`,
                      boxShadow: "none",
                      borderRadius: "4px",
                    }}
                    itemStyle={{ color: theme === "dark" ? "#CCCCCC" : "#374151" }}
                    labelStyle={{ color: theme === "dark" ? "#AAAAAA" : "#6b7280" }}
                    cursor={{ stroke: theme === "dark" ? "#444444" : "#d1d5db", strokeWidth: 1 }}
                  />
                  <Line
                    type="natural"
                    dataKey="cm_dispersion"
                    stroke="#7F5AF0"
                    strokeWidth={2}
                    activeDot={{
                      stroke: theme === "dark" ? "#444444" : "#d1d5db",
                      strokeWidth: 1,
                      r: 5,
                      fill: "#7F5AF0",
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}

            {activeTab === "weapons" && (
              <ResponsiveContainer width="100%" height={chartHeight}>
                <BarChart data={weaponData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme === "dark" ? "#333" : "#e5e7eb"} />
                  <XAxis 
                    dataKey="weapon_type" 
                    tick={{ fill: theme === "dark" ? "#a1a1aa" : "#6b7280", fontSize: 10 }} 
                    axisLine={{ stroke: theme === "dark" ? "#3f3f46" : "#d1d5db" }} 
                  />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme === "dark" ? "#161616" : "#ffffff",
                      borderColor: theme === "dark" ? "#444444" : "#d1d5db",
                      border: `1px solid ${theme === "dark" ? "#444444" : "#d1d5db"}`,
                      boxShadow: "none",
                      borderRadius: "4px",
                    }}
                    itemStyle={{ color: theme === "dark" ? "#CCCCCC" : "#374151" }}
                    labelStyle={{ color: theme === "dark" ? "#AAAAAA" : "#6b7280" }}
                    cursor={{ fill: theme === "dark" ? "#333333" : "#f3f4f6", opacity: 0.3 }}
                  />
                  <Bar 
                    dataKey="avg_dispersion" 
                    name="Avg CM" 
                    fill="#2CB67D" 
                    activeBar={{ stroke: theme === "dark" ? "#444444" : "#d1d5db", strokeWidth: 1 }} 
                  />
                  <Bar 
                    dataKey="count" 
                    name="Count" 
                    fill="#7F5AF0" 
                    activeBar={{ stroke: theme === "dark" ? "#444444" : "#d1d5db", strokeWidth: 1 }} 
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </>
      ) : (
        <NoDataDisplay />
      )}
      {/* Stats cards */}
    </div>
  );
};

export default UserGroupingSummary;
