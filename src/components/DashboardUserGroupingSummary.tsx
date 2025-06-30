import { useState, useEffect, useRef } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { performanceStore } from "@/store/performance";
import { useStore } from "zustand";
import NoDataDisplay from "./BaseNoData";
import BaseButton from "./BaseButton";

const UserGroupingSummary = () => {
  const { groupingSummary, getGroupingSummary, groupingSummaryLoading } = useStore(performanceStore);
  const [activeTab, setActiveTab] = useState("recent");
  const containerRef = useRef<HTMLDivElement>(null);
  const [chartHeight, setChartHeight] = useState(260);

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
      <div className="h-64 flex justify-center items-center text-white">
        <div className="text-center">
          <p className="text-sm text-gray-400">No grouping data available</p>
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
            <div className="bg-[#1A1A1A] p-3 rounded text-center">
              <div className="text-lg font-medium text-indigo-400">{groupingSummary.avg_dispersion}</div>
              <div className="text-xs text-gray-400">Average CM</div>
            </div>

            <div className="bg-[#1A1A1A] p-3 rounded text-center">
              <div className="text-lg font-medium text-green-400">{groupingSummary.best_dispersion}</div>
              <div className="text-xs text-gray-400">Best CM</div>
            </div>

            <div className="bg-[#1A1A1A] p-3 rounded text-center">
              <div className="text-lg font-medium text-amber-400">{groupingSummary.total_groups}</div>
              <div className="text-xs text-gray-400">Total</div>
            </div>
          </div>

          {/* Simple tabs */}
          <div className="flex mb-3 border-b border-white/5">
            <BaseButton
              className={`py-1 px-3 text-sm ${activeTab === "recent" ? "text-indigo-400 border-b border-indigo-400" : "text-gray-400"}`}
              onClick={() => setActiveTab("recent")}
            >
              Recent
              <div className="w-1 h-1 bg-indigo-400 rounded-full"></div>
            </BaseButton>
            <BaseButton
              className={`py-1 px-3 text-sm ${activeTab === "weapons" ? "text-indigo-400 border-b border-indigo-400" : "text-gray-400"}`}
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
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="formattedDate" />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#161616",
                      borderColor: "#444444",
                      border: "1px solid #444444",
                      boxShadow: "none",
                      borderRadius: "4px",
                    }}
                    itemStyle={{ color: "#CCCCCC" }}
                    labelStyle={{ color: "#AAAAAA" }}
                    cursor={{ stroke: "#444444", strokeWidth: 1 }}
                  />
                  <Line
                    type="natural"
                    dataKey="cm_dispersion"
                    stroke="#7F5AF0"
                    strokeWidth={2}
                    activeDot={{
                      stroke: "#444444",
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
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="weapon_type" tick={{ fill: "#a1a1aa", fontSize: 10 }} axisLine={{ stroke: "#3f3f46" }} />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#161616",
                      borderColor: "#444444",
                      border: "1px solid #444444",
                      boxShadow: "none",
                      borderRadius: "4px",
                    }}
                    itemStyle={{ color: "#CCCCCC" }}
                    labelStyle={{ color: "#AAAAAA" }}
                    cursor={{ fill: "#333333", opacity: 0.3 }}
                  />
                  <Bar dataKey="avg_dispersion" name="Avg CM" fill="#2CB67D" activeBar={{ stroke: "#444444", strokeWidth: 1 }} />
                  <Bar dataKey="count" name="Count" fill="#7F5AF0" activeBar={{ stroke: "#444444", strokeWidth: 1 }} />
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
