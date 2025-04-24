import { useStore } from "zustand";
import { ScoreStore } from "@/store/scoreStore";
import { useState } from "react";
import { motion } from "framer-motion";

export default function UserGroupScore() {
  const useScoreStore = useStore(ScoreStore);
  const userGroupingScores = useScoreStore.userGroupingScores;
  const [tab, setTab] = useState<"dispersion" | "time" | "bullets">(
    "dispersion"
  );

  if (!userGroupingScores || userGroupingScores.length === 0) {
    return (
      <div className="p-4 rounded-2xl text-white text-center bg-[#1E1E1E] border border-white/10">
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
    <div className="bg-[#1E1E1E] rounded-2xl text-white space-y-6 border border-white/5 shadow-md">
      {/* Tab Buttons */}
      <div className="flex mb-4">
        {Object.entries(tabInfo).map(([key, info]) => (
          <button
            key={key}
            onClick={() => setTab(key as keyof typeof tabInfo)}
            className={`px-4 py-2 text-sm  border transition-all ${
              tab === key
                ? "bg-gradient-to-r from-white/10 to-white/5 border-white/10"
                : "bg-[#161616] border-white/5 text-gray-400"
            }`}
          >
            {info.label}
          </button>
        ))}
      </div>

      {/* Stat Rings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <ScoreRing
          label="Average"
          value={parseFloat(avg(current.key))}
          unit={current.unit}
          color={current.color}
          max={tab === "bullets" ? 50 : tab === "time" ? 60 : 10}
        />
        <ScoreRing
          label="Best"
          value={best(current.key)}
          unit={current.unit}
          color={current.color}
          max={tab === "bullets" ? 50 : tab === "time" ? 60 : 10}
        />
      </div>
    </div>
  );
}

function ScoreRing({
  label,
  value,
  unit,
  color,
  max,
}: {
  label: string;
  value: number;
  unit: string;
  color: string;
  max: number;
}) {
  const percentage = Math.min(100, (value / max) * 100);

  return (
    <div className="relative flex flex-col items-center justify-center bg-[#121212] rounded-xl p-6 border border-white/5 shadow-inner">
      <svg className="w-24 h-24 mb-3">
        <circle
          className="text-gray-700"
          strokeWidth="6"
          stroke="currentColor"
          fill="transparent"
          r="36"
          cx="48"
          cy="48"
        />
        <motion.circle
          className="origin-center"
          strokeWidth="6"
          stroke={color}
          fill="transparent"
          r="36"
          cx="48"
          cy="48"
          strokeDasharray="226.19"
          strokeDashoffset={226.19 * ((100 - percentage) / 100)}
          initial={{ strokeDashoffset: 226.19 }}
          animate={{ strokeDashoffset: 226.19 * ((100 - percentage) / 100) }}
          transition={{ duration: 0.8 }}
        />
      </svg>
      <span className="text-xs text-gray-400 uppercase">{label}</span>
      <p className="text-2xl font-bold mt-1" style={{ color }}>
        {value} <span className="text-sm text-gray-400">{unit}</span>
      </p>
    </div>
  );
}
