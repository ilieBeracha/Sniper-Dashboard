import { useTheme } from "@/contexts/ThemeContext";
import BaseDashboardCard from "./base/BaseDashboardCard";
import { ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import { primitives } from "@/styles/core";
import UserHitPercentage from "./DashboardUserHitPercentage";
import { WaveLoader } from "./ui/loader";
import { useStore } from "zustand";
import { performanceStore } from "@/store/performance";
import { useEffect, useState } from "react";
import { getEnumValues } from "@/services/supabaseEnums";

// Utility to format enum strings (e.g. "SEMI_AUTO" → "Semi Auto")
const formatEnumLabel = (value: string) =>
  value
    .replace(/_/g, " ") // snake_case → space
    .replace(/([a-z])([A-Z])/g, "$1 $2") // camelCase → space
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase()); // Capitalize first letters

export default function DashboardSquadProgress({ loading }: { loading: boolean }) {
  const { theme } = useTheme();
  const { groupingSummary, getGroupingSummary, groupingSummaryLoading } = useStore(performanceStore);

  const [weaponTypes, setWeaponTypes] = useState<string[]>([]);
  const [groupingTypes, setGroupingTypes] = useState<string[]>([]);
  const [positions, setPositions] = useState<string[]>([]);
  const [selectedWeaponType, setSelectedWeaponType] = useState<string | null>(null);
  const [selectedGroupType, setSelectedGroupType] = useState<string | null>(null);
  const [selectedEffort, setSelectedEffort] = useState<string | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);

  const barData = [
    { name: "Excellent", value: 85, percent: 85 },
    { name: "Good", value: 72, percent: 72 },
    { name: "Average", value: 56, percent: 56 },
    { name: "Improving", value: 34, percent: 34 },
  ];

  // Fetch enum options on mount
  useEffect(() => {
    (async () => {
      const weaponsEnums = await getEnumValues("weapon_names");
      const typesEnums = await getEnumValues("grouping_type_enum");
      const positionsEnums = await getEnumValues("positions");

      setWeaponTypes(weaponsEnums);
      setGroupingTypes(typesEnums);
      setPositions(positionsEnums); // ✅ New state
    })();
  }, []);

  // Fetch summary when filters change
  useEffect(() => {
    getGroupingSummary(selectedWeaponType, selectedEffort === null ? null : selectedEffort === "true", selectedGroupType, selectedPosition);
  }, [selectedWeaponType, selectedEffort, selectedGroupType, selectedPosition]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="rounded-lg p-3 shadow-lg border backdrop-blur-sm"
          style={{
            backgroundColor: theme === "dark" ? `${primitives.grey.grey900}F0` : `${primitives.white.white}F0`,
            borderColor: theme === "dark" ? primitives.grey.grey800 : primitives.grey.grey200,
          }}
        >
          <p className="text-sm font-medium" style={{ color: theme === "dark" ? primitives.white.white : primitives.grey.grey900 }}>
            {label || payload[0]?.name}
          </p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm mt-1" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
              {entry.unit || ""}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <WaveLoader />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {/* Performance Overview */}
      <div className="w-full">
        <BaseDashboardCard header="Performance Overview" tooltipContent="Current performance metrics">
          <UserHitPercentage />
        </BaseDashboardCard>
      </div>

      {/* Grouping + Bar charts */}
      <div className="grid grid-cols-1 gap-6 lg:col-span-1 xl:col-span-2">
        {/* Grouping Summary Chart */}
        <BaseDashboardCard header="Grouping Performance" tooltipContent="Shooting accuracy and grouping metrics">
          <div className="flex flex-wrap justify-center gap-4 mb-6 px-4">
            {/* Weapon Type Filter */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-center text-gray-600 dark:text-gray-300">Weapon</label>
              <select
                className="w-28 px-2.5 py-2 text-xs border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-200"
                value={selectedWeaponType ?? ""}
                onChange={(e) => setSelectedWeaponType(e.target.value || null)}
              >
                <option value="">All</option>
                {weaponTypes.map((type) => (
                  <option key={type} value={type}>
                    {formatEnumLabel(type)}
                  </option>
                ))}
              </select>
            </div>

            {/* Grouping Type Filter */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-center text-gray-600 dark:text-gray-300">Type</label>
              <select
                className="w-28 px-2.5 py-2 text-xs border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-200"
                value={selectedGroupType ?? ""}
                onChange={(e) => setSelectedGroupType(e.target.value || null)}
              >
                <option value="">All</option>
                {groupingTypes.map((type) => (
                  <option key={type} value={type}>
                    {formatEnumLabel(type)}
                  </option>
                ))}
              </select>
            </div>

            {/* Effort Filter */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-center text-gray-600 dark:text-gray-300">Effort</label>
              <select
                className="w-28 px-2.5 py-2 text-xs border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-200"
                value={selectedEffort ?? ""}
                onChange={(e) => setSelectedEffort(e.target.value || null)}
              >
                <option value="">All</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>

            {/* Position Filter */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-center text-gray-600 dark:text-gray-300">Position</label>
              <select
                className="w-28 px-2.5 py-2 text-xs border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-200"
                value={selectedPosition ?? ""}
                onChange={(e) => setSelectedPosition(e.target.value || null)}
              >
                <option value="">All</option>
                {positions.map((pos) => (
                  <option key={pos} value={pos}>
                    {formatEnumLabel(pos)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="h-[240px] p-4 w-full">
            {groupingSummaryLoading ? (
              <div className="flex justify-center items-center h-full">
                <WaveLoader />
              </div>
            ) : !groupingSummary ? (
              <div className="flex justify-center items-center h-full">
                <p className="text-sm" style={{ color: theme === "dark" ? primitives.grey.grey400 : primitives.grey.grey600 }}>
                  No grouping data available
                </p>
              </div>
            ) : (
              <>
                {/* Summary Grid */}
                <div className="grid grid-cols-4 gap-2 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-semibold" style={{ color: primitives.blue.blue400 }}>
                      {groupingSummary.avg_dispersion ?? "-"}
                    </div>
                    <div className="text-xs" style={{ color: theme === "dark" ? primitives.grey.grey400 : primitives.grey.grey600 }}>
                      Average CM
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold" style={{ color: primitives.green.green400 }}>
                      {groupingSummary.best_dispersion ?? "-"}
                    </div>
                    <div className="text-xs" style={{ color: theme === "dark" ? primitives.grey.grey400 : primitives.grey.grey600 }}>
                      Best CM
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold" style={{ color: primitives.purple.purple400 }}>
                      {groupingSummary.avg_time_to_group ?? "-"}
                    </div>
                    <div className="text-xs" style={{ color: theme === "dark" ? primitives.grey.grey400 : primitives.grey.grey600 }}>
                      Avg Time
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold" style={{ color: primitives.grey.grey500 }}>
                      {groupingSummary.total_groupings ?? 0}
                    </div>
                    <div className="text-xs" style={{ color: theme === "dark" ? primitives.grey.grey400 : primitives.grey.grey600 }}>
                      Total
                    </div>
                  </div>
                </div>

                {/* Chart */}
                <div className="flex-1">
                  <ResponsiveContainer width="100%" height={140}>
                    <LineChart
                      data={
                        groupingSummary.last_five_groups
                          ?.filter((item) => {
                            return (
                              (!selectedWeaponType || item.weapon_type === selectedWeaponType) &&
                              (!selectedGroupType || item.type === selectedGroupType) &&
                              (selectedEffort === null || String(item.effort) === selectedEffort)
                            );
                          })
                          .map((item, index) => ({
                            label: `#${groupingSummary.last_five_groups.length - index}`,
                            cm_dispersion: item.cm_dispersion,
                            avg_dispersion: groupingSummary.avg_dispersion,
                            date: new Date(item.created_at).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            }),
                          })) || []
                      }
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={theme === "dark" ? primitives.grey.grey800 : primitives.grey.grey200}
                        vertical={false}
                      />
                      <XAxis
                        dataKey="label"
                        stroke={theme === "dark" ? primitives.grey.grey600 : primitives.grey.grey400}
                        tick={{ fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        stroke={theme === "dark" ? primitives.grey.grey600 : primitives.grey.grey400}
                        tick={{ fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Line
                        type="monotone"
                        dataKey="cm_dispersion"
                        stroke={primitives.purple.purple400}
                        strokeWidth={5.5}
                        dot={{ fill: primitives.purple.purple400, strokeWidth: 0, r: 3.5 }}
                        activeDot={{ r: 6, strokeWidth: 10, stroke: primitives.purple.purple400 }}
                        name="Dispersion"
                        unit=" cm"
                      />
                      <Line
                        type="monotone"
                        dataKey="avg_dispersion"
                        stroke={primitives.blue.blue300}
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={false}
                        activeDot={{ r: 4, strokeWidth: 0 }}
                        name="Average"
                        unit=" cm"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}
          </div>
        </BaseDashboardCard>

        {/* Bar Status Chart */}
        <BaseDashboardCard header="Performance Levels" tooltipContent="Team performance distribution">
          <div className="p-4">
            <div className="space-y-3">
              {barData.map((item, index) => {
                const barColor =
                  index === 0
                    ? primitives.green.green400
                    : index === 1
                      ? primitives.blue.blue400
                      : index === 2
                        ? primitives.purple.purple400
                        : primitives.grey.grey500;

                return (
                  <div key={item.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium" style={{ color: theme === "dark" ? primitives.grey.grey300 : primitives.grey.grey700 }}>
                        {item.name}
                      </span>
                      <span className="text-sm font-semibold" style={{ color: barColor }}>
                        {item.value}
                      </span>
                    </div>
                    <div className="relative">
                      <div
                        className="h-2 rounded-full overflow-hidden"
                        style={{ backgroundColor: theme === "dark" ? primitives.grey.grey800 : primitives.grey.grey200 }}
                      >
                        <div
                          className="h-full rounded-full transition-all duration-1000 ease-out"
                          style={{
                            width: `${item.percent}%`,
                            backgroundColor: barColor,
                            opacity: theme === "dark" ? 0.8 : 0.9,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </BaseDashboardCard>
      </div>
    </div>
  );
}
