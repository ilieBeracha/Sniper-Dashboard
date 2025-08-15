import { useEffect, useMemo, useState } from "react";
import { useStore } from "zustand";
import { feedStore } from "@/store/feedStore";
import { userStore } from "@/store/userStore";
import { subDays, startOfDay, format, eachDayOfInterval, getHours } from "date-fns";
import { useTheme } from "@/contexts/ThemeContext";
import { Activity, TrendingUp, Users, Calendar, Clock, Zap, Award, Target } from "lucide-react";

interface ActivityDay {
  date: string;
  activities: number;
  types: Set<string>;
  hourlyDistribution: number[];
  peakHour: number;
  users: Set<string>;
}

export default function ActivityLogHeatmap() {
  const { feed, fetchFeedLog } = useStore(feedStore);
  const { user } = useStore(userStore);
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"daily" | "hourly" | "type">("daily");

  useEffect(() => {
    if (!user?.team_id) return;

    const loadData = async () => {
      setLoading(true);
      try {
        await fetchFeedLog(user.team_id || "");
      } catch (error) {
        console.error("Error loading activity feed:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user?.team_id]);

  const activityData = useMemo(() => {
    const map = new Map<string, ActivityDay>();
    const end = new Date();
    const start = subDays(end, 30);

    // Initialize all days
    eachDayOfInterval({ start: startOfDay(start), end: startOfDay(end) }).forEach((date) => {
      const key = format(date, "yyyy-MM-dd");
      map.set(key, {
        date: key,
        activities: 0,
        types: new Set(),
        hourlyDistribution: new Array(24).fill(0),
        peakHour: 0,
        users: new Set(),
      });
    });

    // Process feed data
    feed.forEach((item) => {
      const dateKey = format(new Date(item.created_at), "yyyy-MM-dd");
      const hour = getHours(new Date(item.created_at));
      const dayData = map.get(dateKey);

      if (dayData) {
        dayData.activities++;
        dayData.types.add(item.action_type);
        dayData.hourlyDistribution[hour]++;
        dayData.users.add(item.actor_id);

        // Update peak hour
        const maxHour = dayData.hourlyDistribution.indexOf(Math.max(...dayData.hourlyDistribution));
        dayData.peakHour = maxHour;
      }
    });

    return Array.from(map.values());
  }, [feed]);

  const maxActivities = Math.max(...activityData.map((d) => d.activities));

  const getIntensityClass = (activities: number, max: number) => {
    if (activities === 0) {
      return theme === "dark" ? "bg-zinc-800/30 border-zinc-700/50" : "bg-gray-50 border-gray-200/50";
    }

    const ratio = activities / max;

    if (theme === "dark") {
      if (ratio >= 0.8) return "bg-gradient-to-br from-fuchsia-500 via-violet-500 to-purple-600 border-purple-400 shadow-lg shadow-purple-500/30";
      if (ratio >= 0.6) return "bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 border-indigo-400 shadow-md shadow-indigo-500/25";
      if (ratio >= 0.4) return "bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600 border-blue-400 shadow-md shadow-blue-500/20";
      if (ratio >= 0.2) return "bg-gradient-to-br from-emerald-600 via-teal-500 to-cyan-500 border-teal-400 shadow-sm shadow-teal-500/15";
      return "bg-gradient-to-br from-slate-600 to-slate-500 border-slate-400";
    } else {
      if (ratio >= 0.8) return "bg-gradient-to-br from-fuchsia-400 via-violet-400 to-purple-500 border-purple-300 shadow-lg shadow-purple-400/25";
      if (ratio >= 0.6) return "bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-500 border-indigo-300 shadow-md shadow-indigo-400/20";
      if (ratio >= 0.4) return "bg-gradient-to-br from-cyan-400 via-blue-400 to-indigo-500 border-blue-300 shadow-md shadow-blue-400/15";
      if (ratio >= 0.2) return "bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-400 border-teal-300 shadow-sm shadow-teal-400/10";
      return "bg-gradient-to-br from-gray-200 to-gray-100 border-gray-200";
    }
  };

  const getHourlyColor = (hour: number) => {
    // Morning (6-12): Blue/Cyan gradient
    if (hour >= 6 && hour < 12) return theme === "dark" ? "from-sky-500 via-blue-500 to-cyan-500" : "from-sky-400 via-blue-400 to-cyan-400";
    // Afternoon (12-18): Golden/Orange gradient
    if (hour >= 12 && hour < 18) return theme === "dark" ? "from-amber-500 via-orange-500 to-red-500" : "from-amber-400 via-orange-400 to-red-400";
    // Evening (18-22): Purple/Pink gradient
    if (hour >= 18 && hour < 22)
      return theme === "dark" ? "from-violet-500 via-purple-500 to-pink-500" : "from-violet-400 via-purple-400 to-pink-400";
    // Night (22-6): Deep indigo gradient
    return theme === "dark" ? "from-indigo-600 via-indigo-700 to-blue-800" : "from-indigo-400 via-indigo-500 to-blue-500";
  };

  const activityTypeIcons: Record<string, any> = {
    score_submit: Target,
    training_created: Calendar,
    session_stats_logged: TrendingUp,
    participant_joined: Users,
    target_engaged: Target,
    achievement: Award,
  };

  const totalActivities = activityData.reduce((sum, day) => sum + day.activities, 0);
  const avgPerDay = Math.round(totalActivities / activityData.length);
  const mostActiveDay = activityData.reduce((max, day) => (day.activities > max.activities ? day : max));
  const uniqueUsers = new Set(feed.map((item) => item.actor_id)).size;

  return (
    <div className={`rounded-xl p-3 border shadow-sm ${theme === "dark" ? "bg-zinc-900/90 border-zinc-700" : "bg-white border-gray-200"}`}>
      {/* Header */}
      <div className="mb-2">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <Activity className={`w-4 h-4 ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`} />
            <h4 className={`text-xs font-semibold ${theme === "dark" ? "text-zinc-200" : "text-gray-800"}`}>Activity Log Heatmap</h4>
          </div>
          <div className="flex gap-2">
            {["daily", "hourly", "type"].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode as any)}
                className={`px-2 py-0.5 rounded-md text-[10px] font-medium transition-all ${
                  viewMode === mode
                    ? theme === "dark"
                      ? "bg-zinc-700 text-white"
                      : "bg-gray-200 text-gray-900"
                    : theme === "dark"
                      ? "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <p className={`text-[10px] ${theme === "dark" ? "text-zinc-400" : "text-gray-500"}`}>Team activity patterns over the last 30 days</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-zinc-400"></div>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-1.5 mb-2">
            <div className={`p-1.5 rounded-lg ${theme === "dark" ? "bg-zinc-800/50" : "bg-gray-50"}`}>
              <div className="flex items-center gap-1 mb-0.5">
                <Zap className="w-3 h-3 text-yellow-500" />
                <span className={`text-[10px] ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>Total</span>
              </div>
              <div className={`text-sm font-bold ${theme === "dark" ? "text-zinc-100" : "text-gray-900"}`}>{totalActivities}</div>
            </div>
            <div className={`p-1.5 rounded-lg ${theme === "dark" ? "bg-zinc-800/50" : "bg-gray-50"}`}>
              <div className="flex items-center gap-1 mb-0.5">
                <TrendingUp className="w-3 h-3 text-green-500" />
                <span className={`text-[10px] ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>Avg/Day</span>
              </div>
              <div className={`text-sm font-bold ${theme === "dark" ? "text-zinc-100" : "text-gray-900"}`}>{avgPerDay}</div>
            </div>
            <div className={`p-1.5 rounded-lg ${theme === "dark" ? "bg-zinc-800/50" : "bg-gray-50"}`}>
              <div className="flex items-center gap-1 mb-0.5">
                <Users className="w-3 h-3 text-blue-500" />
                <span className={`text-[10px] ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>Users</span>
              </div>
              <div className={`text-sm font-bold ${theme === "dark" ? "text-zinc-100" : "text-gray-900"}`}>{uniqueUsers}</div>
            </div>
            <div className={`p-1.5 rounded-lg ${theme === "dark" ? "bg-zinc-800/50" : "bg-gray-50"}`}>
              <div className="flex items-center gap-1 mb-0.5">
                <Clock className="w-3 h-3 text-purple-500" />
                <span className={`text-[10px] ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>Peak</span>
              </div>
              <div className={`text-[11px] font-bold ${theme === "dark" ? "text-zinc-100" : "text-gray-900"}`}>
                {format(new Date(mostActiveDay.date), "MMM d")}
              </div>
            </div>
          </div>

          {/* Heatmap Grid */}
          {viewMode === "daily" && (
            <div>
              <div className={`text-[10px] font-medium mb-1 ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>Daily Activity Intensity</div>
              <div className="grid grid-cols-10 gap-1">
                {activityData.map((day, index) => (
                  <div key={index} className="relative group">
                    <div
                      className={`aspect-square rounded-lg border cursor-pointer 
                        relative ${getIntensityClass(day.activities, maxActivities)}`}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div
                          className={`text-[8px] font-bold ${
                            day.activities > 0 ? "text-white drop-shadow-md" : theme === "dark" ? "text-zinc-500" : "text-gray-400"
                          }`}
                        >
                          {format(new Date(day.date), "d")}
                        </div>
                      </div>
                      {day.activities > 0 && <div className="absolute top-0 right-0 w-1 h-1 bg-white/50 rounded-full animate-pulse" />}
                    </div>

                    {day.activities > 0 && (
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
                        <div className="text-xs space-y-1.5">
                          <div className="flex justify-between gap-4">
                            <span>Activities:</span>
                            <span className="font-semibold">{day.activities}</span>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span>Types:</span>
                            <span className="font-semibold">{day.types.size}</span>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span>Users:</span>
                            <span className="font-semibold">{day.users.size}</span>
                          </div>
                          <div className="flex justify-between gap-4 pt-1 border-t border-white/20">
                            <span>Peak Hour:</span>
                            <span className="font-bold text-blue-400">{day.peakHour}:00</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {viewMode === "hourly" && (
            <div>
              <div className={`text-[10px] font-medium mb-1 ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>Hourly Activity Distribution</div>
              <div className="space-y-1">
                {[0, 6, 12, 18].map((startHour) => (
                  <div key={startHour} className="flex items-center gap-2">
                    <span className={`text-[10px] w-10 ${theme === "dark" ? "text-zinc-400" : "text-gray-500"}`}>{startHour}:00</span>
                    <div className="flex gap-1 flex-1">
                      {Array.from({ length: 6 }, (_, i) => {
                        const hour = startHour + i;
                        const totalForHour = activityData.reduce((sum, day) => sum + day.hourlyDistribution[hour], 0);
                        const maxHourly = Math.max(...activityData.flatMap((d) => d.hourlyDistribution));
                        const intensity = maxHourly > 0 ? totalForHour / maxHourly : 0;

                        return (
                          <div
                            key={hour}
                            className={`flex-1 h-6 rounded relative group ${
                              totalForHour > 0
                                ? `bg-gradient-to-br ${getHourlyColor(hour)} opacity-${Math.round(intensity * 100)}`
                                : theme === "dark"
                                  ? "bg-zinc-800"
                                  : "bg-gray-100"
                            }`}
                          >
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className={`text-[9px] font-semibold ${totalForHour > 0 ? "text-white/90" : theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>
                                {totalForHour || "-"}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {viewMode === "type" && (
            <div>
              <div className={`text-[10px] font-medium mb-1 ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>Activity Types Distribution</div>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(
                  feed.reduce(
                    (acc, item) => {
                      acc[item.action_type] = (acc[item.action_type] || 0) + 1;
                      return acc;
                    },
                    {} as Record<string, number>,
                  ),
                ).map(([type, count]) => {
                  const Icon = activityTypeIcons[type] || Activity;
                  const percentage = Math.round((count / totalActivities) * 100);

                  return (
                    <div
                      key={type}
                      className={`p-2 rounded-lg border ${
                        theme === "dark" ? "bg-zinc-800/50 border-zinc-700 hover:bg-zinc-800" : "bg-gray-50 border-gray-200 hover:bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-1 mb-1">
                        <Icon className="w-3 h-3 text-blue-500" />
                        <span className={`text-[10px] font-medium ${theme === "dark" ? "text-zinc-300" : "text-gray-700"}`}>
                          {type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                        </span>
                      </div>
                      <div className="flex items-end justify-between">
                        <span className={`text-sm font-bold ${theme === "dark" ? "text-zinc-100" : "text-gray-900"}`}>{count}</span>
                        <span className={`text-[10px] ${theme === "dark" ? "text-zinc-400" : "text-gray-500"}`}>{percentage}%</span>
                      </div>
                      <div className="mt-1 h-0.5 bg-gray-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all" style={{ width: `${percentage}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Legend */}
          <div className={`flex items-center justify-between pt-2 border-t ${theme === "dark" ? "border-zinc-700" : "border-gray-200"}`}>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>Level:</span>
              <div className="flex items-center gap-1">
                {[
                  {
                    label: "Very High",
                    class:
                      theme === "dark"
                        ? "bg-gradient-to-br from-fuchsia-500 via-violet-500 to-purple-600"
                        : "bg-gradient-to-br from-fuchsia-400 via-violet-400 to-purple-500",
                  },
                  {
                    label: "High",
                    class:
                      theme === "dark"
                        ? "bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600"
                        : "bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-500",
                  },
                  {
                    label: "Medium",
                    class:
                      theme === "dark"
                        ? "bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600"
                        : "bg-gradient-to-br from-cyan-400 via-blue-400 to-indigo-500",
                  },
                  {
                    label: "Low",
                    class:
                      theme === "dark"
                        ? "bg-gradient-to-br from-emerald-600 via-teal-500 to-cyan-500"
                        : "bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-400",
                  },
                  { label: "None", class: theme === "dark" ? "bg-zinc-800/30" : "bg-gray-50" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-0.5">
                    <div className={`w-2 h-2 rounded shadow-sm ${item.class}`} />
                    <span className={`text-[9px] ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>{item.label}</span>
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