import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const hitsOverTime = [
  { month: "Jan", userHits: 25, squadHits: 78, teamHits: 230 },
  { month: "Feb", userHits: 31, squadHits: 84, teamHits: 219 },
  { month: "Mar", userHits: 20, squadHits: 95, teamHits: 207 },
  { month: "Apr", userHits: 28, squadHits: 89, teamHits: 214 },
  { month: "May", userHits: 34, squadHits: 92, teamHits: 225 },
];

export default function DashboardMonthlyOpsAreaChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart
        data={hitsOverTime}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          {/* Gradient for User */}
          <linearGradient id="strokeUser" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#7F5AF0" />
            <stop offset="100%" stopColor="#2CB67D" />
          </linearGradient>
          <linearGradient id="fillUser" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7F5AF0" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#2CB67D" stopOpacity={0.05} />
          </linearGradient>

          {/* Gradient for Squad */}
          <linearGradient id="strokeSquad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#2CB67D" />
            <stop offset="100%" stopColor="#7F5AF0" />
          </linearGradient>
          <linearGradient id="fillSquad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2CB67D" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#7F5AF0" stopOpacity={0.05} />
          </linearGradient>

          {/* Gradient for Team */}
          <linearGradient id="strokeTeam" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#F25F4C" />
            <stop offset="100%" stopColor="#FF8906" />
          </linearGradient>
          <linearGradient id="fillTeam" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F25F4C" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#FF8906" stopOpacity={0.05} />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
        <XAxis dataKey="month" stroke="#9CA3AF" />
        <YAxis stroke="#9CA3AF" />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1F2937",
            border: "1px solid #4B5563",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
          }}
          labelStyle={{
            color: "#F3F4F6",
            fontWeight: "bold",
            marginBottom: "8px",
          }}
          itemStyle={{ padding: "4px 0", color: "#F3F4F6" }}
        />
        <Legend wrapperStyle={{ paddingTop: "10px", color: "#F3F4F6" }} />

        <Area
          type="monotone"
          dataKey="userHits"
          name="User Hits"
          stroke="url(#strokeUser)"
          fill="url(#fillUser)"
          strokeWidth={2}
        />
        <Area
          type="monotone"
          dataKey="squadHits"
          name="Squad Hits"
          stroke="url(#strokeSquad)"
          fill="url(#fillSquad)"
          strokeWidth={2}
        />
        <Area
          type="monotone"
          dataKey="teamHits"
          name="Team Hits"
          stroke="url(#strokeTeam)"
          fill="url(#fillTeam)"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
