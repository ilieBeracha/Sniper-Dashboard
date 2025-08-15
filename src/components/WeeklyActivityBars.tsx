import { useEffect, useMemo } from "react";
import { useStore } from "zustand";
import { feedStore } from "@/store/feedStore";
import { userStore } from "@/store/userStore";
import { format, subDays, startOfDay } from "date-fns";
import { useTheme } from "@/contexts/ThemeContext";
import { Activity, Target, Calendar, BarChart3, UserPlus, Crosshair, TrendingUp } from "lucide-react";

export default function WeeklyActivityBars() {
  const { feed, fetchFeedLog } = useStore(feedStore);
  const { user } = useStore(userStore);
  const { theme } = useTheme();

  useEffect(() => {
    if (user?.team_id) fetchFeedLog(user.team_id);
  }, [user?.team_id]);

  const weekData = useMemo(() => {
    const today = startOfDay(new Date());
    const days = [];

    // Create last 7 days with detailed activity breakdown
    for (let i = 6; i >= 0; i--) {
      const date = subDays(today, i);
      const dateKey = format(date, "yyyy-MM-dd");
      const dayActivities = feed.filter((item) => format(new Date(item.created_at), "yyyy-MM-dd") === dateKey);

      // Count activities by type
      const activityTypes = dayActivities.reduce((acc, item) => {
        acc[item.action_type] = (acc[item.action_type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Count unique users
      const uniqueUsers = new Set(dayActivities.map(item => item.actor_id)).size;

      days.push({
        date: dateKey,
        day: format(date, "EEE"),
        dayNum: format(date, "d"),
        count: dayActivities.length,
        isToday: i === 0,
        activityTypes,
        uniqueUsers,
        activities: dayActivities
      });
    }

    return days;
  }, [feed]);

  const maxCount = Math.max(...weekData.map((d) => d.count), 1);

  // Calculate activity type totals
  const activityTypeTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    weekData.forEach(day => {
      Object.entries(day.activityTypes).forEach(([type, count]) => {
        totals[type] = (totals[type] || 0) + count;
      });
    });
    return totals;
  }, [weekData]);

  const getActionIcon = (actionType: string) => {
    const icons: Record<string, any> = {
      score_submit: Target,
      training_created: Calendar,
      session_stats_logged: BarChart3,
      participant_joined: UserPlus,
      target_engaged: Crosshair,
      target_stats_created: Target,
    };
    return icons[actionType] || Activity;
  };

  const getActionLabel = (actionType: string) => {
    const labels: Record<string, string> = {
      score_submit: "Scores",
      training_created: "Trainings",
      session_stats_logged: "Sessions",
      participant_joined: "Participants",
      target_engaged: "Engagements",
      target_stats_created: "Targets",
    };
    return labels[actionType] || actionType.replace(/_/g, ' ');
  };

  const peakDay = weekData.reduce((max, day) => (day.count > max.count ? day : max));
  const totalUniqueUsers = new Set(feed.map(item => item.actor_id)).size;
  const avgPerDay = Math.round(feed.length / 7);

  return (
    <div className={`rounded-lg p-2 border ${theme === "dark" ? "bg-zinc-900/50 border-zinc-700/50" : "bg-white border-gray-200"}`}>
      {/* Compact Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <Activity className={`w-3.5 h-3.5 ${theme === "dark" ? "text-zinc-400" : "text-gray-500"}`} />
          <h4 className={`text-xs font-medium ${theme === "dark" ? "text-zinc-200" : "text-gray-900"}`}>Activity</h4>
        </div>
        <span className={`text-[10px] ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>7 days</span>
      </div>

      {/* Key Metrics - Compact Grid */}
      <div className="grid grid-cols-4 gap-1 mb-2">
        <div className={`text-center p-1.5 rounded ${theme === "dark" ? "bg-zinc-800/30" : "bg-gray-50"}`}>
          <div className={`text-sm font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{feed.length}</div>
          <div className={`text-[9px] ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>Total</div>
        </div>
        <div className={`text-center p-1.5 rounded ${theme === "dark" ? "bg-zinc-800/30" : "bg-gray-50"}`}>
          <div className={`text-sm font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{avgPerDay}</div>
          <div className={`text-[9px] ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>Daily</div>
        </div>
        <div className={`text-center p-1.5 rounded ${theme === "dark" ? "bg-zinc-800/30" : "bg-gray-50"}`}>
          <div className={`text-sm font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{totalUniqueUsers}</div>
          <div className={`text-[9px] ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>Users</div>
        </div>
        <div className={`text-center p-1.5 rounded ${theme === "dark" ? "bg-zinc-800/30" : "bg-gray-50"}`}>
          <div className={`text-sm font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{peakDay.day}</div>
          <div className={`text-[9px] ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>Peak</div>
        </div>
      </div>

      {/* Compact Bar Chart */}
      <div className="mb-2">
        <div className="flex items-end gap-1 h-16">
          {weekData.map((day) => {
            const height = day.count > 0 ? (day.count / maxCount) * 100 : 5;

            return (
              <div key={day.date} className="flex-1 flex flex-col items-center gap-0.5">
                <div className="relative flex-1 w-full flex items-end">
                  <div
                    className={`w-full rounded-t transition-all duration-300 relative group cursor-pointer ${
                      day.isToday
                        ? "bg-blue-500"
                        : day.count > 0
                          ? theme === "dark"
                            ? "bg-zinc-600 hover:bg-zinc-500"
                            : "bg-gray-300 hover:bg-gray-400"
                          : theme === "dark"
                            ? "bg-zinc-800"
                            : "bg-gray-100"
                    }`}
                    style={{ height: `${height}%`, minHeight: "2px" }}
                  >
                    {/* Count label - only for significant bars */}
                    {day.count > 3 && (
                      <div
                        className={`absolute -top-3 left-1/2 -translate-x-1/2 text-[9px] font-medium ${
                          theme === "dark" ? "text-zinc-400" : "text-gray-600"
                        }`}
                      >
                        {day.count}
                      </div>
                    )}

                    {/* Tooltip */}
                    <div
                      className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-1 p-1.5 
                      rounded text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 
                      transition-opacity pointer-events-none z-10 ${
                        theme === "dark" ? "bg-zinc-800 text-white border border-zinc-600" : "bg-gray-900 text-white"
                      }`}
                    >
                      <div className="font-medium">{format(new Date(day.date), "MMM d")}</div>
                      <div>{day.count} activities</div>
                    </div>
                  </div>
                </div>
                
                {/* Day label */}
                <div className={`text-[9px] ${day.isToday ? "font-bold text-blue-500" : theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>
                  {day.day}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Activity Types - Compact Grid */}
      <div className={`border-t ${theme === "dark" ? "border-zinc-800" : "border-gray-200"} pt-2`}>
        <div className="flex items-center justify-between mb-1.5">
          <h5 className={`text-[10px] font-medium ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>Types</h5>
          <TrendingUp className={`w-2.5 h-2.5 ${theme === "dark" ? "text-zinc-500" : "text-gray-400"}`} />
        </div>
        <div className="grid grid-cols-3 gap-1">
          {Object.entries(activityTypeTotals)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 6)
            .map(([type, count]) => {
              const Icon = getActionIcon(type);
              const percentage = Math.round((count / feed.length) * 100);
              return (
                <div
                  key={type}
                  className={`flex items-center gap-1.5 p-1.5 rounded ${
                    theme === "dark" ? "bg-zinc-800/30" : "bg-gray-50"
                  }`}
                >
                  <Icon className={`w-2.5 h-2.5 flex-shrink-0 ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`} />
                  <div className="flex-1 min-w-0">
                    <div className={`text-[9px] truncate ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>
                      {getActionLabel(type)}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-medium ${theme === "dark" ? "text-zinc-300" : "text-gray-700"}`}>
                        {count}
                      </span>
                      <span className={`text-[8px] ${theme === "dark" ? "text-zinc-600" : "text-gray-400"}`}>
                        {percentage}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
