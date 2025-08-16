import { useEffect, useMemo } from "react";
import { useStore } from "zustand";
import { feedStore } from "@/store/feedStore";
import { userStore } from "@/store/userStore";
import { format, subDays, startOfDay } from "date-fns";
import { useTheme } from "@/contexts/ThemeContext";
import { Activity, Target, Calendar, BarChart3, UserPlus, Crosshair, Zap } from "lucide-react";

export default function WeeklyActivityBars() {
  const { feed, fetchFeedLog } = useStore(feedStore);
  const { user } = useStore(userStore);
  const { theme } = useTheme();

  useEffect(() => {
    if (user?.team_id) fetchFeedLog(user.team_id, true);
  }, [user?.team_id]);

  const weekData = useMemo(() => {
    const today = startOfDay(new Date());
    const days = [];

    for (let i = 6; i >= 0; i--) {
      const date = subDays(today, i);
      const dateKey = format(date, "yyyy-MM-dd");
      const dayActivities = feed.filter((item) => format(new Date(item.created_at), "yyyy-MM-dd") === dateKey);

      const activityTypes = dayActivities.reduce((acc, item) => {
        acc[item.action_type] = (acc[item.action_type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

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
    <div className={`rounded-xl p-3 ${theme === "dark" ? "bg-zinc-900/50" : "bg-white"} 
      border ${theme === "dark" ? "border-zinc-700/50" : "border-gray-200"}`}>
      
      {/* Minimalist Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <h4 className={`text-sm font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            Activity Timeline
          </h4>
          <div className={`flex items-center gap-1 px-2 py-1 rounded-md ${
            theme === "dark" ? "bg-zinc-800" : "bg-gray-100"
          }`}>
            <Zap className={`w-3 h-3 ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`} />
            <span className={`text-xs font-medium ${theme === "dark" ? "text-zinc-300" : "text-gray-700"}`}>
              {feed.length} Total
            </span>
          </div>
        </div>
        <p className={`text-xs ${theme === "dark" ? "text-zinc-400" : "text-gray-500"}`}>
          Daily activity distribution
        </p>
      </div>

      {/* Modern Bar Chart */}
      <div className="mb-4">
        <div className="flex items-end gap-1.5 h-24">
          {weekData.map((day) => {
            const height = day.count > 0 ? (day.count / maxCount) * 100 : 10;
            const isHighActivity = day.count > avgPerDay;

            return (
              <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                <div className="relative flex-1 w-full flex items-end">
                  <div className="relative w-full group">
                    {/* Bar */}
                    <div
                      className={`w-full rounded-t-lg transition-all duration-500 ease-out relative overflow-hidden ${
                        day.isToday
                          ? theme === "dark"
                            ? "bg-zinc-600"
                            : "bg-gray-600"
                          : isHighActivity
                            ? theme === "dark"
                              ? "bg-zinc-700"
                              : "bg-gray-500"
                            : theme === "dark"
                              ? "bg-zinc-800"
                              : "bg-gray-300"
                      } hover:opacity-80 cursor-pointer`}
                      style={{ 
                        height: `${height}%`, 
                        minHeight: "8px",
                      }}
                    >
                      {/* Count label */}
                      {day.count > 0 && (
                        <div className={`absolute -top-5 left-1/2 -translate-x-1/2 text-xs font-semibold
                          ${day.isToday 
                            ? theme === "dark" ? "text-zinc-400" : "text-gray-700" 
                            : theme === "dark" ? "text-zinc-500" : "text-gray-600"}
                          opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
                          {day.count}
                        </div>
                      )}
                    </div>

                    {/* Enhanced Tooltip */}
                    <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 
                      rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 
                      transition-all duration-200 pointer-events-none z-10 shadow-xl ${
                        theme === "dark" ? "bg-zinc-800 text-white" : "bg-white text-gray-900 border border-gray-200"
                      }`}>
                      <div className="font-semibold mb-1">{format(new Date(day.date), "MMM d, yyyy")}</div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <Activity className="w-3 h-3" />
                          <span>{day.count} activities</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <UserPlus className="w-3 h-3" />
                          <span>{day.uniqueUsers} users</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Day label */}
                <div className={`text-xs font-medium ${
                  day.isToday 
                    ? theme === "dark" ? "text-zinc-400" : "text-gray-700"
                    : theme === "dark" ? "text-zinc-500" : "text-gray-600"
                }`}>
                  {day.day}
                </div>
              </div>
            );
          })}
        </div>

        {/* X-axis line */}
        <div className={`w-full h-px mt-1 ${theme === "dark" ? "bg-zinc-700" : "bg-gray-300"}`} />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className={`p-2.5 rounded-lg text-center ${theme === "dark" ? "bg-zinc-800/50" : "bg-gray-100"}`}>
          <div className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            {avgPerDay}
          </div>
          <div className={`text-xs ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>
            Daily Average
          </div>
        </div>
        <div className={`p-2.5 rounded-lg text-center ${theme === "dark" ? "bg-zinc-800/50" : "bg-gray-100"}`}>
          <div className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            {peakDay.count}
          </div>
          <div className={`text-xs ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>
            Peak ({peakDay.day})
          </div>
        </div>
        <div className={`p-2.5 rounded-lg text-center ${theme === "dark" ? "bg-zinc-800/50" : "bg-gray-100"}`}>
          <div className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            {totalUniqueUsers}
          </div>
          <div className={`text-xs ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>
            Active Users
          </div>
        </div>
      </div>

      {/* Activity Types Pills */}
      <div>
        <h5 className={`text-xs font-medium mb-2 ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>
          Activity Breakdown
        </h5>
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(activityTypeTotals)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([type, count]) => {
              const Icon = getActionIcon(type);
              const percentage = Math.round((count / feed.length) * 100);
              
              return (
                <div
                  key={type}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs
                    ${theme === "dark" ? "bg-zinc-800 text-zinc-300" : "bg-gray-100 text-gray-700"}
                    hover:scale-105 transition-transform cursor-default`}
                >
                  <Icon className="w-3 h-3" />
                  <span className="font-medium">{getActionLabel(type)}</span>
                  <span className={`${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>
                    {count} ({percentage}%)
                  </span>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
