import Stat from "./Stat";

type StatItem = {
  name: string;
  value: string;
  unit: string;
  trend?: "up" | "down" | "stable";
};

// 📊 Average Hit Rate (hits / shots fired)
// ⚠️ Mistake Rate (%) per session or user

const stats: StatItem[] = [
  { name: "Average Hit Rate (hits / shots fired)", value: "158", unit: "" },
  { name: "Mistake Rate (%) per session or user", value: "14", unit: "" },
  {
    name: "Position-based Performance (prone/sitting/standing)",
    value: "94.7",
    unit: "%",
    trend: "up",
  },
  { name: "Avg. Time to First Shot", value: "238", unit: "", trend: "up" },
  {
    name: "Grouping Accuracy (dispersion in cm)",
    value: "92",
    unit: "%",
    trend: "stable",
  },
  { name: "Distance vs Hit Chart", value: "+12.3", unit: "%", trend: "up" },
];

export default function DashboardRowTwo() {
  return (
    <section>
      <h2 className="text-lg font-semibold mb-6 text-white">
        Tactical Performance Metrics
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Stat
            key={`stat-${stat.name}`}
            stat={{
              name: stat.name,
              value: stat.value,
              trend: stat.trend as any,
              unit: stat.unit,
            }}
          />
        ))}
      </div>
    </section>
  );
}
