import { useStore } from "zustand";
import { ScoreStore } from "@/store/scoreStore";
import { useState } from "react";

export default function UserGroupScore() {
  const useScoreStore = useStore(ScoreStore);
  const userGroupingScores = useScoreStore.userGroupingScores;
  const [tab, setTab] = useState<"dispersion" | "time" | "bullets">(
    "dispersion"
  );

  if (!userGroupingScores || userGroupingScores.length === 0) {
    return (
      <div className="p-4 rounded-2xl text-white text-center bg-[#1E1E1E]">
        No grouping score data available.
      </div>
    );
  }

  const avg = (key: "cm_dispersion" | "time_seconds" | "bullets_fired") =>
    (
      userGroupingScores.reduce((sum, s) => sum + s[key], 0) /
      userGroupingScores.length
    ).toFixed(1);

  const best = (key: "cm_dispersion" | "time_seconds" | "bullets_fired") =>
    Math.min(...userGroupingScores.map((s) => s[key]));

  const tabInfo = {
    dispersion: {
      label: "Dispersion",
      unit: "cm",
      color: "#7F5AF0",
      key: "cm_dispersion" as const,
    },
    time: {
      label: "Time",
      unit: "sec",
      color: "#2CB67D",
      key: "time_seconds" as const,
    },
    bullets: {
      label: "Bullets Fired",
      unit: "shots",
      color: "#FF8906",
      key: "bullets_fired" as const,
    },
  };

  const current = tabInfo[tab];

  return (
    <div className=" p-6 rounded-2xl text-white w-full shadow-lg">
      {/* Tab Bar */}
      <div className="border-b border-white/10 mb-6">
        <div className="flex justify-start gap-8">
          {Object.entries(tabInfo).map(([key, info]) => {
            const isActive = tab === key;
            return (
              <button
                key={key}
                onClick={() => setTab(key as keyof typeof tabInfo)}
                className={`pb-3 text-sm font-medium transition-all border-b-2 ${
                  isActive
                    ? "border-white text-white"
                    : "border-transparent text-gray-500 hover:text-white"
                }`}
              >
                {info.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-6">
        <StatCard
          title="Average"
          value={`${avg(current.key)} ${current.unit}`}
          color={current.color}
        />
        <StatCard
          title="Best"
          value={`${best(current.key)} ${current.unit}`}
          color={current.color}
        />
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  color,
}: {
  title: string;
  value: string;
  color: string;
}) {
  return (
    <div className="bg-[#121212] border border-white/5 p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
      <span className="text-gray-400 text-sm tracking-wide uppercase">
        {title}
      </span>
      <p className="text-3xl font-bold mt-2" style={{ color }}>
        {value}
      </p>
    </div>
  );
}
