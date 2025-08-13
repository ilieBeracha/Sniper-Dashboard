import { useEffect, useMemo, useState } from "react";
import { useStore } from "zustand";
import { userStore } from "@/store/userStore";
import { performanceStore } from "@/store/performance";
import { subDays, startOfDay, format, eachDayOfInterval } from "date-fns";
import { useTheme } from "@/contexts/ThemeContext";

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
          fetchPositionHeatmap(user.team_id!, "Lying", dateRange.start, dateRange.end),
          fetchPositionHeatmap(user.team_id!, "Sitting", dateRange.start, dateRange.end),
          fetchPositionHeatmap(user.team_id!, "Standing", dateRange.start, dateRange.end),
          fetchPositionHeatmap(user.team_id!, "Operational", dateRange.start, dateRange.end),
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
      if (shots === 0) return "bg-zinc-800 border-zinc-700/50";
      
      if (hitRatio >= 0.8) return "bg-emerald-600/80 border-emerald-500/50";
      else if (hitRatio >= 0.6) return "bg-yellow-600/60 border-yellow-500/40";
      else if (hitRatio >= 0.4) return "bg-orange-600/60 border-orange-500/40";
      else return "bg-red-600/60 border-red-500/40";
    } else {
      if (shots === 0) return "bg-gray-100 border-gray-200";
      
      if (hitRatio >= 0.8) return "bg-emerald-400 border-emerald-500";
      else if (hitRatio >= 0.6) return "bg-yellow-400 border-yellow-500";
      else if (hitRatio >= 0.4) return "bg-orange-400 border-orange-500";
      else return "bg-red-400 border-red-500";
    }
  };

  return (
    <div className={theme === "dark" 
      ? "bg-zinc-900/50 backdrop-blur-sm p-3" 
      : "bg-white shadow-sm p-3"}>
      {/* Compact Header */}
      <div className="mb-2 flex items-center justify-between">
        <h3 className={`text-sm font-semibold ${
          theme === "dark" ? "text-white" : "text-gray-900"
        }`}>
          Daily Performance
        </h3>
        <p className={`text-xs ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>
          30 days
        </p>
      </div>

      {/* Compact Heatmap Grid */}
      {loading ? (
        <div className="grid grid-cols-10 gap-1 mb-2">
          {[...Array(30)].map((_, index) => (
            <div
              key={index}
              className={`aspect-square rounded animate-pulse ${
                theme === "dark" ? "bg-zinc-800" : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-10 gap-1 mb-2">
          {activityData.map((day, index) => (
            <div key={index} className="relative group">
              <div
                className={`aspect-square rounded border transition-all duration-200 cursor-pointer 
                  relative overflow-hidden ${
                  getIntensityClass(day.totalShots, day.hitRatio)
                } hover:scale-110 hover:z-10`}
              >
                {/* Visual fill for hits/misses */}
                {day.totalShots > 0 && (
                  <div className="absolute inset-0 flex flex-col justify-end">
                    <div 
                      className={theme === "dark" ? "bg-emerald-400/30" : "bg-emerald-500/40"}
                      style={{ height: `${day.hitRatio * 100}%` }}
                    />
                  </div>
                )}
                
                {/* Day number */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`text-[10px] font-medium ${
                    day.totalShots > 0 
                      ? theme === "dark" ? "text-white/80" : "text-gray-800"
                      : theme === "dark" ? "text-zinc-600" : "text-gray-400"
                  }`}>
                    {day.day}
                  </div>
                </div>
              </div>
              
              {/* Compact Tooltip */}
              {day.totalShots > 0 && (
                <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 
                  rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 
                  pointer-events-none whitespace-nowrap ${
                  theme === "dark" 
                    ? "bg-zinc-800 text-white" 
                    : "bg-gray-800 text-white"
                }`}>
                  <div className="font-medium">{format(new Date(day.date), "MMM d")}</div>
                  <div className="text-[10px] opacity-90">
                    {day.totalHits}/{day.totalShots} ({Math.round(day.hitRatio * 100)}%)
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Compact Legend and Stats */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          {/* Hit Rate Scale */}
          <div className="flex items-center gap-1">
            <span className={theme === "dark" ? "text-zinc-500" : "text-gray-500"}>Rate:</span>
            <div className="flex gap-0.5">
              <div className={`w-2 h-2 rounded ${
                theme === "dark" ? "bg-red-600/60" : "bg-red-400"
              }`} title="<40%"></div>
              <div className={`w-2 h-2 rounded ${
                theme === "dark" ? "bg-yellow-600/60" : "bg-yellow-400"
              }`} title="60-80%"></div>
              <div className={`w-2 h-2 rounded ${
                theme === "dark" ? "bg-emerald-600/80" : "bg-emerald-400"
              }`} title="80%+"></div>
            </div>
          </div>
        </div>

        {/* Compact Stats */}
        {!loading && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <span className={theme === "dark" ? "text-zinc-500" : "text-gray-500"}>Shots:</span>
              <span className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                {activityData.reduce((sum, day) => sum + day.totalShots, 0).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className={theme === "dark" ? "text-zinc-500" : "text-gray-500"}>Avg:</span>
              <span className={`font-medium ${
                theme === "dark" ? "text-emerald-400" : "text-emerald-600"
              }`}>
                {(() => {
                  const totalShots = activityData.reduce((sum, day) => sum + day.totalShots, 0);
                  const totalHits = activityData.reduce((sum, day) => sum + day.totalHits, 0);
                  return totalShots > 0 ? `${Math.round((totalHits / totalShots) * 100)}%` : '0%';
                })()}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
