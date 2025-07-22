import { useTheme } from "@/contexts/ThemeContext";
import BaseDashboardCard from "./base/BaseDashboardCard";
import { ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import { primitives } from "@/styles/core";
import UserHitPercentage from "./DashboardUserHitPercentage";

const lineData = [
  { date: "Jun", percent: 20, count: 18 },
  { date: "Jul", percent: 60, count: 35 },
  { date: "Aug", percent: 63, count: 36 },
  { date: "Sep", percent: 65, count: 38 },
  { date: "Oct", percent: 68, count: 42 },
  { date: "Nov", percent: 72, count: 45 },
];

const barData = [
  { name: "Excellent", value: 85, percent: 85 },
  { name: "Good", value: 72, percent: 72 },
  { name: "Average", value: 56, percent: 56 },
  { name: "Improving", value: 34, percent: 34 },
];

export default function DashboardSquadProgress() {
  const { theme } = useTheme();

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
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {/* Performance Overview - Full width on mobile, left side on desktop */}
      <div className="w-full">
        <BaseDashboardCard header="Performance Overview" tooltipContent="Current performance metrics">
          <UserHitPercentage />
        </BaseDashboardCard>
      </div>

      {/* Charts Container - Full width on mobile, right side on desktop with 2 stacked charts */}
      <div className="grid grid-cols-1 gap-6 lg:col-span-1 xl:col-span-2">
        {/* Line Chart */}
        <BaseDashboardCard header="Progress Over Time" tooltipContent="Performance trend analysis">
          <div className="h-[240px] p-4 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === "dark" ? primitives.grey.grey800 : primitives.grey.grey200} vertical={false} />
                <XAxis
                  dataKey="date"
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
                  domain={[0, 100]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="percent"
                  stroke={primitives.blue.blue400}
                  strokeWidth={2.5}
                  dot={{ fill: primitives.blue.blue400, strokeWidth: 0, r: 3.5 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                  name="Performance %"
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke={primitives.green.green400}
                  strokeWidth={2.5}
                  dot={{ fill: primitives.green.green400, strokeWidth: 0, r: 3.5 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                  name="Active Count"
                />
              </LineChart>
            </ResponsiveContainer>
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
