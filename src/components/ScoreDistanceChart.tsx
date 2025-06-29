import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { ScoreRangeRow } from "@/types/score";
import BaseDashboardCard from "./BaseDashboardCard";

export default function ScoreDistanceChart({ rows }: { rows: ScoreRangeRow[] | undefined }) {
  const data = rows
    ? Object.values(
        (rows as ScoreRangeRow[]).reduce<Record<number, { distance: string; target_hit: number; shots_fired: number; accuracy: number }>>(
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
        <div className="rounded-md border border-white/10 bg-black/80 p-3 shadow-lg backdrop-blur-sm">
          <p className="mb-1 font-medium text-gray-200">{`Distance: ${label}`}</p>
          <p className="text-sm text-indigo-300">{`Hits: ${payload[0].value}`}</p>
          <p className="text-sm text-blue-300">{`Shots: ${payload[1].value}`}</p>
          <p className="mt-1 text-sm font-medium text-gray-200">{`Accuracy: ${accuracy}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <BaseDashboardCard header="Hits vs Shots per Distance">
      <div className="h-80 w-full">
        {data.length > 0 ? (
          <ResponsiveContainer minHeight={350} width="100%" height="100%">
            <BarChart data={data} margin={{ top: 30, right: 30, left: 0, bottom: 5 }} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" vertical={false} />
              <XAxis dataKey="distance" tick={{ fill: "#9CA3AF", fontSize: 12 }} axisLine={{ stroke: "#4B5563" }} tickLine={{ stroke: "#4B5563" }} />
              <YAxis tick={{ fill: "#9CA3AF", fontSize: 12 }} axisLine={{ stroke: "#4B5563" }} tickLine={{ stroke: "#4B5563" }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: 15 }} formatter={(value) => <span className="text-gray-300">{value}</span>} />
              <Bar name="Hits" dataKey="target_hit" fill="#818CF8" radius={[4, 4, 0, 0]} barSize={24} />
              <Bar name="Shots" dataKey="shots_fired" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center">
            <div className="mb-2 rounded-full bg-gray-800 p-3">
              <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <p className="text-gray-400">No chart data available</p>
          </div>
        )}
      </div>
    </BaseDashboardCard>
  );
}
