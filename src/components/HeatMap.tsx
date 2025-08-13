import { useEffect, useMemo, useState } from "react";
import { useStore } from "zustand";
import { userStore } from "@/store/userStore";
import { performanceStore } from "@/store/performance";
import { subDays, startOfDay, format, eachDayOfInterval } from "date-fns";
import { useTheme } from "@/contexts/ThemeContext";
import { Target, TrendingUp, TrendingDown } from "lucide-react";

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
    const start = subDays(end, 30); // Last 30 days
    return { start: startOfDay(start), end: startOfDay(end) };
  }, []);

  useEffect(() => {
    if (!user?.team_id) return;
    
    const loadData = async () => {
      setLoading(true);
      try {
        // Fetch data for all positions to aggregate
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

  // Aggregate all shots data by day
  const activityData = useMemo(() => {
    const map = new Map<string, DayActivity>();

    // Initialize all dates
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

    // Aggregate position data if available
    if (positionHeatmapData) {
      positionHeatmapData.forEach((dayData) => {
        const activity = map.get(dayData.date);
        if (activity) {
          activity.totalShots += dayData.totalShots;
          activity.totalHits += dayData.totalHits;
          activity.totalMisses += dayData.totalShots - dayData.totalHits;
        }
      });

      // Calculate hit ratio
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
      // Color intensity based on number of shots, shade based on performance
      const intensity = Math.min(shots / 100, 1); // Normalize to 0-1
      
      if (hitRatio >= 0.8) {
        return intensity > 0.7 ? "bg-emerald-600 border-emerald-500/50 shadow-emerald-500/30" 
             : intensity > 0.4 ? "bg-emerald-700/70 border-emerald-600/40 shadow-emerald-500/20"
             : "bg-emerald-800/50 border-emerald-700/30 shadow-emerald-500/10";
      } else if (hitRatio >= 0.6) {
        return intensity > 0.7 ? "bg-yellow-600/70 border-yellow-500/50 shadow-yellow-500/30"
             : intensity > 0.4 ? "bg-yellow-700/50 border-yellow-600/40 shadow-yellow-500/20"
             : "bg-yellow-800/40 border-yellow-700/30 shadow-yellow-500/10";
      } else if (hitRatio >= 0.4) {
        return intensity > 0.7 ? "bg-orange-600/70 border-orange-500/50 shadow-orange-500/30"
             : intensity > 0.4 ? "bg-orange-700/50 border-orange-600/40 shadow-orange-500/20"
             : "bg-orange-800/40 border-orange-700/30 shadow-orange-500/10";
      } else {
        return intensity > 0.7 ? "bg-red-600/70 border-red-500/50 shadow-red-500/30"
             : intensity > 0.4 ? "bg-red-700/50 border-red-600/40 shadow-red-500/20"
             : "bg-red-800/40 border-red-700/30 shadow-red-500/10";
      }
    } else {
      if (shots === 0) return "bg-gray-100 border-gray-200";
      const intensity = Math.min(shots / 100, 1);
      
      if (hitRatio >= 0.8) {
        return intensity > 0.7 ? "bg-emerald-500 border-emerald-600"
             : intensity > 0.4 ? "bg-emerald-400 border-emerald-500"
             : "bg-emerald-300 border-emerald-400";
      } else if (hitRatio >= 0.6) {
        return intensity > 0.7 ? "bg-yellow-500 border-yellow-600"
             : intensity > 0.4 ? "bg-yellow-400 border-yellow-500"
             : "bg-yellow-300 border-yellow-400";
      } else if (hitRatio >= 0.4) {
        return intensity > 0.7 ? "bg-orange-500 border-orange-600"
             : intensity > 0.4 ? "bg-orange-400 border-orange-500"
             : "bg-orange-300 border-orange-400";
      } else {
        return intensity > 0.7 ? "bg-red-500 border-red-600"
             : intensity > 0.4 ? "bg-red-400 border-red-500"
             : "bg-red-300 border-red-400";
      }
    }
  };

  return (
    <div className={theme === "dark" 
      ? "bg-zinc-900/50 backdrop-blur-sm p-4" 
      : "bg-white shadow-sm p-4"}>
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className={`w-1 h-6 rounded-full ${
              theme === "dark" 
                ? "bg-gradient-to-b from-emerald-400 to-emerald-600" 
                : "bg-gradient-to-b from-emerald-400 to-emerald-600"
            }`}></div>
            <h3 className={`text-base font-bold tracking-tight ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}>
              Daily Shooting Performance
            </h3>
          </div>
          <div className={`flex-1 h-px ${
            theme === "dark" 
              ? "bg-gradient-to-r from-zinc-700 via-zinc-600 to-transparent" 
              : "bg-gradient-to-r from-gray-200 via-gray-100 to-transparent"
          }`}></div>
          <p className={`text-xs font-medium ${theme === "dark" ? "text-zinc-400" : "text-gray-500"}`}>
            Hits vs Misses - Last 30 days
          </p>
        </div>
      </div>

      {/* Heatmap Grid */}
      {loading ? (
        <div className="mb-4">
          <div className="grid grid-cols-7 sm:grid-cols-10 gap-1.5 sm:gap-2">
            {[...Array(30)].map((_, index) => (
              <div
                key={index}
                className={`aspect-square rounded-lg animate-pulse ${
                  theme === "dark" ? "bg-zinc-800" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="mb-4">
          <div className="grid grid-cols-7 sm:grid-cols-10 gap-1.5 sm:gap-2">
            {activityData.map((day, index) => {
              return (
                <div key={index} className="relative group">
                  <div
                    className={`aspect-square rounded-lg border transition-all duration-300 cursor-pointer 
                      relative overflow-hidden transform hover:scale-110 hover:z-10 ${
                      getIntensityClass(day.totalShots, day.hitRatio)
                    } ${theme === "dark" 
                        ? "hover:shadow-lg shadow-emerald-500/20" 
                        : "hover:shadow-md"
                      }`}
                  >
                    {/* Visual representation of hits/misses */}
                    {day.totalShots > 0 && (
                      <div className="absolute inset-0 flex flex-col justify-end">
                        {/* Hit portion */}
                        <div 
                          className={`w-full transition-all duration-300 ${
                            theme === "dark" ? "bg-emerald-500/40" : "bg-emerald-400/60"
                          }`}
                          style={{ height: `${day.hitRatio * 100}%` }}
                        />
                        {/* Miss portion */}
                        <div 
                          className={`w-full transition-all duration-300 ${
                            theme === "dark" ? "bg-red-500/30" : "bg-red-400/40"
                          }`}
                          style={{ height: `${(1 - day.hitRatio) * 100}%` }}
                        />
                      </div>
                    )}
                    
                    {/* Day number with stats on hover */}
                    <div className={`absolute inset-0 flex items-center justify-center 
                      ${day.totalShots > 0 ? 'opacity-0 group-hover:opacity-100' : ''} 
                      transition-opacity duration-200 ${
                      theme === "dark" ? "bg-black/60" : "bg-white/90"
                    }`}>
                      <div className="text-center">
                        <div className={`text-sm font-bold ${
                          theme === "dark" 
                            ? "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" 
                            : "text-gray-900"
                        }`}>
                          {day.day}
                        </div>
                        {day.totalShots > 0 && (
                          <div className="space-y-0.5 mt-1">
                            <div className={`text-xs font-medium ${
                              theme === "dark" ? "text-emerald-300" : "text-emerald-600"
                            }`}>
                              {day.totalHits} hits
                            </div>
                            <div className={`text-xs font-medium ${
                              theme === "dark" ? "text-red-300" : "text-red-600"
                            }`}>
                              {day.totalMisses} miss
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Default day number when no data */}
                    {day.totalShots === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className={`text-sm ${
                          theme === "dark" ? "text-zinc-600" : "text-gray-400"
                        }`}>
                          {day.day}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Enhanced Tooltip */}
                  {day.totalShots > 0 && (
                    <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-3 py-2 
                      rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 z-20 
                      pointer-events-none whitespace-nowrap ${
                      theme === "dark" 
                        ? "bg-zinc-800 text-white border border-zinc-700" 
                        : "bg-gray-800 text-white"
                    }`}>
                      <div className="text-xs font-bold mb-2">
                        {format(new Date(day.date), "MMM dd, yyyy")}
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <Target className="w-3 h-3 text-blue-400" />
                          <span className="text-xs">Total Shots: {day.totalShots}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-3 h-3 text-emerald-400" />
                          <span className="text-xs">Hits: {day.totalHits} ({Math.round(day.hitRatio * 100)}%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingDown className="w-3 h-3 text-red-400" />
                          <span className="text-xs">Misses: {day.totalMisses} ({Math.round((1 - day.hitRatio) * 100)}%)</span>
                        </div>
                      </div>
                      <div className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 
                        rotate-45 ${theme === "dark" ? "bg-zinc-800 border-b border-r border-zinc-700" : "bg-gray-800"}`}></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Legend Section */}
      <div className="space-y-3">
        {/* Performance Legend */}
        <div className={`flex items-center justify-between p-3 rounded-lg ${
          theme === "dark" ? "bg-zinc-800/30" : "bg-gray-50"
        }`}>
          <div className="flex items-center gap-4">
            <div>
              <span className={`text-xs font-medium ${
                theme === "dark" ? "text-zinc-400" : "text-gray-600"
              }`}>Hit Rate</span>
              <div className="flex gap-1.5 mt-1">
                <div className="flex items-center gap-1">
                  <div className={`w-4 h-4 rounded border ${
                    theme === "dark"
                      ? "bg-red-700/50 border-red-600/40"
                      : "bg-red-400 border-red-500"
                  }`}></div>
                  <span className={`text-xs ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>&lt;40%</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className={`w-4 h-4 rounded border ${
                    theme === "dark"
                      ? "bg-yellow-700/50 border-yellow-600/40"
                      : "bg-yellow-400 border-yellow-500"
                  }`}></div>
                  <span className={`text-xs ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>60-80%</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className={`w-4 h-4 rounded border ${
                    theme === "dark"
                      ? "bg-emerald-600 border-emerald-500/50"
                      : "bg-emerald-500 border-emerald-600"
                  }`}></div>
                  <span className={`text-xs ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>80%+</span>
                </div>
              </div>
            </div>
            <div>
              <span className={`text-xs font-medium ${
                theme === "dark" ? "text-zinc-400" : "text-gray-600"
              }`}>Visual</span>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1">
                  <div className={`w-3 h-3 rounded ${
                    theme === "dark" ? "bg-emerald-500/40" : "bg-emerald-400/60"
                  }`}></div>
                  <span className={`text-xs ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>Hits</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className={`w-3 h-3 rounded ${
                    theme === "dark" ? "bg-red-500/30" : "bg-red-400/40"
                  }`}></div>
                  <span className={`text-xs ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>Misses</span>
                </div>
              </div>
            </div>
          </div>
          <div className={`text-xs ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>
            Hover for details
          </div>
        </div>

        {/* Summary Stats */}
        {!loading && (
          <div className={`grid grid-cols-3 gap-3 p-3 rounded-lg ${
            theme === "dark" ? "bg-zinc-800/30" : "bg-gray-50"
          }`}>
            <div>
              <div className={`text-xs font-medium mb-1 ${
                theme === "dark" ? "text-zinc-400" : "text-gray-600"
              }`}>Total Shots</div>
              <div className={`text-xl font-bold ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}>
                {activityData.reduce((sum, day) => sum + day.totalShots, 0).toLocaleString()}
              </div>
            </div>
            <div>
              <div className={`text-xs font-medium mb-1 ${
                theme === "dark" ? "text-zinc-400" : "text-gray-600"
              }`}>Total Hits</div>
              <div className={`text-xl font-bold ${
                theme === "dark" ? "text-emerald-400" : "text-emerald-600"
              }`}>
                {activityData.reduce((sum, day) => sum + day.totalHits, 0).toLocaleString()}
              </div>
            </div>
            <div>
              <div className={`text-xs font-medium mb-1 ${
                theme === "dark" ? "text-zinc-400" : "text-gray-600"
              }`}>Average Hit Rate</div>
              <div className={`text-xl font-bold ${
                theme === "dark" ? "text-blue-400" : "text-blue-600"
              }`}>
                {(() => {
                  const totalShots = activityData.reduce((sum, day) => sum + day.totalShots, 0);
                  const totalHits = activityData.reduce((sum, day) => sum + day.totalHits, 0);
                  return totalShots > 0 ? `${Math.round((totalHits / totalShots) * 100)}%` : '0%';
                })()}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
