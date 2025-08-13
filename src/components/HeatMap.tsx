import { useEffect, useMemo, useState } from "react";
import { useStore } from "zustand";
import { userStore } from "@/store/userStore";
import { performanceStore } from "@/store/performance";
import { subDays, startOfDay, format, eachDayOfInterval } from "date-fns";
import { useTheme } from "@/contexts/ThemeContext";
import { Crosshair, Eye, Users, Target } from "lucide-react";

interface DayActivity {
  date: string;
  positions: {
    Lying?: { engagements: number; hitRatio: number; shots: number; hits: number };
    Sitting?: { engagements: number; hitRatio: number; shots: number; hits: number };
    Standing?: { engagements: number; hitRatio: number; shots: number; hits: number };
    Operational?: { engagements: number; hitRatio: number; shots: number; hits: number };
  };
  totalEngagements: number;
  avgHitRatio: number;
  day: string;
}

export default function HeatmapAllActions() {
  const { user } = useStore(userStore);
  const { theme } = useTheme();
  const { positionHeatmapData, fetchPositionHeatmap } = useStore(performanceStore);
  const [selectedPosition, setSelectedPosition] = useState<"Lying" | "Sitting" | "Standing" | "Operational" | "All">("All");
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
        // Fetch data for all positions
        await Promise.all([
          fetchPositionHeatmap(user.team_id, "Lying", dateRange.start, dateRange.end),
          fetchPositionHeatmap(user.team_id, "Sitting", dateRange.start, dateRange.end),
          fetchPositionHeatmap(user.team_id, "Standing", dateRange.start, dateRange.end),
          fetchPositionHeatmap(user.team_id, "Operational", dateRange.start, dateRange.end),
        ]);
      } catch (error) {
        console.error("Error loading position heatmap data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [user?.team_id, dateRange.start, dateRange.end]);

  // Aggregate data by day across all positions
  const activityData = useMemo(() => {
    const map = new Map<string, DayActivity>();

    // Initialize all dates
    eachDayOfInterval(dateRange).forEach((date) => {
      const key = format(date, "yyyy-MM-dd");
      map.set(key, {
        date: key,
        positions: {},
        totalEngagements: 0,
        avgHitRatio: 0,
        day: format(date, "d"),
      });
    });

    // Process position data if available
    if (positionHeatmapData) {
      positionHeatmapData.forEach((dayData) => {
        const activity = map.get(dayData.date);
        if (activity) {
          activity.positions[dayData.position] = {
            engagements: dayData.engagements,
            hitRatio: dayData.hitRatio,
            shots: dayData.totalShots,
            hits: dayData.totalHits,
          };
          activity.totalEngagements += dayData.engagements;
        }
      });

      // Calculate average hit ratio
      map.forEach((activity) => {
        const positions = Object.values(activity.positions);
        if (positions.length > 0) {
          const totalShots = positions.reduce((sum, p) => sum + p.shots, 0);
          const totalHits = positions.reduce((sum, p) => sum + p.hits, 0);
          activity.avgHitRatio = totalShots > 0 ? totalHits / totalShots : 0;
        }
      });
    }

    return Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date));
  }, [positionHeatmapData, dateRange]);

  const getIntensityClass = (engagements: number, hitRatio: number) => {
    if (theme === "dark") {
      if (engagements === 0) return "bg-zinc-800 border-zinc-700/50";
      // Color based on performance (hit ratio)
      if (hitRatio >= 0.8) return "bg-emerald-600 border-emerald-500/50 shadow-emerald-500/30";
      if (hitRatio >= 0.6) return "bg-emerald-700/70 border-emerald-600/40 shadow-emerald-500/20";
      if (hitRatio >= 0.4) return "bg-yellow-700/50 border-yellow-600/40 shadow-yellow-500/20";
      if (hitRatio >= 0.2) return "bg-orange-700/50 border-orange-600/40 shadow-orange-500/20";
      return "bg-red-700/50 border-red-600/40 shadow-red-500/20";
    } else {
      if (engagements === 0) return "bg-gray-100 border-gray-200";
      if (hitRatio >= 0.8) return "bg-emerald-500 border-emerald-600";
      if (hitRatio >= 0.6) return "bg-emerald-400 border-emerald-500";
      if (hitRatio >= 0.4) return "bg-yellow-400 border-yellow-500";
      if (hitRatio >= 0.2) return "bg-orange-400 border-orange-500";
      return "bg-red-400 border-red-500";
    }
  };

  const positionIcons = {
    Lying: { icon: Eye, color: "text-blue-400" },
    Sitting: { icon: Users, color: "text-purple-400" },
    Standing: { icon: Target, color: "text-orange-400" },
    Operational: { icon: Crosshair, color: "text-pink-400" },
  };

  const positionColors = {
    Lying: { dark: "bg-blue-500", light: "bg-blue-400" },
    Sitting: { dark: "bg-purple-500", light: "bg-purple-400" },
    Standing: { dark: "bg-orange-500", light: "bg-orange-400" },
    Operational: { dark: "bg-pink-500", light: "bg-pink-400" },
  };

  const filteredData = useMemo(() => {
    if (selectedPosition === "All") return activityData;
    
    return activityData.map(day => ({
      ...day,
      totalEngagements: day.positions[selectedPosition]?.engagements || 0,
      avgHitRatio: day.positions[selectedPosition]?.hitRatio || 0,
    }));
  }, [activityData, selectedPosition]);

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
              Shooting Performance Heatmap
            </h3>
          </div>
          <div className={`flex-1 h-px ${
            theme === "dark" 
              ? "bg-gradient-to-r from-zinc-700 via-zinc-600 to-transparent" 
              : "bg-gradient-to-r from-gray-200 via-gray-100 to-transparent"
          }`}></div>
          <p className={`text-xs font-medium ${theme === "dark" ? "text-zinc-400" : "text-gray-500"}`}>
            Last 30 days by position
          </p>
        </div>
      </div>

      {/* Position Filter */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedPosition("All")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedPosition === "All"
                ? theme === "dark"
                  ? "bg-emerald-600 text-white"
                  : "bg-emerald-500 text-white"
                : theme === "dark"
                  ? "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            All Positions
          </button>
          {Object.entries(positionIcons).map(([position, { icon: Icon, color }]) => (
            <button
              key={position}
              onClick={() => setSelectedPosition(position as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                selectedPosition === position
                  ? theme === "dark"
                    ? "bg-zinc-700 text-white border border-zinc-600"
                    : "bg-gray-200 text-gray-900 border border-gray-300"
                  : theme === "dark"
                    ? "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <Icon className={`w-3 h-3 ${color}`} />
              {position}
            </button>
          ))}
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
            {filteredData.map((day, index) => {
              const dayPositions = selectedPosition === "All" 
                ? Object.entries(day.positions)
                : day.positions[selectedPosition] 
                  ? [[selectedPosition, day.positions[selectedPosition]]]
                  : [];

              return (
                <div key={index} className="relative group">
                  <div
                    className={`aspect-square rounded-lg border transition-all duration-300 cursor-pointer 
                      relative overflow-hidden transform hover:scale-110 hover:z-10 ${
                      getIntensityClass(day.totalEngagements, day.avgHitRatio)
                    } ${theme === "dark" 
                        ? "hover:shadow-lg shadow-emerald-500/20" 
                        : "hover:shadow-md"
                      }`}
                  >
                    {/* Position indicators */}
                    {dayPositions.length > 0 && selectedPosition === "All" && (
                      <div className="absolute inset-0 p-1 flex flex-wrap gap-0.5">
                        {dayPositions.slice(0, 4).map(([pos], idx) => (
                          <div
                            key={idx}
                            className={`w-1.5 h-1.5 rounded-full ${
                              positionColors[pos as keyof typeof positionColors][theme === "dark" ? "dark" : "light"]
                            } ${day.positions[pos as keyof typeof day.positions]!.hitRatio > 0.5 ? 'animate-pulse' : ''}`}
                          />
                        ))}
                      </div>
                    )}
                    
                    {/* Day number with performance indicator */}
                    <div className={`absolute inset-0 flex items-center justify-center 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
                      <div className="text-center">
                        <div className={`text-sm font-bold ${
                          theme === "dark" 
                            ? "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" 
                            : "text-gray-900"
                        }`}>
                          {day.day}
                        </div>
                        {day.totalEngagements > 0 && (
                          <div className={`text-xs font-medium ${
                            theme === "dark" ? "text-emerald-300" : "text-emerald-600"
                          }`}>
                            {Math.round(day.avgHitRatio * 100)}%
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Enhanced Tooltip */}
                  {day.totalEngagements > 0 && (
                    <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-3 py-2 
                      rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 z-20 
                      pointer-events-none whitespace-nowrap ${
                      theme === "dark" 
                        ? "bg-zinc-800 text-white border border-zinc-700" 
                        : "bg-gray-800 text-white"
                    }`}>
                      <div className="text-xs font-bold mb-1">
                        {format(new Date(day.date), "MMM dd, yyyy")}
                      </div>
                      <div className="space-y-1">
                        {Object.entries(day.positions).map(([pos, data]) => {
                          const { icon: Icon, color } = positionIcons[pos as keyof typeof positionIcons];
                          return (
                            <div key={pos} className="flex items-center gap-2 text-xs">
                              <Icon className={`w-3 h-3 ${color}`} />
                              <span className="font-medium">{pos}:</span>
                              <span>{Math.round(data.hitRatio * 100)}% ({data.hits}/{data.shots})</span>
                            </div>
                          );
                        })}
                      </div>
                      <div className={`mt-1 pt-1 border-t ${
                        theme === "dark" ? "border-zinc-700" : "border-gray-700"
                      }`}>
                        <div className="text-xs font-medium">
                          Total: {day.totalEngagements} engagements
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

      {/* Legend Section with better styling */}
      <div className="space-y-3">
        {/* Performance Legend */}
        <div className={`flex items-center justify-between p-3 rounded-lg ${
          theme === "dark" ? "bg-zinc-800/30" : "bg-gray-50"
        }`}>
          <div className="flex items-center gap-3">
            <span className={`text-xs font-medium ${
              theme === "dark" ? "text-zinc-400" : "text-gray-600"
            }`}>Hit Rate</span>
            <div className="flex gap-1.5">
              <div className="flex items-center gap-1">
                <div className={`w-4 h-4 rounded border ${
                  theme === "dark"
                    ? "bg-red-700/50 border-red-600/40"
                    : "bg-red-400 border-red-500"
                }`}></div>
                <span className={`text-xs ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>0-20%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className={`w-4 h-4 rounded border ${
                  theme === "dark"
                    ? "bg-yellow-700/50 border-yellow-600/40"
                    : "bg-yellow-400 border-yellow-500"
                }`}></div>
                <span className={`text-xs ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>40-60%</span>
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
          <div className={`text-xs ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>
            Hover for details
          </div>
        </div>

        {/* Position Legend */}
        <div className={`grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 rounded-lg ${
          theme === "dark" ? "bg-zinc-800/30" : "bg-gray-50"
        }`}>
          {Object.entries(positionIcons).map(([position, { icon: Icon, color }]) => (
            <div key={position} className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
              theme === "dark" ? "hover:bg-zinc-700/30" : "hover:bg-gray-100"
            }`}>
              <Icon className={`w-4 h-4 ${color}`} />
              <span className={`text-xs capitalize font-medium ${
                theme === "dark" ? "text-zinc-400" : "text-gray-600"
              }`}>{position}</span>
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        {!loading && (
          <div className={`grid grid-cols-2 gap-3 p-3 rounded-lg ${
            theme === "dark" ? "bg-zinc-800/30" : "bg-gray-50"
          }`}>
            <div>
              <div className={`text-xs font-medium mb-1 ${
                theme === "dark" ? "text-zinc-400" : "text-gray-600"
              }`}>Total Engagements</div>
              <div className={`text-xl font-bold ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}>
                {activityData.reduce((sum, day) => sum + day.totalEngagements, 0).toLocaleString()}
              </div>
            </div>
            <div>
              <div className={`text-xs font-medium mb-1 ${
                theme === "dark" ? "text-zinc-400" : "text-gray-600"
              }`}>Average Hit Rate</div>
              <div className={`text-xl font-bold ${
                theme === "dark" ? "text-emerald-400" : "text-emerald-600"
              }`}>
                {(() => {
                  const totalShots = activityData.reduce((sum, day) => 
                    sum + Object.values(day.positions).reduce((s, p) => s + p.shots, 0), 0
                  );
                  const totalHits = activityData.reduce((sum, day) => 
                    sum + Object.values(day.positions).reduce((s, p) => s + p.hits, 0), 0
                  );
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
