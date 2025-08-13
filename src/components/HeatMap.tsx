import { useEffect, useMemo, useState } from "react";
import { useStore } from "zustand";
import { userStore } from "@/store/userStore";
import { TrainingStore } from "@/store/trainingStore";
import { sessionStore } from "@/store/sessionStore";
import { subDays, startOfDay, format, eachDayOfInterval } from "date-fns";
import { useTheme } from "@/contexts/ThemeContext";

interface ActivityType {
  type: "training" | "session" | "stats" | "other";
  count: number;
}

interface DayActivity {
  date: string;
  activities: ActivityType[];
  totalCount: number;
  day: string;
}

export default function HeatmapAllActions() {
  const { user } = useStore(userStore);
  const { loadNextAndLastTraining, trainings } = useStore(TrainingStore);
  const { sessionStats } = useStore(sessionStore);
  const { theme } = useTheme();
  const [ready, setReady] = useState(false);

  const dateRange = useMemo(() => {
    const end = new Date();
    const start = subDays(end, 30); // Last 30 days
    return { start: startOfDay(start), end: startOfDay(end) };
  }, []);

  useEffect(() => {
    if (!user?.team_id) return;
    loadNextAndLastTraining(user.team_id);
    setReady(true);
  }, [user?.team_id]);

  // Generate all dates and their activity values with types
  const activityData = useMemo(() => {
    if (!ready) return [];

    const map = new Map<string, ActivityType[]>();

    // Initialize all dates
    eachDayOfInterval(dateRange).forEach((date) => {
      const key = format(date, "yyyy-MM-dd");
      map.set(key, []);
    });

    // Mock data for demonstration - replace with real data
    eachDayOfInterval(dateRange).forEach((date) => {
      const key = format(date, "yyyy-MM-dd");
      const activities: ActivityType[] = [];
      
      // Random mock data generation
      if (Math.random() > 0.3) {
        activities.push({ type: "training", count: Math.floor(Math.random() * 3) + 1 });
      }
      if (Math.random() > 0.5) {
        activities.push({ type: "session", count: Math.floor(Math.random() * 2) + 1 });
      }
      if (Math.random() > 0.7) {
        activities.push({ type: "stats", count: Math.floor(Math.random() * 5) + 1 });
      }
      if (Math.random() > 0.8) {
        activities.push({ type: "other", count: Math.floor(Math.random() * 2) + 1 });
      }
      
      map.set(key, activities);
    });

    return Array.from(map.entries())
      .map(([date, activities]): DayActivity => ({
        date,
        activities,
        totalCount: activities.reduce((sum, act) => sum + act.count, 0),
        day: format(new Date(date), "d"),
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [ready, dateRange, trainings, sessionStats]);

  const getIntensityClass = (value: number) => {
    if (theme === "dark") {
      if (value === 0) return "bg-zinc-800 border-zinc-700/50";
      if (value <= 3) return "bg-emerald-900/30 border-emerald-800/30 shadow-emerald-500/10";
      if (value <= 6) return "bg-emerald-700/50 border-emerald-600/40 shadow-emerald-500/20";
      if (value <= 9) return "bg-emerald-600 border-emerald-500/50 shadow-emerald-500/30";
      return "bg-emerald-500 border-emerald-400/50 shadow-emerald-500/40";
    } else {
      if (value === 0) return "bg-gray-100 border-gray-200";
      if (value <= 3) return "bg-emerald-100 border-emerald-200";
      if (value <= 6) return "bg-emerald-300 border-emerald-400";
      if (value <= 9) return "bg-emerald-400 border-emerald-500";
      return "bg-emerald-500 border-emerald-600";
    }
  };

  const activityColors = {
    training: { dark: "bg-blue-500", light: "bg-blue-400" },
    session: { dark: "bg-purple-500", light: "bg-purple-400" },
    stats: { dark: "bg-orange-500", light: "bg-orange-400" },
    other: { dark: "bg-pink-500", light: "bg-pink-400" },
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
              Activity Heatmap
            </h3>
          </div>
          <div className={`flex-1 h-px ${
            theme === "dark" 
              ? "bg-gradient-to-r from-zinc-700 via-zinc-600 to-transparent" 
              : "bg-gradient-to-r from-gray-200 via-gray-100 to-transparent"
          }`}></div>
          <p className={`text-xs font-medium ${theme === "dark" ? "text-zinc-400" : "text-gray-500"}`}>
            Last 30 days
          </p>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="mb-4">
        <div className="grid grid-cols-7 sm:grid-cols-10 gap-1.5 sm:gap-2">
          {activityData.map((day, index) => (
            <div key={index} className="relative group">
              <div
                className={`aspect-square rounded-lg border transition-all duration-300 cursor-pointer 
                  relative overflow-hidden transform hover:scale-110 hover:z-10 ${getIntensityClass(day.totalCount)} 
                  ${theme === "dark" 
                    ? "hover:shadow-lg shadow-emerald-500/20" 
                    : "hover:shadow-md"
                  }`}

              >
                {/* Activity type indicators with better positioning */}
                {day.activities.length > 0 && (
                  <div className="absolute inset-0 p-1 flex flex-wrap gap-0.5">
                    {day.activities.slice(0, 4).map((activity, idx) => (
                      <div
                        key={idx}
                        className={`w-1.5 h-1.5 rounded-full ${
                          activityColors[activity.type][theme === "dark" ? "dark" : "light"]
                        } animate-pulse`}
                        style={{ animationDelay: `${idx * 100}ms` }}
                      />
                    ))}
                  </div>
                )}
                
                {/* Day number with glow effect on hover */}
                <div className={`absolute inset-0 flex items-center justify-center 
                  opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
                  <div className={`text-sm font-bold ${
                    theme === "dark" 
                      ? "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" 
                      : "text-gray-900"
                  }`}>
                    {day.day}
                  </div>
                </div>
              </div>
              
              {/* Enhanced Tooltip */}
              <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-3 py-2 
                rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 z-20 
                pointer-events-none whitespace-nowrap ${
                theme === "dark" 
                  ? "bg-zinc-800 text-white border border-zinc-700" 
                  : "bg-gray-800 text-white"
              }`}>
                <div className="text-xs font-bold mb-1">
                  {format(new Date(day.date), "MMM dd")}
                </div>
                {day.activities.length > 0 ? (
                  <div className="space-y-0.5">
                    {day.activities.map((activity, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-xs">
                        <div className={`w-2 h-2 rounded-full ${
                          activityColors[activity.type][theme === "dark" ? "dark" : "light"]
                        }`}></div>
                        <span className="capitalize">{activity.type}: {activity.count}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs opacity-75">No activities</div>
                )}
                <div className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 
                  rotate-45 ${theme === "dark" ? "bg-zinc-800 border-b border-r border-zinc-700" : "bg-gray-800"}`}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend Section with better styling */}
      <div className="space-y-3">
        {/* Intensity Legend */}
        <div className={`flex items-center justify-between p-3 rounded-lg ${
          theme === "dark" ? "bg-zinc-800/30" : "bg-gray-50"
        }`}>
          <div className="flex items-center gap-3">
            <span className={`text-xs font-medium ${
              theme === "dark" ? "text-zinc-400" : "text-gray-600"
            }`}>Activity Level</span>
            <div className="flex gap-1.5">
              {[0, 3, 6, 9, 12].map((val, idx) => (
                <div 
                  key={idx} 
                  className={`w-4 h-4 rounded border transition-transform hover:scale-125 ${
                    getIntensityClass(val)
                  }`}
                ></div>
              ))}
            </div>
            <span className={`text-xs font-medium ${
              theme === "dark" ? "text-zinc-400" : "text-gray-600"
            }`}>High</span>
          </div>
          <div className={`text-xs ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>
            Hover for details
          </div>
        </div>

        {/* Activity Type Legend with icons */}
        <div className={`grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 rounded-lg ${
          theme === "dark" ? "bg-zinc-800/30" : "bg-gray-50"
        }`}>
          {Object.entries(activityColors).map(([type, colors]) => (
            <div key={type} className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
              theme === "dark" ? "hover:bg-zinc-700/30" : "hover:bg-gray-100"
            }`}>
              <div className={`w-3 h-3 rounded-full ${
                colors[theme === "dark" ? "dark" : "light"]
              } shadow-sm`}></div>
              <span className={`text-xs capitalize font-medium ${
                theme === "dark" ? "text-zinc-400" : "text-gray-600"
              }`}>{type}</span>
            </div>
          ))}
        </div>
      </div>


    </div>
  );
}
