import { useTheme } from "@/contexts/ThemeContext";
import BaseDashboardCard from "./base/BaseDashboardCard";
import { ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import { primitives } from "@/styles/core";
import { WaveLoader } from "./ui/loader";
import { useStore } from "zustand";
import { performanceStore } from "@/store/performance";
import { useEffect, useState } from "react";
import { getEnumValues } from "@/services/supabaseEnums";

const formatEnumLabel = (value: string) =>
  value
    .replace(/_/g, " ") // snake_case → space
    .replace(/([a-z])([A-Z])/g, "$1 $2") // camelCase → space
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase()); // Capitalize first letters

interface DashboardGroupingChartProps {
  className?: string;
}

export default function DashboardGroupingChart({ className }: DashboardGroupingChartProps) {
  const { theme } = useTheme();
  const { groupingSummary, getGroupingSummary, groupingSummaryLoading } = useStore(performanceStore);

  const [weaponTypes, setWeaponTypes] = useState<string[]>([]);
  const [groupingTypes, setGroupingTypes] = useState<string[]>([]);
  const [positions, setPositions] = useState<string[]>([]);
  const [selectedWeaponType, setSelectedWeaponType] = useState<string | null>(null);
  const [selectedGroupType, setSelectedGroupType] = useState<string | null>(null);
  const [selectedEffort, setSelectedEffort] = useState<string | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);

  // Fetch enum options on mount
  useEffect(() => {
    (async () => {
      const weaponsEnums = await getEnumValues("weapon_names");
      const typesEnums = await getEnumValues("grouping_type_enum");
      const positionsEnums = await getEnumValues("positions");

      setWeaponTypes(weaponsEnums);
      setGroupingTypes(typesEnums);
      setPositions(positionsEnums);
    })();
  }, []);

  // Fetch summary when filters change
  useEffect(() => {
    getGroupingSummary(
      selectedWeaponType, 
      selectedEffort === null ? null : selectedEffort === "true", 
      selectedGroupType, 
      selectedPosition
    );
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

  return (
    <div className={className}>
    <BaseDashboardCard
      header="Grouping Summary"
      tooltipContent="Data grouped by filters"
      withFilter={[
        {
          label: "Weapon Type",
          value: "weapon_type",
          onChange: (val) => {
            setSelectedWeaponType(val || null);
          },
          options: [
            { label: "All Weapons", value: "" }, 
            ...weaponTypes.map((type) => ({ label: formatEnumLabel(type), value: type }))
          ],
          type: "select",
        },
        {
          label: "Grouping Type",
          value: "grouping_type",
          onChange: (val) => {
            setSelectedGroupType(val || null);
          },
          options: [
            { label: "All Types", value: "" }, 
            ...groupingTypes.map((type) => ({ label: formatEnumLabel(type), value: type }))
          ],
          type: "select",
        },
        {
          label: "Effort",
          value: "effort",
          onChange: (val) => {
            setSelectedEffort(val || null);
          },
          options: [
            { label: "All Efforts", value: "" },
            { label: "Yes", value: "true" },
            { label: "No", value: "false" },
          ],
          type: "radio",
        },
        {
          label: "Position",
          value: "position",
          onChange: (val) => {
            setSelectedPosition(val || null);
          },
          options: [
            { label: "All Positions", value: "" }, 
            ...positions.map((pos) => ({ label: formatEnumLabel(pos), value: pos }))
          ],
          type: "select",
        },
      ]}
      onClearFilters={() => {
        setSelectedWeaponType(null);
        setSelectedGroupType(null);
        setSelectedEffort(null);
        setSelectedPosition(null);
      }}
      currentFilterValues={{
        weapon_type: selectedWeaponType || "",
        grouping_type: selectedGroupType || "",
        effort: selectedEffort || "",
        position: selectedPosition || "",
      }}
    >
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
                <div className="text-lg font-semibold" style={{ color: theme === "dark" ? primitives.white.white : primitives.grey.grey900 }}>
                  {groupingSummary.avg_dispersion ?? "-"}
                </div>
                <div className="text-xs" style={{ color: theme === "dark" ? primitives.grey.grey400 : primitives.grey.grey600 }}>
                  Average CM
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold" style={{ color: theme === "dark" ? primitives.white.white : primitives.grey.grey900 }}>
                  {groupingSummary.best_dispersion ?? "-"}
                </div>
                <div className="text-xs" style={{ color: theme === "dark" ? primitives.grey.grey400 : primitives.grey.grey600 }}>
                  Best CM
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold" style={{ color: theme === "dark" ? primitives.white.white : primitives.grey.grey900 }}>
                  {groupingSummary.avg_time_to_group ?? "-"}
                </div>
                <div className="text-xs" style={{ color: theme === "dark" ? primitives.grey.grey400 : primitives.grey.grey600 }}>
                  Avg Time
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold" style={{ color: theme === "dark" ? primitives.white.white : primitives.grey.grey900 }}>
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
                  margin={{ top: 0, right: 20, left: -30, bottom: 0 }}
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
                    stroke={primitives.grey.grey500}
                    strokeWidth={3.5}
                    dot={{ fill: primitives.grey.grey500, strokeWidth: 0, r: 3.5 }}
                    activeDot={{ r: 6, strokeWidth: 2, stroke: primitives.grey.grey500 }}
                    name="Dispersion"
                    unit=" cm"
                  />
                  <Line
                    type="monotone"
                    dataKey="avg_dispersion"
                    stroke={primitives.purple.purple100}
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
    </div>
  );
}