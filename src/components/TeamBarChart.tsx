import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const barChartData = [
  { name: "Alpha", confirmed: 28, potential: 41 },
  { name: "Bravo", confirmed: 22, potential: 34 },
  { name: "Charlie", confirmed: 31, potential: 45 },
  { name: "Delta", confirmed: 25, potential: 37 },
  { name: "Echo", confirmed: 18, potential: 29 },
];

export default function TeamBarChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={barChartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <XAxis dataKey="name" stroke="#9CA3AF" />
        <YAxis stroke="#9CA3AF" />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1F2937",
            border: "1px solid #4B5563",
            borderRadius: "8px",
          }}
          labelStyle={{ color: "#F3F4F6" }}
          itemStyle={{ color: "#A5B4FC" }}
        />
        <Bar
          dataKey="confirmed"
          name="Confirmed Eliminations"
          fill="#7F5AF0"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="potential"
          name="Potential Targets"
          fill="#2CB67D"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
