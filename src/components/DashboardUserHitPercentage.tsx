import { useStore } from "zustand";
import { ScoreStore } from "@/store/scoreStore";

interface HitPercentageData {
  hit_percentage: number;
  total_shots: number;
  total_hits: number;
  assignments_count: number;
}

export default function UserHitPercentage() {
  const useScoreStore = useStore(ScoreStore);
  const userHitPercentage: HitPercentageData | null =
    useScoreStore.userHitPercentage;

  if (!userHitPercentage) {
    return (
      <div className="bg-[#1E1E1E] p-4 rounded-2xl text-white text-center">
        Loading shooting data...
      </div>
    );
  }

  return (
    <div className="bg-[#1E1E1E] h-full rounded-2xl text-white w-full flex flex-col gap-8">
      <div className="w-full">
        <p className="text-sm text-gray-400 mb-2">Hit Accuracy</p>
        <div className="w-full bg-white/10 rounded-full h-3">
          <div
            className="h-3 rounded-full bg-gradient-to-r from-[#7F5AF0] to-[#2CB67D] transition-all"
            style={{ width: `${userHitPercentage.hit_percentage}%` }}
          />
        </div>
        <p className="text-right text-sm mt-1 text-gray-300">
          {userHitPercentage.hit_percentage.toFixed(1)}%
        </p>
      </div>

      <div className="h-full justify-between gap-6">
        <StatCard title="Total Shots" value={userHitPercentage.total_shots} />
        <StatCard title="Hits" value={userHitPercentage.total_hits} />
        <StatCard
          title="Assignments"
          value={userHitPercentage.assignments_count}
        />
        <StatCard
          title="Hit % (again)"
          value={`${userHitPercentage.hit_percentage.toFixed(1)}%`}
        />
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className=" h-full rounded-xl  flex flex-col justify-center items-center mb-4">
      <span className="text-sm text-gray-400">{title}</span>
      <span className="text-2xl font-semibold text-white">{value}</span>
    </div>
  );
}
