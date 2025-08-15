import { useEffect, useMemo, useState } from "react";
import { useStore } from "zustand";
import { userStore } from "@/store/userStore";
import { performanceStore } from "@/store/performance";
import { subDays, startOfDay, format, eachDayOfInterval } from "date-fns";
import { useTheme } from "@/contexts/ThemeContext";

interface DistancePerformance {
  date: string;
  ranges: {
    "0-100": { shots: number; hits: number; ratio: number };
    "100-200": { shots: number; hits: number; ratio: number };
    "200-300": { shots: number; hits: number; ratio: number };
    "300+": { shots: number; hits: number; ratio: number };
  };
  totalEngagements: number;
}

export default function DistanceHeatMap() {
  const { user } = useStore(userStore);
  const { theme } = useTheme();
  const { firstShotMatrix, getFirstShotMatrix } = useStore(performanceStore);
  const [loading, setLoading] = useState(false);
  const [selectedRange, setSelectedRange] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.team_id) return;

    const loadData = async () => {
      setLoading(true);
      try {
        await getFirstShotMatrix(user.team_id || "", 30);
      } catch (error) {
        console.error("Error loading distance performance data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user?.team_id]);

  const distanceData = useMemo(() => {
    const map = new Map<string, DistancePerformance>();
    const end = new Date();
    const start = subDays(end, 30);

    eachDayOfInterval({ start: startOfDay(start), end: startOfDay(end) }).forEach((date) => {
      const key = format(date, "yyyy-MM-dd");
      map.set(key, {
        date: key,
        ranges: {
          "0-100": { shots: 0, hits: 0, ratio: 0 },
          "100-200": { shots: 0, hits: 0, ratio: 0 },
          "200-300": { shots: 0, hits: 0, ratio: 0 },
          "300+": { shots: 0, hits: 0, ratio: 0 },
        },
        totalEngagements: 0,
      });
    });

    // Process firstShotMatrix data if available
    if (firstShotMatrix && Array.isArray(firstShotMatrix)) {
      firstShotMatrix.forEach((item: any) => {
        const dateKey = format(new Date(item.training_date || new Date()), "yyyy-MM-dd");
        const perf = map.get(dateKey);

        if (perf && item.distance_range) {
          const range = item.distance_range as keyof typeof perf.ranges;
          if (perf.ranges[range]) {
            perf.ranges[range].shots += item.total_first_shots || 0;
            perf.ranges[range].hits += item.first_shot_hits || 0;
            if (perf.ranges[range].shots > 0) {
              perf.ranges[range].ratio = perf.ranges[range].hits / perf.ranges[range].shots;
            }
            perf.totalEngagements++;
          }
        }
      });
    }

    return Array.from(map.values());
  }, [firstShotMatrix]);

  const getIntensityClass = (ratio: number, hasData: boolean) => {
    if (!hasData) {
      return theme === "dark" ? "bg-zinc-900/50 border-zinc-800" : "bg-gray-50 border-gray-200";
    }

    if (theme === "dark") {
      if (ratio >= 0.8) return "bg-emerald-600/70 border-emerald-500/50";
      if (ratio >= 0.6) return "bg-emerald-500/50 border-emerald-400/40";
      if (ratio >= 0.4) return "bg-yellow-600/50 border-yellow-500/40";
      if (ratio >= 0.2) return "bg-orange-600/50 border-orange-500/40";
      return "bg-red-600/50 border-red-500/40";
    } else {
      if (ratio >= 0.8) return "bg-emerald-500 border-emerald-600";
      if (ratio >= 0.6) return "bg-emerald-400 border-emerald-500";
      if (ratio >= 0.4) return "bg-yellow-400 border-yellow-500";
      if (ratio >= 0.2) return "bg-orange-400 border-orange-500";
      return "bg-red-400 border-red-500";
    }
  };

  const distanceRanges = ["0-100", "100-200", "200-300", "300+"] as const;

  return (
    <div className={`rounded-xl p-6 border shadow-sm h-full ${theme === "dark" ? "bg-zinc-900/90 border-zinc-700" : "bg-white border-gray-200"}`}>
      <div className="mb-4">
        <h4 className={`text-lg font-semibold ${theme === "dark" ? "text-white" : "text-gray-800"}`}>Distance Performance Matrix</h4>
        <p className={`text-sm mt-1 ${theme === "dark" ? "text-zinc-400" : "text-gray-500"}`}>Accuracy at different ranges over the last 30 days</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-400"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Distance range tabs */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setSelectedRange(null)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                selectedRange === null
                  ? theme === "dark"
                    ? "bg-zinc-700 text-white"
                    : "bg-gray-200 text-gray-900"
                  : theme === "dark"
                    ? "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              All Ranges
            </button>
            {distanceRanges.map((range) => (
              <button
                key={range}
                onClick={() => setSelectedRange(range)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  selectedRange === range
                    ? theme === "dark"
                      ? "bg-zinc-700 text-white"
                      : "bg-gray-200 text-gray-900"
                    : theme === "dark"
                      ? "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {range}m
              </button>
            ))}
          </div>

          {/* Heatmap grid */}
          {selectedRange === null ? (
            <div className="space-y-3">
              {distanceRanges.map((range) => (
                <div key={range}>
                  <div className={`text-xs font-medium mb-2 ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>{range}m</div>
                  <div className="grid grid-cols-15 gap-1">
                    {distanceData.slice(-15).map((day, index) => {
                      const rangeData = day.ranges[range as keyof typeof day.ranges];
                      const hasData = rangeData.shots > 0;

                      return (
                        <div key={index} className="relative group">
                          <div
                            className={`aspect-square rounded border transition-all duration-300 cursor-pointer 
                              ${getIntensityClass(rangeData.ratio, hasData)} hover:scale-110 hover:z-10`}
                          />

                          {hasData && (
                            <div
                              className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 
                                rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 
                                pointer-events-none whitespace-nowrap shadow-xl backdrop-blur-sm ${
                                  theme === "dark"
                                    ? "bg-zinc-800/95 text-white border border-zinc-600/50"
                                    : "bg-white/95 text-gray-800 border border-gray-200/50"
                                }`}
                            >
                              <div className="font-semibold">{format(new Date(day.date), "MMM d")}</div>
                              <div className="mt-1">
                                <div>Range: {range}m</div>
                                <div>Shots: {rangeData.shots}</div>
                                <div>Hits: {rangeData.hits}</div>
                                <div className="font-bold text-emerald-400">{Math.round(rangeData.ratio * 100)}%</div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-10 gap-2">
              {distanceData.map((day, index) => {
                const rangeData = day.ranges[selectedRange as keyof typeof day.ranges];
                const hasData = rangeData.shots > 0;

                return (
                  <div key={index} className="relative group">
                    <div
                      className={`aspect-square rounded-lg border-2 transition-all duration-300 cursor-pointer 
                        relative overflow-hidden ${getIntensityClass(rangeData.ratio, hasData)} 
                        hover:scale-125 hover:z-10 hover:shadow-2xl`}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div
                          className={`text-[10px] font-semibold ${
                            hasData ? (theme === "dark" ? "text-white/90" : "text-white") : theme === "dark" ? "text-zinc-600" : "text-gray-400"
                          }`}
                        >
                          {format(new Date(day.date), "d")}
                        </div>
                      </div>
                    </div>

                    {hasData && (
                      <div
                        className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-4 py-3 
                          rounded-xl text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 
                          pointer-events-none whitespace-nowrap shadow-2xl backdrop-blur-md ${
                            theme === "dark"
                              ? "bg-zinc-800/95 text-white border border-zinc-600/50"
                              : "bg-white/95 text-gray-800 border border-gray-200/50"
                          }`}
                      >
                        <div className="font-bold mb-2">{format(new Date(day.date), "MMM d, yyyy")}</div>
                        <div className="text-xs space-y-1">
                          <div>Range: {selectedRange}m</div>
                          <div className="flex justify-between">
                            <span>Shots:</span>
                            <span className="font-semibold ml-4">{rangeData.shots}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Hits:</span>
                            <span className="font-semibold ml-4">{rangeData.hits}</span>
                          </div>
                          <div className="flex justify-between pt-1 border-t border-white/20">
                            <span>Accuracy:</span>
                            <span className="font-bold text-emerald-400 ml-4">{Math.round(rangeData.ratio * 100)}%</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Legend */}
          <div className={`flex items-center justify-between pt-4 border-t ${theme === "dark" ? "border-zinc-700" : "border-gray-200"}`}>
            <div className="flex items-center gap-4">
              <span className={`text-xs ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>Accuracy:</span>
              <div className="flex items-center gap-2">
                {[
                  { label: "80%+", class: theme === "dark" ? "bg-emerald-600/70" : "bg-emerald-500" },
                  { label: "60-79%", class: theme === "dark" ? "bg-emerald-500/50" : "bg-emerald-400" },
                  { label: "40-59%", class: theme === "dark" ? "bg-yellow-600/50" : "bg-yellow-400" },
                  { label: "20-39%", class: theme === "dark" ? "bg-orange-600/50" : "bg-orange-400" },
                  { label: "<20%", class: theme === "dark" ? "bg-red-600/50" : "bg-red-400" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-1">
                    <div className={`w-3 h-3 rounded ${item.class}`} />
                    <span className={`text-xs ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
