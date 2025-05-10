import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useStore } from "zustand";
import { performanceStore } from "@/store/performance";
import NoDataDisplay from "./BaseNoData";

export default function UserHitPercentage() {
  const { userHitPercentage } = useStore(performanceStore);

  if (!userHitPercentage) {
    return (
      <div className="h-full flex justify-center items-center w-full">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const percentage = userHitPercentage.hit_percentage;
  const gaugeData = [
    { name: "Hit", value: percentage },
    { name: "Miss", value: 100 - percentage },
  ];

  const getColor = (pct: number) => {
    if (pct >= 75) return "#2CB67D";
    if (pct >= 50) return "#FF8906";
    return "#F25F4C";
  };

  const hitColor = getColor(percentage);

  return (
    <div className="flex w-full flex-col h-full justify-evenly col-auto">
      <div className=" relative justify-between flex h-full flex-col">
        {!userHitPercentage.hit_percentage && userHitPercentage.total_shots === 0 ? (
          <NoDataDisplay />
        ) : (
          <>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={gaugeData}
                  cx="50%"
                  cy="80%"
                  startAngle={180}
                  endAngle={0}
                  innerRadius="60%"
                  outerRadius="90%"
                  paddingAngle={0}
                  dataKey="value"
                  cornerRadius={6}
                >
                  <Cell fill={hitColor} />
                  <Cell fill="#333" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            <div className="absolute inset-0 flex flex-col mt-1">
              <span className="text-3xl font-bold text-white">{percentage ? percentage.toFixed(1) : 0}%</span>
              <span className="text-xs text-gray-400 uppercase tracking-wider">Accuracy</span>
            </div>
            <div className="grid grid-cols-1 gap-3 mt-2">
              <div className="bg-[#1A1A1A] p-2 rounded-lg">
                <div className="flex justify-between">
                  <span className="text-xs text-gray-400">Total Shots</span>
                  <span className="text-xs px-1.5 py-0.5 bg-gray-800 rounded-md text-gray-300">{userHitPercentage.total_shots}</span>
                </div>
                <div className="mt-1 h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-blue-500" style={{ width: `100%` }}></div>
                </div>
              </div>

              <div className="bg-[#1A1A1A] p-2 rounded-lg">
                <div className="flex justify-between">
                  <span className="text-xs text-gray-400">Confirmed Hits</span>
                  <span className="text-xs px-1.5 py-0.5 bg-gray-800 rounded-md text-gray-300">{userHitPercentage.total_hits}</span>
                </div>
                <div className="mt-1 h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${(userHitPercentage.total_hits / userHitPercentage.total_shots) * 100}%`, backgroundColor: hitColor }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="mt-3 text-center text-xs text-gray-400">
              <span className="bg-[#1A1A1A] px-2 py-0.5 rounded">{userHitPercentage.assignments_count} Assignments Completed</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
