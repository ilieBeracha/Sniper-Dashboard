import { useEffect, useMemo, useState } from "react";
import { useStore } from "zustand";
import { feedStore } from "@/store/feedStore";
import { userStore } from "@/store/userStore";
import { subDays, startOfDay, format, eachDayOfInterval, getHours } from "date-fns";
import { useTheme } from "@/contexts/ThemeContext";
import { Activity, TrendingUp, Users, Calendar, Clock, Zap, Crosshair, Trophy, Target, Wind, Percent, Eye, AlertCircle, BarChart3 } from "lucide-react";

interface ActivityDay {
  date: string;
  activities: number;
  types: Set<string>;
  hourlyDistribution: number[];
  peakHour: number;
  users: Set<string>;
}

interface ActivityCategory {
  name: string;
  types: string[];
  icon: any;
  color: string;
  description: string;
}

interface ShotMetrics {
  totalShots: number;
  totalHits: number;
  accuracy: number;
  avgDistance: number;
  maxDistance: number;
  minDistance: number;
  windConditions: Map<string, number>;
  userPerformance: Map<string, { shots: number; hits: number; accuracy: number }>;
  hourlyPerformance: number[];
  distanceRanges: { close: number; medium: number; long: number };
}

export default function ActivityLogHeatmap() {
  const { feed, fetchFeedLog } = useStore(feedStore);
  const { user } = useStore(userStore);
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"daily" | "hourly" | "type" | "performance">("type");
  const [selectedMetric, setSelectedMetric] = useState<"accuracy" | "distance" | "wind">("accuracy");

  useEffect(() => {
    if (!user?.team_id) return;

    const loadData = async () => {
      setLoading(true);
      try {
        fetchFeedLog(user.team_id || "");
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

  const activityCategories: ActivityCategory[] = [
    {
      name: "Training & Sessions",
      types: ["training_created", "session_stats_logged"],
      icon: Calendar,
      color: "blue",
      description: "Training sessions and performance tracking",
    },
    {
      name: "Scoring & Targets",
      types: ["score_submit", "target_engaged"],
      icon: Crosshair,
      color: "emerald",
      description: "Target engagements and scoring activities",
    },
    {
      name: "Team Activity",
      types: ["participant_joined"],
      icon: Users,
      color: "purple",
      description: "Team member participation and collaboration",
    },
    {
      name: "Achievements",
      types: ["achievement"],
      icon: Trophy,
      color: "amber",
      description: "Milestones and accomplishments earned",
    },
  ];

  const getCategoryData = () => {
    const categoryMap = new Map<string, { count: number; percentage: number; types: Map<string, number> }>();

    // Initialize categories
    activityCategories.forEach((cat) => {
      categoryMap.set(cat.name, { count: 0, percentage: 0, types: new Map() });
    });

    // Process feed data
    feed.forEach((item) => {
      const category = activityCategories.find((cat) => cat.types.includes(item.action_type));
      if (category) {
        const catData = categoryMap.get(category.name)!;
        catData.count++;
        catData.types.set(item.action_type, (catData.types.get(item.action_type) || 0) + 1);
      }
    });

    // Calculate percentages
    const total = feed.length;
    categoryMap.forEach((data) => {
      data.percentage = total > 0 ? Math.round((data.count / total) * 100) : 0;
    });

    return categoryMap;
  };

  const activityTypeLabels: Record<string, string> = {
    score_submit: "Score Submissions",
    training_created: "Training Sessions",
    session_stats_logged: "Performance Logs",
    participant_joined: "Team Joins",
    target_engaged: "Target Hits",
    achievement: "Achievements Earned",
  };

  const totalActivities = activityData.reduce((sum, day) => sum + day.activities, 0);
  const avgPerDay = Math.round(totalActivities / activityData.length);
  const mostActiveDay = activityData.reduce((max, day) => (day.activities > max.activities ? day : max));
  const uniqueUsers = new Set(feed.map((item) => item.actor_id)).size;

  const categoryData = getCategoryData();

  // Calculate shot metrics from target_engaged events
  const shotMetrics = useMemo((): ShotMetrics => {
    const metrics: ShotMetrics = {
      totalShots: 0,
      totalHits: 0,
      accuracy: 0,
      avgDistance: 0,
      maxDistance: 0,
      minDistance: Number.MAX_VALUE,
      windConditions: new Map(),
      userPerformance: new Map(),
      hourlyPerformance: new Array(24).fill(0),
      distanceRanges: { close: 0, medium: 0, long: 0 }
    };

    const targetEngagedEvents = feed.filter(item => item.action_type === 'target_engaged');
    const distances: number[] = [];

    targetEngagedEvents.forEach(event => {
      if (event.context) {
        const ctx = typeof event.context === 'string' ? JSON.parse(event.context) : event.context;
        
        // Aggregate shots and hits
        const shots = ctx.shots_fired || 0;
        const hits = ctx.target_hits || 0;
        metrics.totalShots += shots;
        metrics.totalHits += hits;

        // Distance metrics
        if (ctx.distance_m) {
          const distance = ctx.distance_m;
          distances.push(distance);
          metrics.maxDistance = Math.max(metrics.maxDistance, distance);
          metrics.minDistance = Math.min(metrics.minDistance, distance);
          
          // Categorize distance ranges
          if (distance <= 100) metrics.distanceRanges.close++;
          else if (distance <= 300) metrics.distanceRanges.medium++;
          else metrics.distanceRanges.long++;
        }

        // Wind conditions tracking
        if (ctx.wind_speed) {
          const windCategory = ctx.wind_speed < 5 ? 'Low' : ctx.wind_speed < 15 ? 'Medium' : 'High';
          metrics.windConditions.set(windCategory, (metrics.windConditions.get(windCategory) || 0) + 1);
        }

        // User performance tracking
        const userId = event.actor_id;
        const userPerf = metrics.userPerformance.get(userId) || { shots: 0, hits: 0, accuracy: 0 };
        userPerf.shots += shots;
        userPerf.hits += hits;
        userPerf.accuracy = userPerf.shots > 0 ? (userPerf.hits / userPerf.shots) * 100 : 0;
        metrics.userPerformance.set(userId, userPerf);

        // Hourly performance
        const hour = getHours(new Date(event.created_at));
        metrics.hourlyPerformance[hour] += hits;
      }
    });

    // Calculate overall accuracy
    metrics.accuracy = metrics.totalShots > 0 ? (metrics.totalHits / metrics.totalShots) * 100 : 0;
    
    // Calculate average distance
    if (distances.length > 0) {
      metrics.avgDistance = distances.reduce((sum, d) => sum + d, 0) / distances.length;
    }

    // Fix min distance if no data
    if (metrics.minDistance === Number.MAX_VALUE) {
      metrics.minDistance = 0;
    }

    return metrics;
  }, [feed]);

  return (
    <div className={`rounded-xl p-3 border shadow-sm ${theme === "dark" ? "bg-zinc-900/90 border-zinc-700" : "bg-white border-gray-200"}`}>
      {/* Compact Header */}
      <div className="mb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className={`w-4 h-4 ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`} />
            <h4 className={`text-sm font-semibold ${theme === "dark" ? "text-zinc-200" : "text-gray-800"}`}>Activity Analytics</h4>
          </div>
          <div className="flex gap-1">
            {["type", "performance", "daily", "hourly"].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode as any)}
                className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all ${
                  viewMode === mode
                    ? theme === "dark"
                      ? "bg-zinc-700 text-white"
                      : "bg-gray-200 text-gray-900"
                    : theme === "dark"
                      ? "text-zinc-500 hover:text-zinc-300"
                      : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {mode === "type" ? "Types" : mode === "performance" ? "Perf" : mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-400"></div>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Compact Stats Cards */}
          <div className="grid grid-cols-4 gap-2">
            <div className={`p-2 rounded-lg ${theme === "dark" ? "bg-zinc-800/50" : "bg-gray-50"}`}>
              <div className="flex items-center gap-1 mb-0.5">
                <Zap className="w-3 h-3 text-yellow-500" />
                <span className={`text-[10px] ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>Total</span>
              </div>
              <div className={`text-lg font-bold ${theme === "dark" ? "text-zinc-100" : "text-gray-900"}`}>{totalActivities.toLocaleString()}</div>
              <div className={`text-[9px] ${theme === "dark" ? "text-zinc-600" : "text-gray-400"}`}>30 days</div>
            </div>
            <div className={`p-2 rounded-lg ${theme === "dark" ? "bg-zinc-800/50" : "bg-gray-50"}`}>
              <div className="flex items-center gap-1 mb-0.5">
                <TrendingUp className="w-3 h-3 text-green-500" />
                <span className={`text-[10px] ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>Daily</span>
              </div>
              <div className={`text-lg font-bold ${theme === "dark" ? "text-zinc-100" : "text-gray-900"}`}>{avgPerDay}</div>
              <div className={`text-[9px] ${theme === "dark" ? "text-zinc-600" : "text-gray-400"}`}>Average</div>
            </div>
            <div className={`p-2 rounded-lg ${theme === "dark" ? "bg-zinc-800/50" : "bg-gray-50"}`}>
              <div className="flex items-center gap-1 mb-0.5">
                <Users className="w-3 h-3 text-blue-500" />
                <span className={`text-[10px] ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>Users</span>
              </div>
              <div className={`text-lg font-bold ${theme === "dark" ? "text-zinc-100" : "text-gray-900"}`}>{uniqueUsers}</div>
              <div className={`text-[9px] ${theme === "dark" ? "text-zinc-600" : "text-gray-400"}`}>Active</div>
            </div>
            <div className={`p-2 rounded-lg ${theme === "dark" ? "bg-zinc-800/50" : "bg-gray-50"}`}>
              <div className="flex items-center gap-1 mb-0.5">
                <Clock className="w-3 h-3 text-purple-500" />
                <span className={`text-[10px] ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>Peak</span>
              </div>
              <div className={`text-sm font-bold ${theme === "dark" ? "text-zinc-100" : "text-gray-900"}`}>
                {format(new Date(mostActiveDay.date), "MMM d")}
              </div>
              <div className={`text-[9px] ${theme === "dark" ? "text-zinc-600" : "text-gray-400"}`}>{mostActiveDay.activities} acts</div>
            </div>
          </div>

          {/* Type/Category View */}
          {viewMode === "type" && (
            <div className="space-y-4">
              <div className="mb-2">
                <h5 className={`text-sm font-semibold mb-1 ${theme === "dark" ? "text-zinc-200" : "text-gray-700"}`}>
                  Activity Categories Breakdown
                </h5>
                <p className={`text-xs ${theme === "dark" ? "text-zinc-400" : "text-gray-500"}`}>
                  Analyze team performance across different activity types
                </p>
              </div>

              {/* Compact Category Cards */}
              <div className="grid grid-cols-2 gap-2">
                {activityCategories.map((category) => {
                  const catData = categoryData.get(category.name)!;
                  const Icon = category.icon;

                  return (
                    <div
                      key={category.name}
                      className={`p-2 rounded-lg border ${theme === "dark" ? "bg-zinc-800/30 border-zinc-700" : "bg-gray-50 border-gray-200"}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <Icon className={`w-3.5 h-3.5 text-${category.color}-500`} />
                          <div>
                            <h6 className={`text-xs font-semibold ${theme === "dark" ? "text-zinc-100" : "text-gray-800"}`}>{category.name}</h6>
                            <p className={`text-[9px] ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>{catData.count} events</p>
                          </div>
                        </div>
                        <div className={`text-lg font-bold ${theme === "dark" ? `text-${category.color}-400` : `text-${category.color}-600`}`}>
                          {catData.percentage}%
                        </div>
                      </div>
                      <div className={`h-1 rounded-full ${theme === "dark" ? "bg-zinc-700" : "bg-gray-200"}`}>
                        <div
                          className={`h-full rounded-full bg-${category.color}-500 transition-all`}
                          style={{ width: `${catData.percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Individual Type Details */}
              <div>
                <h6 className={`text-xs font-semibold mb-3 ${theme === "dark" ? "text-zinc-300" : "text-gray-600"}`}>Detailed Activity Types</h6>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                  {Object.entries(
                    feed.reduce(
                      (acc, item) => {
                        acc[item.action_type] = (acc[item.action_type] || 0) + 1;
                        return acc;
                      },
                      {} as Record<string, number>,
                    ),
                  ).map(([type, count]) => {
                    const percentage = Math.round((count / totalActivities) * 100);
                    const category = activityCategories.find((cat) => cat.types.includes(type));
                    const Icon = category?.icon || Activity;

                    return (
                      <div
                        key={type}
                        className={`p-3 rounded-lg border ${
                          theme === "dark" ? "bg-zinc-800/50 border-zinc-700 hover:bg-zinc-800" : "bg-gray-50 border-gray-200 hover:bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Icon className={`w-4 h-4 text-${category?.color || "blue"}-500`} />
                          <span className={`text-xs font-medium ${theme === "dark" ? "text-zinc-300" : "text-gray-700"}`}>
                            {activityTypeLabels[type] || type}
                          </span>
                        </div>
                        <div className="flex items-end justify-between">
                          <span className={`text-lg font-bold ${theme === "dark" ? "text-zinc-100" : "text-gray-900"}`}>{count}</span>
                          <span className={`text-xs ${theme === "dark" ? "text-zinc-400" : "text-gray-500"}`}>{percentage}%</span>
                        </div>
                        <div className="mt-2 h-1 bg-gray-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r from-${category?.color || "blue"}-500 to-${category?.color || "blue"}-600 transition-all`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Daily View */}
          {viewMode === "daily" && (
            <div className="space-y-3">
              <div>
                <h5 className={`text-sm font-semibold mb-1 ${theme === "dark" ? "text-zinc-200" : "text-gray-700"}`}>30-Day Activity Heatmap</h5>
                <p className={`text-xs mb-3 ${theme === "dark" ? "text-zinc-400" : "text-gray-500"}`}>
                  Daily activity intensity visualization - hover for details
                </p>
              </div>
              <div className="grid grid-cols-10 gap-2">
                {activityData.map((day, index) => (
                  <div key={index} className="relative group">
                    <div
                      className={`aspect-square rounded-lg border cursor-pointer 
                        relative ${getIntensityClass(day.activities, maxActivities)}`}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div
                          className={`text-[10px] font-bold ${
                            day.activities > 0 ? "text-white drop-shadow-md" : theme === "dark" ? "text-zinc-500" : "text-gray-400"
                          }`}
                        >
                          {format(new Date(day.date), "d")}
                        </div>
                      </div>
                      {day.activities > 0 && <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-white/60 rounded-full animate-pulse" />}
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

          {/* Performance Analytics View */}
          {viewMode === "performance" && (
            <div className="space-y-4">
              {/* Performance Tabs */}
              <div className="flex gap-2 mb-3">
                {(['accuracy', 'distance', 'wind'] as const).map((metric) => (
                  <button
                    key={metric}
                    onClick={() => setSelectedMetric(metric)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                      selectedMetric === metric
                        ? theme === "dark"
                          ? "bg-emerald-600 text-white shadow-sm"
                          : "bg-emerald-500 text-white shadow-sm"
                        : theme === "dark"
                          ? "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {metric.charAt(0).toUpperCase() + metric.slice(1)}
                  </button>
                ))}
              </div>

              {/* Accuracy Metrics */}
              {selectedMetric === "accuracy" && (
                <div className="space-y-4">
                  {/* Main Accuracy Stats */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className={`p-3 rounded-lg ${theme === "dark" ? "bg-zinc-800/50" : "bg-gray-50"}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <Target className="w-4 h-4 text-emerald-500" />
                        <span className={`text-xs font-medium ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>Total Shots</span>
                      </div>
                      <div className={`text-2xl font-bold ${theme === "dark" ? "text-zinc-100" : "text-gray-900"}`}>
                        {shotMetrics.totalShots.toLocaleString()}
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg ${theme === "dark" ? "bg-zinc-800/50" : "bg-gray-50"}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <Crosshair className="w-4 h-4 text-blue-500" />
                        <span className={`text-xs font-medium ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>Total Hits</span>
                      </div>
                      <div className={`text-2xl font-bold ${theme === "dark" ? "text-zinc-100" : "text-gray-900"}`}>
                        {shotMetrics.totalHits.toLocaleString()}
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg ${theme === "dark" ? "bg-zinc-800/50" : "bg-gray-50"}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <Percent className="w-4 h-4 text-purple-500" />
                        <span className={`text-xs font-medium ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>Accuracy Rate</span>
                      </div>
                      <div className={`text-2xl font-bold ${theme === "dark" ? "text-zinc-100" : "text-gray-900"}`}>
                        {shotMetrics.accuracy.toFixed(1)}%
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg ${theme === "dark" ? "bg-zinc-800/50" : "bg-gray-50"}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="w-4 h-4 text-amber-500" />
                        <span className={`text-xs font-medium ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>Active Shooters</span>
                      </div>
                      <div className={`text-2xl font-bold ${theme === "dark" ? "text-zinc-100" : "text-gray-900"}`}>
                        {shotMetrics.userPerformance.size}
                      </div>
                    </div>
                  </div>

                  {/* User Performance Breakdown */}
                  <div className={`p-4 rounded-xl border ${theme === "dark" ? "bg-zinc-800/30 border-zinc-700" : "bg-gray-50 border-gray-200"}`}>
                    <h6 className={`text-sm font-semibold mb-3 ${theme === "dark" ? "text-zinc-200" : "text-gray-700"}`}>
                      Individual Performance Analysis
                    </h6>
                    <div className="space-y-2">
                      {Array.from(shotMetrics.userPerformance.entries())
                        .sort((a, b) => b[1].accuracy - a[1].accuracy)
                        .slice(0, 5)
                        .map(([userId, perf]) => (
                          <div key={userId} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                                theme === "dark" ? "bg-zinc-700 text-zinc-300" : "bg-gray-200 text-gray-700"
                              }`}>
                                {userId.substring(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <div className={`text-xs font-medium ${theme === "dark" ? "text-zinc-300" : "text-gray-700"}`}>
                                  User {userId.substring(0, 8)}
                                </div>
                                <div className={`text-[10px] ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>
                                  {perf.shots} shots • {perf.hits} hits
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className={`text-lg font-bold ${
                                perf.accuracy >= 80 ? "text-emerald-500" :
                                perf.accuracy >= 60 ? "text-blue-500" :
                                perf.accuracy >= 40 ? "text-amber-500" : "text-red-500"
                              }`}>
                                {perf.accuracy.toFixed(1)}%
                              </div>
                              <div className={`text-[10px] ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>
                                accuracy
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Hourly Hit Distribution */}
                  <div className={`p-4 rounded-xl border ${theme === "dark" ? "bg-zinc-800/30 border-zinc-700" : "bg-gray-50 border-gray-200"}`}>
                    <h6 className={`text-sm font-semibold mb-3 ${theme === "dark" ? "text-zinc-200" : "text-gray-700"}`}>
                      Hourly Hit Distribution
                    </h6>
                    <div className="flex items-end gap-1" style={{ height: '100px' }}>
                      {shotMetrics.hourlyPerformance.map((hits, hour) => {
                        const maxHits = Math.max(...shotMetrics.hourlyPerformance);
                        const height = maxHits > 0 ? (hits / maxHits) * 100 : 0;
                        return (
                          <div key={hour} className="flex-1 relative group">
                            <div
                              className={`absolute bottom-0 w-full rounded-t transition-all ${
                                hits > 0
                                  ? `bg-gradient-to-t ${getHourlyColor(hour)}`
                                  : theme === "dark" ? "bg-zinc-800" : "bg-gray-200"
                              }`}
                              style={{ height: `${height}%` }}
                            >
                              {hits > 0 && (
                                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <div className={`text-[10px] font-bold px-1 py-0.5 rounded ${
                                    theme === "dark" ? "bg-zinc-800 text-zinc-300" : "bg-gray-800 text-gray-100"
                                  }`}>
                                    {hits}
                                  </div>
                                </div>
                              )}
                            </div>
                            {hour % 6 === 0 && (
                              <div className={`absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-[9px] ${
                                theme === "dark" ? "text-zinc-500" : "text-gray-500"
                              }`}>
                                {hour}h
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Distance Analytics */}
              {selectedMetric === "distance" && (
                <div className="space-y-4">
                  {/* Distance Stats */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className={`p-3 rounded-lg ${theme === "dark" ? "bg-zinc-800/50" : "bg-gray-50"}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <Eye className="w-4 h-4 text-blue-500" />
                        <span className={`text-xs font-medium ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>Avg Distance</span>
                      </div>
                      <div className={`text-2xl font-bold ${theme === "dark" ? "text-zinc-100" : "text-gray-900"}`}>
                        {Math.round(shotMetrics.avgDistance)}m
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg ${theme === "dark" ? "bg-zinc-800/50" : "bg-gray-50"}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="w-4 h-4 text-emerald-500" />
                        <span className={`text-xs font-medium ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>Max Distance</span>
                      </div>
                      <div className={`text-2xl font-bold ${theme === "dark" ? "text-zinc-100" : "text-gray-900"}`}>
                        {shotMetrics.maxDistance}m
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg ${theme === "dark" ? "bg-zinc-800/50" : "bg-gray-50"}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <BarChart3 className="w-4 h-4 text-purple-500" />
                        <span className={`text-xs font-medium ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>Min Distance</span>
                      </div>
                      <div className={`text-2xl font-bold ${theme === "dark" ? "text-zinc-100" : "text-gray-900"}`}>
                        {shotMetrics.minDistance}m
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg ${theme === "dark" ? "bg-zinc-800/50" : "bg-gray-50"}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <Target className="w-4 h-4 text-amber-500" />
                        <span className={`text-xs font-medium ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>Total Engagements</span>
                      </div>
                      <div className={`text-2xl font-bold ${theme === "dark" ? "text-zinc-100" : "text-gray-900"}`}>
                        {Object.values(shotMetrics.distanceRanges).reduce((a, b) => a + b, 0)}
                      </div>
                    </div>
                  </div>

                  {/* Distance Range Distribution */}
                  <div className={`p-4 rounded-xl border ${theme === "dark" ? "bg-zinc-800/30 border-zinc-700" : "bg-gray-50 border-gray-200"}`}>
                    <h6 className={`text-sm font-semibold mb-3 ${theme === "dark" ? "text-zinc-200" : "text-gray-700"}`}>
                      Distance Range Distribution
                    </h6>
                    <div className="space-y-3">
                      {[
                        { label: 'Close Range (0-100m)', value: shotMetrics.distanceRanges.close, color: 'emerald' },
                        { label: 'Medium Range (100-300m)', value: shotMetrics.distanceRanges.medium, color: 'blue' },
                        { label: 'Long Range (300m+)', value: shotMetrics.distanceRanges.long, color: 'purple' }
                      ].map((range) => {
                        const total = Object.values(shotMetrics.distanceRanges).reduce((a, b) => a + b, 0);
                        const percentage = total > 0 ? (range.value / total) * 100 : 0;
                        return (
                          <div key={range.label}>
                            <div className="flex items-center justify-between mb-1">
                              <span className={`text-xs font-medium ${theme === "dark" ? "text-zinc-300" : "text-gray-700"}`}>
                                {range.label}
                              </span>
                              <span className={`text-xs font-bold ${theme === "dark" ? `text-${range.color}-400` : `text-${range.color}-600`}`}>
                                {range.value} ({percentage.toFixed(1)}%)
                              </span>
                            </div>
                            <div className={`h-3 rounded-full ${theme === "dark" ? "bg-zinc-700" : "bg-gray-200"}`}>
                              <div
                                className={`h-full rounded-full bg-gradient-to-r from-${range.color}-500 to-${range.color}-600 transition-all`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Wind Conditions Analysis */}
              {selectedMetric === "wind" && (
                <div className="space-y-4">
                  {/* Wind Impact Overview */}
                  <div className={`p-4 rounded-xl border ${theme === "dark" ? "bg-zinc-800/30 border-zinc-700" : "bg-gray-50 border-gray-200"}`}>
                    <div className="flex items-center gap-2 mb-3">
                      <Wind className={`w-5 h-5 ${theme === "dark" ? "text-cyan-400" : "text-cyan-600"}`} />
                      <h6 className={`text-sm font-semibold ${theme === "dark" ? "text-zinc-200" : "text-gray-700"}`}>
                        Wind Conditions Impact Analysis
                      </h6>
                    </div>
                    
                    {shotMetrics.windConditions.size > 0 ? (
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {Array.from(shotMetrics.windConditions.entries()).map(([condition, count]) => {
                          const total = Array.from(shotMetrics.windConditions.values()).reduce((a, b) => a + b, 0);
                          const percentage = (count / total) * 100;
                          const colorMap = {
                            'Low': 'emerald',
                            'Medium': 'amber',
                            'High': 'red'
                          };
                          const color = colorMap[condition as keyof typeof colorMap] || 'gray';
                          
                          return (
                            <div
                              key={condition}
                              className={`p-3 rounded-lg border ${
                                theme === "dark" ? "bg-zinc-800/50 border-zinc-700" : "bg-white border-gray-200"
                              }`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className={`text-xs font-medium ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>
                                  {condition} Wind
                                </span>
                                <Wind className={`w-4 h-4 text-${color}-500`} />
                              </div>
                              <div className={`text-2xl font-bold ${theme === "dark" ? "text-zinc-100" : "text-gray-900"}`}>
                                {count}
                              </div>
                              <div className={`text-xs ${theme === "dark" ? `text-${color}-400` : `text-${color}-600`}`}>
                                {percentage.toFixed(1)}% of sessions
                              </div>
                              <div className="mt-2 h-1 bg-gray-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                                <div
                                  className={`h-full bg-gradient-to-r from-${color}-500 to-${color}-600 transition-all`}
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Wind className={`w-8 h-8 mx-auto mb-2 ${theme === "dark" ? "text-zinc-600" : "text-gray-400"}`} />
                        <p className={`text-sm ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>
                          No wind condition data available
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Wind Advisory */}
                  <div className={`p-4 rounded-xl border ${theme === "dark" ? "bg-amber-900/20 border-amber-700/50" : "bg-amber-50 border-amber-200"}`}>
                    <div className="flex items-start gap-3">
                      <AlertCircle className={`w-5 h-5 mt-0.5 ${theme === "dark" ? "text-amber-400" : "text-amber-600"}`} />
                      <div>
                        <h6 className={`text-sm font-semibold mb-1 ${theme === "dark" ? "text-amber-300" : "text-amber-800"}`}>
                          Wind Impact Tips
                        </h6>
                        <ul className={`text-xs space-y-1 ${theme === "dark" ? "text-amber-400/80" : "text-amber-700"}`}>
                          <li>• Low wind (0-5 mph): Minimal adjustment needed</li>
                          <li>• Medium wind (5-15 mph): Consider 1-2 MOA windage adjustment</li>
                          <li>• High wind (15+ mph): Significant compensation required, consider postponing</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Hourly View */}
          {viewMode === "hourly" && (
            <div className="space-y-3">
              <div>
                <h5 className={`text-sm font-semibold mb-1 ${theme === "dark" ? "text-zinc-200" : "text-gray-700"}`}>24-Hour Activity Pattern</h5>
                <p className={`text-xs mb-3 ${theme === "dark" ? "text-zinc-400" : "text-gray-500"}`}>
                  Identify peak training hours and team activity patterns
                </p>
              </div>
              <div className="space-y-2">
                {[0, 6, 12, 18].map((startHour) => (
                  <div key={startHour} className="flex items-center gap-3">
                    <span className={`text-xs w-12 font-medium ${theme === "dark" ? "text-zinc-400" : "text-gray-500"}`}>{startHour}:00</span>
                    <div className="flex gap-1 flex-1">
                      {Array.from({ length: 6 }, (_, i) => {
                        const hour = startHour + i;
                        const totalForHour = activityData.reduce((sum, day) => sum + day.hourlyDistribution[hour], 0);
                        const maxHourly = Math.max(...activityData.flatMap((d) => d.hourlyDistribution));
                        const intensity = maxHourly > 0 ? totalForHour / maxHourly : 0;

                        return (
                          <div
                            key={hour}
                            className={`flex-1 h-8 rounded-lg relative group ${
                              totalForHour > 0
                                ? `bg-gradient-to-br ${getHourlyColor(hour)} opacity-${Math.round(intensity * 100)}`
                                : theme === "dark"
                                  ? "bg-zinc-800"
                                  : "bg-gray-100"
                            }`}
                          >
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span
                                className={`text-[11px] font-semibold ${totalForHour > 0 ? "text-white/90" : theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}
                              >
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
              <div className={`text-xs mt-4 p-3 rounded-lg ${theme === "dark" ? "bg-zinc-800/50" : "bg-gray-50"}`}>
                <div className="font-medium mb-2">Time Period Analysis:</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-gradient-to-r from-sky-500 to-cyan-500"></div>
                    <span className={theme === "dark" ? "text-zinc-400" : "text-gray-600"}>Morning (6-12): Training prep</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-gradient-to-r from-amber-500 to-red-500"></div>
                    <span className={theme === "dark" ? "text-zinc-400" : "text-gray-600"}>Afternoon (12-18): Peak activity</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-gradient-to-r from-violet-500 to-pink-500"></div>
                    <span className={theme === "dark" ? "text-zinc-400" : "text-gray-600"}>Evening (18-22): Review sessions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-gradient-to-r from-indigo-600 to-blue-800"></div>
                    <span className={theme === "dark" ? "text-zinc-400" : "text-gray-600"}>Night (22-6): Low activity</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Legend */}
          <div className={`flex items-center justify-between pt-3 border-t ${theme === "dark" ? "border-zinc-700" : "border-gray-200"}`}>
            <div className="flex items-center gap-3">
              <span className={`text-xs font-medium ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>Activity Intensity:</span>
              <div className="flex items-center gap-2">
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
                  <div key={item.label} className="flex items-center gap-1">
                    <div className={`w-3 h-3 rounded shadow-sm ${item.class}`} />
                    <span className={`text-[10px] ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>{item.label}</span>
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
