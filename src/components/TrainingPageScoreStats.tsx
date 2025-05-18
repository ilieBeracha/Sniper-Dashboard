import { Moon, Sun, Target, Users } from "lucide-react";

export default function TrainingPageScoreStats({
  totalScores,
  dayScores,
  nightScores,
  squadCount,
}: {
  totalScores: number;
  dayScores: number;
  nightScores: number;
  squadCount: number;
}) {
  const stats = [
    {
      title: "Total Records",
      icon: <Target className="h-5 w-5 text-indigo-400" />,
      value: totalScores,
    },
    {
      title: "Day Sessions",
      icon: <Sun className="h-5 w-5 text-amber-400" />,
      value: dayScores,
    },
    {
      title: "Night Sessions",
      icon: <Moon className="h-5 w-5 text-blue-400" />,
      value: nightScores,
    },
    {
      title: "Active Squads",
      icon: <Users className="h-5 w-5 text-green-400" />,
      value: squadCount,
    },
  ];

  return (
    <div className="w-full ">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.title} className="rounded-md bg-zinc-800 px-4 py-2 border border-zinc-700 hover:shadow-md transition-shadow">
            <div className="flex  items-center gap-3 mb-2">
              {stat.icon}
              <h4 className="text-sm font-medium text-zinc-300">{stat.title}</h4>
            </div>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
