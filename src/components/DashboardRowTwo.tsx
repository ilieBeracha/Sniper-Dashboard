import Stat from "./Stat";

type StatItem = {
  name: string;
  value: string;
  unit: string;
  trend?: "up" | "down" | "stable";
};

const stats: StatItem[] = [
  { name: "Operatives", value: "158", unit: "" },
  { name: "Active Teams", value: "14", unit: "" },
  { name: "Accuracy Rate", value: "94.7", unit: "%", trend: "up" },
  { name: "Successful Ops", value: "238", unit: "", trend: "up" },
  { name: "Target Acquisition", value: "92", unit: "%", trend: "stable" },
  { name: "Recon Efficiency", value: "+12.3", unit: "%", trend: "up" },
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
