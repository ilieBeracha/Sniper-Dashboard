import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { ScoreTarget } from "@/types/score";
import BaseDashboardCard from "./BaseDashboardCard";
import { useTheme } from "@/contexts/ThemeContext";

export default function ScoreDistanceChart({ rows }: { rows: ScoreTarget[] | undefined }) {
  const { theme } = useTheme();
  const data = rows
    ? Object.values(
        (rows as ScoreTarget[]).reduce<Record<number, { distance: string; target_hit: number; shots_fired: number; accuracy: number }>>(
          (acc, { distance, target_hit, shots_fired }) => {
            const d = acc[distance] || { distance: `${distance}m`, target_hit: 0, shots_fired: 0, accuracy: 0 };
            d.target_hit += target_hit;
            d.shots_fired += shots_fired;
            d.accuracy = d.shots_fired > 0 ? Math.round((d.target_hit / d.shots_fired) * 100) : 0;
            acc[distance] = d;
            return acc;
          },
          {},
        ),
      )
    : [];

  data.sort((a, b) => parseInt(a.distance) - parseInt(b.distance));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const accuracy = payload[0].payload.accuracy;
      return (
        <div className={`rounded-md border p-3 shadow-lg backdrop-blur-sm transition-colors duration-200 ${theme === "dark" ? "border-white/10 bg-black/80" : "border-gray-200 bg-white/90"}`}>
          <p className={`mb-1 font-medium transition-colors duration-200 ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>{`Distance: ${label}`}</p>
          <p className="text-sm text-indigo-300">{`Hits: ${payload[0].value}`}</p>
          <p className="text-sm text-blue-300">{`Shots: ${payload[1].value}`}</p>
          <p className={`mt-1 text-sm font-medium transition-colors duration-200 ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>{`Accuracy: ${accuracy}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <BaseDashboardCard header="Hits vs Shots per Distance">
      <div className="h-fit w-full">
        {data.length > 0 ? (
          <ResponsiveContainer minHeight={300} maxHeight={400} width="100%" height="100%">
            <BarChart data={data} margin={{ top: 30, right: 30, left: 0, bottom: 5 }} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme === "dark" ? "#374151" : "#e5e7eb"} vertical={false} />
              <XAxis dataKey="distance" tick={{ fill: theme === "dark" ? "#9CA3AF" : "#6b7280", fontSize: 12 }} axisLine={{ stroke: theme === "dark" ? "#4B5563" : "#d1d5db" }} tickLine={{ stroke: theme === "dark" ? "#4B5563" : "#d1d5db" }} />
              <YAxis tick={{ fill: theme === "dark" ? "#9CA3AF" : "#6b7280", fontSize: 12 }} axisLine={{ stroke: theme === "dark" ? "#4B5563" : "#d1d5db" }} tickLine={{ stroke: theme === "dark" ? "#4B5563" : "#d1d5db" }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: 15 }} formatter={(value) => <span className={`transition-colors duration-200 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>{value}</span>} />
              <Bar name="Hits" dataKey="target_hit" fill="#818CF8" radius={[4, 4, 0, 0]} barSize={24} />
              <Bar name="Shots" dataKey="shots_fired" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center">
            <div className={`mb-2 rounded-full p-3 transition-colors duration-200 ${theme === "dark" ? "bg-gray-800" : "bg-gray-200"}`}>
              <svg className={`h-6 w-6 transition-colors duration-200 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <p className={`transition-colors duration-200 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>No chart data available</p>
          </div>
        )}
      </div>
    </BaseDashboardCard>
  );
}
