import { useEffect, useMemo, useState } from "react";
import { useStore } from "zustand";
import { userStore } from "@/store/userStore";
import { performanceStore } from "@/store/performance";
import { subDays, startOfDay, format, eachDayOfInterval } from "date-fns";
import { useTheme } from "@/contexts/ThemeContext";
import { PositionScore } from "@/types/user";

interface DayActivity {
  date: string;
  totalShots: number;
  totalHits: number;
  totalMisses: number;
  hitRatio: number;
  day: string;
}

export default function HeatmapAllActions() {
  const { user } = useStore(userStore);
  const { theme } = useTheme();
  const { positionHeatmapData, fetchPositionHeatmap } = useStore(performanceStore);
  const [loading, setLoading] = useState(false);

  const dateRange = useMemo(() => {
    const end = new Date();
    const start = subDays(end, 30);
    return { start: startOfDay(start), end: startOfDay(end) };
  }, []);

  useEffect(() => {
    if (!user?.team_id) return;

    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchPositionHeatmap(user.team_id!, PositionScore.Lying, dateRange.start, dateRange.end),
          fetchPositionHeatmap(user.team_id!, PositionScore.Sitting, dateRange.start, dateRange.end),
          fetchPositionHeatmap(user.team_id!, PositionScore.Standing, dateRange.start, dateRange.end),
          // Removed Crouching position as it's not supported in the database
        ]);
      } catch (error) {
        console.error("Error loading position heatmap data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user?.team_id, dateRange.start, dateRange.end]);

  const activityData = useMemo(() => {
    const map = new Map<string, DayActivity>();

    eachDayOfInterval(dateRange).forEach((date) => {
      const key = format(date, "yyyy-MM-dd");
      map.set(key, {
        date: key,
        totalShots: 0,
        totalHits: 0,
        totalMisses: 0,
        hitRatio: 0,
        day: format(date, "d"),
      });
    });

    if (positionHeatmapData) {
      positionHeatmapData.forEach((dayData) => {
        const activity = map.get(dayData.date);
        if (activity) {
          activity.totalShots += dayData.totalShots;
          activity.totalHits += dayData.totalHits;
          activity.totalMisses += dayData.totalShots - dayData.totalHits;
        }
      });

      map.forEach((activity) => {
        if (activity.totalShots > 0) {
          activity.hitRatio = activity.totalHits / activity.totalShots;
        }
      });
    }

    return Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date));
  }, [positionHeatmapData, dateRange]);

  const getIntensityClass = (shots: number, hitRatio: number) => {
    if (theme === "dark") {
      if (shots === 0) return "bg-slate-800 border-slate-700/50";

      if (hitRatio >= 0.8) return "bg-slate-600/80 border-slate-500/50";
      else if (hitRatio >= 0.6) return "bg-slate-500/60 border-slate-400/40";
      else if (hitRatio >= 0.4) return "bg-slate-400/60 border-slate-300/40";
      else return "bg-slate-300/60 border-slate-200/40";
    } else {
      if (shots === 0) return "bg-slate-100 border-slate-200";

      if (hitRatio >= 0.8) return "bg-slate-400 border-slate-500";
      else if (hitRatio >= 0.6) return "bg-slate-300 border-slate-400";
      else if (hitRatio >= 0.4) return "bg-slate-200 border-slate-300";
      else return "bg-slate-100 border-slate-200";
    }
  };

  return (
    <div className={`rounded-xl p-6 border shadow-sm h-full ${theme === "dark" ? "bg-zinc-900/40 border-zinc-700" : "bg-white border-gray-200"}`}>
      <div className="mb-4">
        <h4 className={`text-lg font-semibold ${theme === "dark" ? "text-zinc-200" : "text-gray-800"}`}>30-Day Activity Heatmap</h4>
        <p className={`text-sm mt-1 ${theme === "dark" ? "text-zinc-400" : "text-gray-500"}`}>Daily shooting performance overview</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          <div className="grid grid-cols-10 gap-2 mb-4">
            {[...Array(30)].map((_, index) => (
              <div key={index} className={`aspect-square rounded-lg animate-pulse ${theme === "dark" ? "bg-zinc-700" : "bg-gray-200"}`} />
            ))}
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-400"></div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Enhanced Heatmap Grid */}
          <div className="grid grid-cols-10 gap-2 mb-4">
            {activityData.map((day, index) => (
              <div key={index} className="relative group">
                <div
                  className={`aspect-square rounded-lg border-2 transition-all duration-300 cursor-pointer 
                    relative overflow-hidden ${getIntensityClass(day.totalShots, day.hitRatio)} hover:scale-125 hover:z-10 hover:shadow-2xl`}
                >
                  {/* Visual fill for hits/misses */}
                  {day.totalShots > 0 && (
                    <div className="absolute inset-0 flex flex-col justify-end">
                      <div className={theme === "dark" ? "bg-slate-400/40" : "bg-slate-500/50"} style={{ height: `${day.hitRatio * 100}%` }} />
                    </div>
                  )}

                  {/* Day number */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className={`text-[10px] font-semibold ${
                        day.totalShots > 0
                          ? theme === "dark"
                            ? "text-white/90"
                            : "text-slate-800"
                          : theme === "dark"
                            ? "text-slate-500"
                            : "text-slate-400"
                      }`}
                    >
                      {day.day}
                    </div>
                  </div>
                </div>

                {/* Enhanced Tooltip */}
                {day.totalShots > 0 && (
                  <div
                    className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-4 py-3 
                      rounded-xl text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 
                      pointer-events-none whitespace-nowrap shadow-2xl backdrop-blur-md ${
                        theme === "dark"
                          ? "bg-zinc-800/95 text-white border border-zinc-600/50"
                          : "bg-white/95 text-gray-800 border border-gray-200/50"
                      }`}
                  >
                    <div className="font-bold mb-2 text-base">{format(new Date(day.date), "MMM d, yyyy")}</div>
                    <div className="text-xs opacity-90 space-y-1.5">
                      <div className="flex justify-between">
                        <span>Shots:</span>
                        <span className="font-semibold">{day.totalShots}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Hits:</span>
                        <span className="font-semibold">{day.totalHits}</span>
                      </div>
                      <div className="flex justify-between pt-1 border-t border-white/20">
                        <span>Hit Rate:</span>
                        <span className="font-bold text-emerald-400">{Math.round(day.hitRatio * 100)}%</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Enhanced Legend and Stats */}
          <div
            className={`flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pt-4 border-t ${theme === "dark" ? "border-zinc-700" : "border-gray-200"}`}
          >
            <div className="flex items-center gap-4">
              {/* Hit Rate Scale */}
              <div className="flex items-center gap-3">
                <span className={`text-sm font-semibold ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>Hit Rate Scale:</span>
                <div className="flex gap-2">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-4 h-4 rounded-md ${theme === "dark" ? "bg-slate-300/60" : "bg-slate-200"} border-2 border-slate-400/30`}></div>
                    <span className={`text-xs ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>&lt;40%</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-4 h-4 rounded-md ${theme === "dark" ? "bg-slate-400/60" : "bg-slate-300"} border-2 border-slate-400/30`}></div>
                    <span className={`text-xs ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>40-80%</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-4 h-4 rounded-md ${theme === "dark" ? "bg-slate-500/80" : "bg-slate-400"} border-2 border-slate-400/30`}></div>
                    <span className={`text-xs ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>80%+</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Stats */}
            {!loading && (
              <div className="grid grid-cols-2 w-full gap-6">
                <div className={`px-4 py-2 col-span-1 w-full rounded-lg ${theme === "dark" ? "bg-zinc-800/50" : "bg-gray-50"}`}>
                  <div className={`text-xs font-medium mb-1 ${theme === "dark" ? "text-zinc-400" : "text-gray-500"}`}>Total Shots</div>
                  <div className={`font-bold text-2xl ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    {activityData.reduce((sum, day) => sum + day.totalShots, 0).toLocaleString()}
                  </div>
                </div>
                <div className={`px-4 py-2 col-span-1 w-full rounded-lg ${theme === "dark" ? "bg-zinc-800/50" : "bg-gray-50"}`}>
                  <div className={`text-xs font-medium mb-1 ${theme === "dark" ? "text-zinc-400" : "text-gray-500"}`}>Average Hit Rate</div>
                  <div className={`font-bold text-2xl ${theme === "dark" ? "text-emerald-400" : "text-emerald-600"}`}>
                    {(() => {
                      const totalShots = activityData.reduce((sum, day) => sum + day.totalShots, 0);
                      const totalHits = activityData.reduce((sum, day) => sum + day.totalHits, 0);
                      return totalShots > 0 ? `${Math.round((totalHits / totalShots) * 100)}%` : "0%";
                    })()}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
