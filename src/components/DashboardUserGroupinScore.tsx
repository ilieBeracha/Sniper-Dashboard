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
      <div className="bg-[#1E1E1E] p-4 rounded-2xl text-white text-center">
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
    <div className="bg-[#1E1E1E] p-6 rounded-2xl text-white shadow-xl w-full h-full justify-between mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-center">
        Grouping Averages
      </h2>

      <div className="flex justify-center gap-2 mb-6">
        {Object.keys(tabInfo).map((key) => (
          <button
            key={key}
            onClick={() => setTab(key as keyof typeof tabInfo)}
            className={`px-3 py-1 rounded-full text-sm ${
              tab === key
                ? "bg-white text-[#121212] font-bold"
                : "bg-[#2A2A2A] text-gray-400"
            }`}
          >
            {tabInfo[key as keyof typeof tabInfo].label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
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
    <div className="bg-[#252525] rounded-sm p-4 flex flex-col justify-between shadow border border-white/5">
      <span className="text-gray-400 text-sm mb-2">{title}</span>
      <p className="text-2xl font-bold" style={{ color }}>
        {value}
      </p>
    </div>
  );
}
