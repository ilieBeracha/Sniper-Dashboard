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
    if (value === 0) return theme === "dark" ? "bg-zinc-800" : "bg-gray-200";
    if (value <= 3) return theme === "dark" ? "bg-emerald-900/30" : "bg-emerald-100";
    if (value <= 6) return theme === "dark" ? "bg-emerald-700/50" : "bg-emerald-300";
    if (value <= 9) return theme === "dark" ? "bg-emerald-600" : "bg-emerald-400";
    return theme === "dark" ? "bg-emerald-500" : "bg-emerald-500";
  };

  const activityColors = {
    training: { dark: "bg-blue-500", light: "bg-blue-400" },
    session: { dark: "bg-purple-500", light: "bg-purple-400" },
    stats: { dark: "bg-orange-500", light: "bg-orange-400" },
    other: { dark: "bg-pink-500", light: "bg-pink-400" },
  };

  return (
    <div className={`rounded-xl border p-6 shadow-lg ${
      theme === "dark" 
        ? "bg-zinc-900/30 border-zinc-800/30" 
        : "bg-white border-gray-200"
    }`}>
      {/* Header */}
      <div className="mb-4">
        <h3 className={`text-lg font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
          Monthly Activity Heatmap
        </h3>
        <p className={`text-sm ${theme === "dark" ? "text-zinc-400" : "text-gray-500"}`}>
          Last 30 days of activity across all types
        </p>
      </div>

      {/* Heatmap Grid */}
      <div className="mb-6">
        <div className="grid grid-cols-7 sm:grid-cols-10 gap-1.5 sm:gap-2">
          {activityData.map((day, index) => (
            <div key={index} className="relative group">
              <div
                className={`aspect-square rounded-lg ${getIntensityClass(day.totalCount)} 
                  hover:ring-2 transition-all cursor-pointer relative overflow-hidden ${
                  theme === "dark" ? "hover:ring-zinc-400" : "hover:ring-gray-400"
                }`}
              >
                {/* Activity type indicators */}
                {day.activities.length > 0 && (
                  <div className="absolute inset-0 flex flex-wrap gap-0.5 p-1">
                    {day.activities.map((activity, idx) => (
                      <div
                        key={idx}
                        className={`w-1.5 h-1.5 rounded-sm ${
                          activityColors[activity.type][theme === "dark" ? "dark" : "light"]
                        }`}
                      />
                    ))}
                  </div>
                )}
                
                {/* Day number on hover */}
                <div className={`text-xs sm:text-sm font-medium opacity-0 group-hover:opacity-100 
                  transition-opacity flex items-center justify-center h-full absolute inset-0 ${
                  theme === "dark" ? "text-white bg-black/50" : "text-gray-900 bg-white/80"
                }`}>
                  {day.day}
                </div>
              </div>
              
              {/* Tooltip */}
              <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 
                rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 
                pointer-events-none whitespace-nowrap ${
                theme === "dark" ? "bg-zinc-800 text-white" : "bg-gray-800 text-white"
              }`}>
                <div className="text-xs font-medium mb-1">
                  {format(new Date(day.date), "MMM dd, yyyy")}
                </div>
                {day.activities.length > 0 ? (
                  <div className="space-y-0.5">
                    {day.activities.map((activity, idx) => (
                      <div key={idx} className="text-xs">
                        {activity.type}: {activity.count}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs opacity-75">No activities</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend Section */}
      <div className="space-y-4">
        {/* Intensity Legend */}
        <div className={`flex items-center justify-between p-3 rounded-lg ${
          theme === "dark" ? "bg-zinc-800/50" : "bg-gray-50"
        }`}>
          <div className="flex items-center gap-3">
            <span className={`text-xs font-medium ${
              theme === "dark" ? "text-zinc-400" : "text-gray-600"
            }`}>Less</span>
            <div className="flex gap-1">
              <div className={`w-3 h-3 rounded ${theme === "dark" ? "bg-zinc-800" : "bg-gray-200"}`}></div>
              <div className={`w-3 h-3 rounded ${theme === "dark" ? "bg-emerald-900/30" : "bg-emerald-100"}`}></div>
              <div className={`w-3 h-3 rounded ${theme === "dark" ? "bg-emerald-700/50" : "bg-emerald-300"}`}></div>
              <div className={`w-3 h-3 rounded ${theme === "dark" ? "bg-emerald-600" : "bg-emerald-400"}`}></div>
              <div className={`w-3 h-3 rounded ${theme === "dark" ? "bg-emerald-500" : "bg-emerald-500"}`}></div>
            </div>
            <span className={`text-xs font-medium ${
              theme === "dark" ? "text-zinc-400" : "text-gray-600"
            }`}>More</span>
          </div>
          <div className={`hidden sm:block text-xs ${
            theme === "dark" ? "text-zinc-500" : "text-gray-500"
          }`}>
            Hover for details
          </div>
        </div>

        {/* Activity Type Legend */}
        <div className={`p-3 rounded-lg ${theme === "dark" ? "bg-zinc-800/50" : "bg-gray-50"}`}>
          <h4 className={`text-xs font-medium mb-2 ${
            theme === "dark" ? "text-zinc-300" : "text-gray-700"
          }`}>
            Activity Types
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.entries(activityColors).map(([type, colors]) => (
              <div key={type} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded ${colors[theme === "dark" ? "dark" : "light"]}`}></div>
                <span className={`text-xs capitalize ${
                  theme === "dark" ? "text-zinc-400" : "text-gray-600"
                }`}>
                  {type}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
