import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

const pieData = [
  { name: "Active", value: 68, color: "#7F5AF0" },
  { name: "Standby", value: 22, color: "#2CB67D" },
  { name: "Down", value: 10, color: "#F2994A" },
];

export default function DashboardStatusChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie
          data={pieData}
          cx="50%"
          cy="50%"
          innerRadius={80}
          outerRadius={120}
          paddingAngle={2}
          dataKey="value"
          label={({ name, percent }) =>
            `${name} ${(percent * 100).toFixed(0)}%`
          }
          labelLine={false}
        >
          {pieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "#252525",
            borderColor: "#333",
            borderRadius: "4px",
          }}
          itemStyle={{ color: "#fff" }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
