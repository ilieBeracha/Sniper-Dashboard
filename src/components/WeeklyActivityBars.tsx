import { useEffect, useMemo } from "react";
import { useStore } from "zustand";
import { feedStore } from "@/store/feedStore";
import { userStore } from "@/store/userStore";
import { format, subDays, startOfDay } from "date-fns";
import { useTheme } from "@/contexts/ThemeContext";
import { Activity } from "lucide-react";

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

    // Create last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = subDays(today, i);
      const dateKey = format(date, "yyyy-MM-dd");
      const dayActivities = feed.filter((item) => format(new Date(item.created_at), "yyyy-MM-dd") === dateKey);

      days.push({
        date: dateKey,
        day: format(date, "EEE"),
        dayNum: format(date, "d"),
        count: dayActivities.length,
        isToday: i === 0,
      });
    }

    return days;
  }, [feed]);

  const maxCount = Math.max(...weekData.map((d) => d.count), 1);

  return (
    <div className={`rounded-xl p-4 border ${theme === "dark" ? "bg-active/90 text-black" : "bg-white border-gray-200"}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 opacity-50" />
          <h4 className={`text-sm font-medium ${theme === "dark" ? "text-black" : "text-gray-900"}`}>Activity Logs</h4>
        </div>
        <span className={`text-xs ${theme === "dark" ? "text-black" : "text-gray-500"}`}>Last 7 days</span>
      </div>

      {/* Bar Chart */}
      <div className="flex items-end gap-2 h-24">
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

                  {/* Tooltip */}
                  <div
                    className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 
                    rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 
                    transition-opacity pointer-events-none z-10 ${
                      theme === "dark" ? "bg-zinc-800 text-white border border-zinc-600" : "bg-gray-900 text-white"
                    }`}
                  >
                    {format(new Date(day.date), "MMM d")}: {day.count} activities
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

      {/* Summary */}
      <div className={`flex items-center justify-between mt-3 pt-3 border-t ${theme === "dark" ? "border-zinc-800" : "border-gray-200"}`}>
        <div className="flex items-center gap-4">
          <div>
            <span className={`text-xs ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>Total</span>
            <div className={`text-sm font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{feed.length}</div>
          </div>
          <div>
            <span className={`text-xs ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>Average</span>
            <div className={`text-sm font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{Math.round(feed.length / 7)}</div>
          </div>
          <div>
            <span className={`text-xs ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>Peak</span>
            <div className={`text-sm font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              {weekData.reduce((max, day) => (day.count > max.count ? day : max)).day}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
