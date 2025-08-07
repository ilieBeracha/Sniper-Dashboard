import { useTheme } from "@/contexts/ThemeContext";
import BaseDashboardCard from "@/components/base/BaseDashboardCard";
import { primitives } from "@/styles/core";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, PieChart, Pie, Cell } from "recharts";
import { useMemo } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";

interface SessionStatsOverviewProps {
  sessionStats: any[];
  className?: string;
}

export default function SessionStatsOverview({ sessionStats = [], className }: SessionStatsOverviewProps) {
  const { theme } = useTheme();
  const isMobile = useIsMobile();

  const summary = useMemo(() => {
    const total = sessionStats.length;
    const day = sessionStats.filter((s) => s.day_period === "day").length;
    const night = sessionStats.filter((s) => s.day_period === "night").length;
    const effortTrue = sessionStats.filter((s) => s.effort === true).length;
    const timeValues = sessionStats.map((s) => s.time_to_first_shot_sec).filter((v) => v !== null && v !== undefined);
    const avgTime = timeValues.length ? Math.round(timeValues.reduce((a, b) => a + b, 0) / timeValues.length) : null;

    // Assignment distribution
    const assignmentMap: Record<string, number> = {};
    sessionStats.forEach((s) => {
      const name = s.assignment_session?.assignment?.assignment_name || "Unknown";
      assignmentMap[name] = (assignmentMap[name] || 0) + 1;
    });
    const assignmentData = Object.keys(assignmentMap).map((name) => ({ name, value: assignmentMap[name] }));

    return { total, day, night, effortTrue, avgTime, assignmentData };
  }, [sessionStats]);

  const COLORS = [
    primitives.blue.blue500,
    primitives.orange.orange500,
    primitives.green.green500,
    primitives.purple.purple400,
    primitives.red.red400,
  ];

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
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (!sessionStats || sessionStats.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <BaseDashboardCard header="Session Overview" tooltipContent="Quick glance at key metrics of the sessions">
        <div className="flex flex-col gap-4 px-4">
          {/* KPI Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 pb-2">
            <Kpi label="Total Sessions" value={summary.total} theme={theme} />
            <Kpi label="Day Sessions" value={summary.day} theme={theme} />
            <Kpi label="Night Sessions" value={summary.night} theme={theme} />
            <Kpi label="Effort Sessions" value={summary.effortTrue} theme={theme} />
            {summary.avgTime !== null && <Kpi label="Avg. First Shot (s)" value={summary.avgTime} theme={theme} />}
          </div>

          {/* Charts */}
          <div className={`grid gap-8 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
            {/* Day vs Night Pie */}
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    dataKey="value"
                    data={[
                      { name: "Day", value: summary.day },
                      { name: "Night", value: summary.night },
                    ]}
                    innerRadius={40}
                    outerRadius={80}
                    label
                  >
                    {[summary.day, summary.night].map((_, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? primitives.blue.blue500 : primitives.grey.grey500} />
                    ))}
                  </Pie>
                  <ReTooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Assignment Bar Chart */}
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={summary.assignmentData} margin={{ top: 20, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={theme === "dark" ? primitives.grey.grey800 : primitives.grey.grey200}
                    vertical={false}
                  />
                  <XAxis dataKey="name" stroke={theme === "dark" ? primitives.grey.grey600 : primitives.grey.grey400} tick={{ fontSize: 12 }} />
                  <YAxis
                    allowDecimals={false}
                    stroke={theme === "dark" ? primitives.grey.grey600 : primitives.grey.grey400}
                    tick={{ fontSize: 12 }}
                  />
                  <ReTooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {summary.assignmentData.map((_entry, idx) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </BaseDashboardCard>
    </div>
  );
}

function Kpi({ label, value, theme }: { label: string; value: number; theme: string }) {
  return (
    <div className="text-center">
      <div className="text-lg md:text-2xl font-semibold" style={{ color: theme === "dark" ? primitives.white.white : primitives.grey.grey900 }}>
        {value ?? "-"}
      </div>
      <div className="text-xs md:text-sm" style={{ color: theme === "dark" ? primitives.grey.grey400 : primitives.grey.grey600 }}>
        {label}
      </div>
    </div>
  );
}
