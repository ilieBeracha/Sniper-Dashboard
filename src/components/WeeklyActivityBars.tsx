import { useEffect, useMemo } from "react";
import { useStore } from "zustand";
import { feedStore } from "@/store/feedStore";
import { userStore } from "@/store/userStore";
import { format, subDays, startOfDay } from "date-fns";
import { useTheme } from "@/contexts/ThemeContext";
import { Activity, Target, Calendar, BarChart3, UserPlus, Crosshair, Users, TrendingUp } from "lucide-react";

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

  // Calculate most active users
  const userActivity = useMemo(() => {
    const userMap: Record<string, number> = {};
    feed.forEach(item => {
      userMap[item.actor_id] = (userMap[item.actor_id] || 0) + 1;
    });
    return Object.entries(userMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);
  }, [feed]);

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

  return (
    <div className={`rounded-xl p-4 border ${theme === "dark" ? "bg-zinc-900/50 border-zinc-700/50" : "bg-white border-gray-200"}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className={`w-4 h-4 ${theme === "dark" ? "text-zinc-400" : "text-gray-500"}`} />
          <h4 className={`text-sm font-medium ${theme === "dark" ? "text-zinc-200" : "text-gray-900"}`}>Weekly Activity Overview</h4>
        </div>
        <span className={`text-xs ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>Last 7 days</span>
      </div>

      {/* Bar Chart */}
      <div className="flex items-end gap-2 h-24 mb-4">
        {weekData.map((day) => {
          const height = day.count > 0 ? (day.count / maxCount) * 100 : 5;

          return (
            <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
              {/* Bar */}
              <div className="relative flex-1 w-full flex items-end">
                <div
                  className={`w-full rounded-t transition-all duration-300 relative group cursor-pointer ${
                    day.isToday
                      ? "bg-gradient-to-t from-blue-600 to-cyan-500"
                      : day.count > 0
                        ? theme === "dark"
                          ? "bg-gradient-to-t from-zinc-700 to-zinc-600 hover:from-zinc-600 hover:to-zinc-500"
                          : "bg-gradient-to-t from-gray-300 to-gray-200 hover:from-gray-400 hover:to-gray-300"
                        : theme === "dark"
                          ? "bg-zinc-800"
                          : "bg-gray-100"
                  }`}
                  style={{ height: `${height}%`, minHeight: "4px" }}
                >
                  {/* Count label */}
                  {day.count > 0 && (
                    <div
                      className={`absolute -top-5 left-1/2 -translate-x-1/2 text-xs font-medium ${
                        theme === "dark" ? "text-zinc-400" : "text-gray-600"
                      }`}
                    >
                      {day.count}
                    </div>
                  )}

                  {/* Enhanced Tooltip */}
                  <div
                    className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 
                    rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 
                    transition-opacity pointer-events-none z-10 ${
                      theme === "dark" ? "bg-zinc-800 text-white border border-zinc-600" : "bg-gray-900 text-white"
                    }`}
                  >
                    <div className="font-medium mb-1">{format(new Date(day.date), "MMM d, yyyy")}</div>
                    <div>{day.count} activities</div>
                    <div className="text-[10px] opacity-80">{day.uniqueUsers} active users</div>
                  </div>
                </div>
              </div>

              {/* Day label */}
              <div className={`text-xs ${day.isToday ? "font-bold text-blue-500" : theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>
                {day.day}
              </div>
            </div>
          );
        })}
      </div>

      {/* Activity Type Breakdown */}
      <div className={`border-t ${theme === "dark" ? "border-zinc-800" : "border-gray-200"} pt-3 mb-3`}>
        <div className="flex items-center justify-between mb-2">
          <h5 className={`text-xs font-medium ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>Activity Breakdown</h5>
          <TrendingUp className={`w-3 h-3 ${theme === "dark" ? "text-zinc-500" : "text-gray-400"}`} />
        </div>
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(activityTypeTotals)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 6)
            .map(([type, count]) => {
              const Icon = getActionIcon(type);
              return (
                <div
                  key={type}
                  className={`flex items-center gap-2 p-2 rounded-lg ${
                    theme === "dark" ? "bg-zinc-800/50" : "bg-gray-50"
                  }`}
                >
                  <Icon className={`w-3 h-3 ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`} />
                  <div className="flex-1">
                    <div className={`text-[10px] ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>
                      {getActionLabel(type)}
                    </div>
                    <div className={`text-xs font-medium ${theme === "dark" ? "text-zinc-300" : "text-gray-700"}`}>
                      {count}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Summary Stats */}
      <div className={`flex items-center justify-between pt-3 border-t ${theme === "dark" ? "border-zinc-800" : "border-gray-200"}`}>
        <div className="flex items-center gap-4">
          <div>
            <span className={`text-xs ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>Total</span>
            <div className={`text-sm font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{feed.length}</div>
          </div>
          <div>
            <span className={`text-xs ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>Avg/Day</span>
            <div className={`text-sm font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{Math.round(feed.length / 7)}</div>
          </div>
          <div>
            <span className={`text-xs ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>Peak Day</span>
            <div className={`text-sm font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              {weekData.reduce((max, day) => (day.count > max.count ? day : max)).day}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Users className={`w-3 h-3 ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`} />
            <div>
              <span className={`text-xs ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>Active Users</span>
              <div className={`text-sm font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                {new Set(feed.map(item => item.actor_id)).size}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
