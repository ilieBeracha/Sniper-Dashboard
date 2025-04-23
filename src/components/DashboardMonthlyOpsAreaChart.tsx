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

const monthlyOperationsData = [
  { month: "Jan", directHits: 32, assistedEliminations: 18, missedTargets: 4 },
  { month: "Feb", directHits: 37, assistedEliminations: 24, missedTargets: 2 },
  { month: "Mar", directHits: 30, assistedEliminations: 28, missedTargets: 5 },
  { month: "Apr", directHits: 41, assistedEliminations: 25, missedTargets: 3 },
  { month: "May", directHits: 35, assistedEliminations: 21, missedTargets: 2 },
  { month: "Jun", directHits: 38, assistedEliminations: 19, missedTargets: 1 },
  { month: "Jul", directHits: 42, assistedEliminations: 23, missedTargets: 2 },
  { month: "Aug", directHits: 44, assistedEliminations: 26, missedTargets: 0 },
  { month: "Sep", directHits: 37, assistedEliminations: 30, missedTargets: 3 },
  { month: "Oct", directHits: 45, assistedEliminations: 27, missedTargets: 1 },
  { month: "Nov", directHits: 43, assistedEliminations: 25, missedTargets: 2 },
  { month: "Dec", directHits: 48, assistedEliminations: 31, missedTargets: 0 },
];

export default function MonthlyOpsAreaChart() {
  return (
    <>
      <h2 className="text-lg font-semibold mb-6 text-white">
        Monthly Operation Success Rate
      </h2>
      <ResponsiveContainer width="100%" height={350}>
        <AreaChart
          data={monthlyOperationsData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorDirectHits" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient
              id="colorAssistedEliminations"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="5%" stopColor="#2CB67D" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#2CB67D" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="colorMissedTargets" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F25F4C" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#F25F4C" stopOpacity={0.1} />
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
              color: "white",
              fontWeight: "bold",
              marginBottom: "8px",
            }}
            itemStyle={{ padding: "4px 0" }}
          />
          <Legend wrapperStyle={{ paddingTop: "10px", color: "#F3F4F6" }} />
          <Area
            type="monotone"
            dataKey="directHits"
            name="Direct Hits"
            stroke="#4F46E5"
            fillOpacity={1}
            fill="url(#colorDirectHits)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="assistedEliminations"
            name="Assisted Eliminations"
            stroke="#2CB67D"
            fillOpacity={1}
            fill="url(#colorAssistedEliminations)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="missedTargets"
            name="Missed Targets"
            stroke="#F25F4C"
            fillOpacity={1}
            fill="url(#colorMissedTargets)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </>
  );
}
