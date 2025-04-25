import { useStore } from "zustand";
import { useState, useEffect } from "react";
import { performanceStore } from "@/store/performance";

export default function UserGroupScore() {
  const { userGroupingScores } = useStore(performanceStore);
  const [tab, setTab] = useState<"dispersion" | "time" | "bullets">("dispersion");
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    setAnimating(true);
    const timer = setTimeout(() => setAnimating(false), 600);
    return () => clearTimeout(timer);
  }, [tab]);

  if (!userGroupingScores || userGroupingScores.length === 0) {
    return (
      <div className="h-full flex justify-center items-center text-white">
        <div className="text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-gray-500 mx-auto mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-gray-400">No grouping data available</p>
        </div>
      </div>
    );
  }

  const metrics = {
    dispersion: {
      label: "Dispersion",
      unit: "cm",
      color: "#7F5AF0",
      key: "cm_dispersion" as const,
      better: "lower",
      max: 10,
    },
    time: {
      label: "Time",
      unit: "sec",
      color: "#2CB67D",
      key: "time_seconds" as const,
      better: "lower",
      max: 60,
    },
    bullets: {
      label: "Bullets",
      unit: "shots",
      color: "#FF8906",
      key: "bullets_fired" as const,
      better: "higher",
      max: 50,
    },
  };

  const current = metrics[tab];

  // Calculate values
  const values = userGroupingScores.map((s) => s[current.key]);
  const avgValue = values.reduce((sum, val) => sum + val, 0) / values.length;
  const bestValue = current.better === "lower" ? Math.min(...values) : Math.max(...values);

  // For display only
  const avgFormatted = avgValue.toFixed(1);
  const bestFormatted = bestValue.toFixed(1);

  return (
    <div className="h-full flex flex-col">
      {/* Tactical-style selector */}
      <div className="flex justify-between p-1 bg-[#1A1A1A] rounded-lg mb-3 relative">
        {Object.entries(metrics).map(([key, info]) => (
          <button
            key={key}
            onClick={() => setTab(key as keyof typeof metrics)}
            className="relative z-10 flex-1 py-1.5 text-xs font-mono uppercase text-center"
          >
            <span className={tab === key ? "text-black" : "text-gray-400"}>{info.label}</span>
          </button>
        ))}

        {/* Active highlight slider */}
        <div
          className="absolute top-1 bottom-1 rounded w-1/3 transition-all duration-300 ease-in-out"
          style={{
            left: `${(Object.keys(metrics).indexOf(tab) / 3) * 100}%`,
            backgroundColor: current.color,
          }}
        ></div>
      </div>

      {/* Digital readout display */}
      <div className="flex-1 bg-[#161616] rounded-lg border border-[#333] p-3 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

        <div className="flex justify-between items-center mb-4">
          <span className="text-xs font-mono tracking-wider text-gray-400">SNIPER METRICS</span>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-xs font-mono text-green-500">LIVE</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-black/40 px-3 py-2 rounded-lg border border-[#333]">
            <div className="text-xs font-mono text-gray-400 mb-1">AVG {current.label.toUpperCase()}</div>
            <div className={`text-2xl font-mono tracking-wide ${animating ? "animate-pulse" : ""}`} style={{ color: current.color }}>
              {avgFormatted}
              <span className="text-xs text-gray-500 ml-1">{current.unit}</span>
            </div>
          </div>

          <div className="bg-black/40 px-3 py-2 rounded-lg border border-[#333]">
            <div className="text-xs font-mono text-gray-400 mb-1">BEST {current.label.toUpperCase()}</div>
            <div className={`text-2xl font-mono tracking-wide ${animating ? "animate-pulse" : ""}`} style={{ color: current.color }}>
              {bestFormatted}
              <span className="text-xs text-gray-500 ml-1">{current.unit}</span>
            </div>
          </div>
        </div>

        {/* Mini chart */}
        <div className="mb-3 h-16 bg-black/20 rounded-lg border border-[#333] p-2 relative">
          <div className="absolute inset-0 p-2">
            <div className="relative h-full">
              {values.slice(0, 10).map((value, idx) => {
                const height =
                  current.better === "lower" ? 100 - Math.min(100, (value / current.max) * 100) : Math.min(100, (value / current.max) * 100);

                return (
                  <div
                    key={idx}
                    className="absolute bottom-0 w-1 rounded-sm"
                    style={{
                      left: `${(idx / 10) * 100}%`,
                      height: `${height}%`,
                      backgroundColor: current.color,
                    }}
                  ></div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="font-mono text-xs flex justify-between items-center">
          <div className="text-gray-500">
            STATUS: <span className="text-green-400">OPERATIONAL</span>
          </div>
          <div className="text-gray-400">{userGroupingScores.length} RECORDS</div>
        </div>
      </div>
    </div>
  );
}
