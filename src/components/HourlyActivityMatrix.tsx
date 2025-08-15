import { useEffect, useMemo, useState } from "react";
import { useStore } from "zustand";
import { feedStore } from "@/store/feedStore";
import { userStore } from "@/store/userStore";
import { format, getHours, subDays, eachDayOfInterval, startOfDay } from "date-fns";
import { useTheme } from "@/contexts/ThemeContext";
import { Clock, Sunrise, Sun, Sunset, Moon } from "lucide-react";

interface HourlyData {
  hour: number;
  days: Map<string, {
    count: number;
    types: Set<string>;
    users: Set<string>;
  }>;
  totalCount: number;
}

export default function HourlyActivityMatrix() {
  const { feed, fetchFeedLog } = useStore(feedStore);
  const { user } = useStore(userStore);
  const { theme } = useTheme();
  const [selectedHour, setSelectedHour] = useState<number | null>(null);

  useEffect(() => {
    if (user?.team_id) fetchFeedLog(user.team_id);
  }, [user?.team_id]);

  const hourlyData = useMemo(() => {
    const hours: HourlyData[] = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      days: new Map(),
      totalCount: 0,
    }));

    // Initialize days for each hour
    const end = new Date();
    const start = subDays(end, 7); // Last 7 days
    
    eachDayOfInterval({ start: startOfDay(start), end: startOfDay(end) }).forEach((date) => {
      const dateKey = format(date, "yyyy-MM-dd");
      hours.forEach(h => {
        h.days.set(dateKey, { count: 0, types: new Set(), users: new Set() });
      });
    });

    // Process feed data
    feed.forEach((item) => {
      const hour = getHours(new Date(item.created_at));
      const dateKey = format(new Date(item.created_at), "yyyy-MM-dd");
      
      if (hour >= 0 && hour < 24) {
        const hourData = hours[hour];
        const dayData = hourData.days.get(dateKey);
        
        if (dayData) {
          dayData.count++;
          dayData.types.add(item.action_type);
          dayData.users.add(item.actor_id.id);
          hourData.totalCount++;
        }
      }
    });

    return hours;
  }, [feed]);

  const maxPerHour = Math.max(...hourlyData.map(h => h.totalCount), 1);
  const days = Array.from(hourlyData[0].days.keys()).sort();

  const getHourIcon = (hour: number) => {
    if (hour >= 5 && hour < 9) return <Sunrise className="w-3 h-3" />;
    if (hour >= 9 && hour < 17) return <Sun className="w-3 h-3" />;
    if (hour >= 17 && hour < 20) return <Sunset className="w-3 h-3" />;
    return <Moon className="w-3 h-3" />;
  };

  const getHourLabel = (hour: number) => {
    return `${hour.toString().padStart(2, '0')}:00`;
  };

  const getCellIntensity = (count: number, maxCount: number) => {
    if (count === 0) return theme === "dark" ? "bg-zinc-800/50" : "bg-gray-50";
    
    const ratio = count / maxCount;
    if (theme === "dark") {
      if (ratio > 0.75) return "bg-gradient-to-br from-purple-600 to-blue-600";
      if (ratio > 0.5) return "bg-gradient-to-br from-blue-600 to-cyan-600";
      if (ratio > 0.25) return "bg-gradient-to-br from-cyan-700 to-teal-700";
      return "bg-gradient-to-br from-zinc-700 to-zinc-600";
    } else {
      if (ratio > 0.75) return "bg-gradient-to-br from-purple-400 to-blue-400";
      if (ratio > 0.5) return "bg-gradient-to-br from-blue-400 to-cyan-400";
      if (ratio > 0.25) return "bg-gradient-to-br from-cyan-300 to-teal-300";
      return "bg-gradient-to-br from-gray-200 to-gray-100";
    }
  };

  const peakHour = hourlyData.reduce((max, h) => h.totalCount > max.totalCount ? h : max);

  return (
    <div className={`rounded-lg p-4 border ${
      theme === "dark" ? "bg-zinc-900/90 border-zinc-700" : "bg-white border-gray-200"
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 opacity-50" />
          <h4 className={`text-sm font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            24-Hour Activity Pattern
          </h4>
        </div>
        <div className={`text-xs px-2 py-1 rounded-full ${
          theme === "dark" ? "bg-zinc-800" : "bg-gray-100"
        }`}>
          Peak: {getHourLabel(peakHour.hour)}
        </div>
      </div>

      {/* Matrix Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Day headers */}
          <div className="flex gap-1 mb-1">
            <div className="w-12"></div>
            {days.map(day => (
              <div key={day} className={`w-10 text-center text-xs ${
                theme === "dark" ? "text-zinc-500" : "text-gray-500"
              }`}>
                {format(new Date(day), "EEE")}
              </div>
            ))}
          </div>

          {/* Hour rows */}
          <div className="space-y-1">
            {hourlyData.map((hourData) => {
              const isSelected = selectedHour === hourData.hour;
              
              return (
                <div 
                  key={hourData.hour} 
                  className={`flex gap-1 items-center transition-all ${
                    isSelected ? "scale-105" : ""
                  }`}
                >
                  {/* Hour label */}
                  <div 
                    className={`w-12 flex items-center gap-1 text-xs cursor-pointer ${
                      theme === "dark" ? "text-zinc-400" : "text-gray-600"
                    } ${isSelected ? "font-bold" : ""}`}
                    onClick={() => setSelectedHour(isSelected ? null : hourData.hour)}
                  >
                    {getHourIcon(hourData.hour)}
                    <span>{hourData.hour}h</span>
                  </div>

                  {/* Day cells */}
                  {days.map(day => {
                    const dayData = hourData.days.get(day) || { count: 0, types: new Set(), users: new Set() };
                    const maxForDay = Math.max(...Array.from(hourData.days.values()).map(d => d.count), 1);
                    
                    return (
                      <div key={day} className="relative group">
                        <div className={`w-10 h-6 rounded transition-all cursor-pointer ${
                          getCellIntensity(dayData.count, maxForDay)
                        } hover:scale-110 hover:z-10`}>
                          {dayData.count > 0 && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-[10px] font-semibold text-white/80">
                                {dayData.count}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Tooltip */}
                        {dayData.count > 0 && (
                          <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 
                            rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 
                            transition-all z-20 pointer-events-none ${
                            theme === "dark" 
                              ? "bg-zinc-800 text-white border border-zinc-600" 
                              : "bg-gray-900 text-white"
                          }`}>
                            <div className="font-semibold mb-1">
                              {format(new Date(day), "MMM d")} at {getHourLabel(hourData.hour)}
                            </div>
                            <div className="space-y-0.5">
                              <div>Activities: {dayData.count}</div>
                              <div>Types: {dayData.types.size}</div>
                              <div>Users: {dayData.users.size}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Hour total */}
                  <div className={`ml-2 text-xs font-medium ${
                    theme === "dark" ? "text-zinc-400" : "text-gray-600"
                  }`}>
                    {hourData.totalCount}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Time period summary */}
      <div className="grid grid-cols-4 gap-2 mt-4 pt-3 border-t border-opacity-20">
        {[
          { label: "Morning", hours: [5, 11], icon: Sunrise },
          { label: "Afternoon", hours: [12, 16], icon: Sun },
          { label: "Evening", hours: [17, 20], icon: Sunset },
          { label: "Night", hours: [21, 4], icon: Moon },
        ].map(({ label, hours, icon: Icon }) => {
          const count = hourlyData
            .filter(h => {
              if (hours[0] > hours[1]) {
                return h.hour >= hours[0] || h.hour <= hours[1];
              }
              return h.hour >= hours[0] && h.hour <= hours[1];
            })
            .reduce((sum, h) => sum + h.totalCount, 0);
          
          return (
            <div key={label} className={`text-center p-2 rounded ${
              theme === "dark" ? "bg-zinc-800/50" : "bg-gray-50"
            }`}>
              <Icon className={`w-4 h-4 mx-auto mb-1 ${
                theme === "dark" ? "text-zinc-400" : "text-gray-500"
              }`} />
              <div className={`text-xs ${
                theme === "dark" ? "text-zinc-500" : "text-gray-600"
              }`}>
                {label}
              </div>
              <div className={`text-sm font-bold ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}>
                {count}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}