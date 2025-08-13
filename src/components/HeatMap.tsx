import { useEffect, useMemo, useState } from "react";
import { useStore } from "zustand";
import { userStore } from "@/store/userStore";
import { TrainingStore } from "@/store/trainingStore";
import { sessionStore } from "@/store/sessionStore";
import { subDays, startOfDay, format, eachDayOfInterval } from "date-fns";

export default function HeatmapAllActions() {
  const { user } = useStore(userStore);
  const { loadNextAndLastTraining, trainings } = useStore(TrainingStore);
  const { sessionStats } = useStore(sessionStore);
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

  // Generate all dates and their activity values
  const activityData = useMemo(() => {
    if (!ready) return [];

    const map = new Map<string, number>();

    // Initialize all dates with mock data
    eachDayOfInterval(dateRange).forEach((date) => {
      const key = format(date, "yyyy-MM-dd");
      // Generate random activity for demonstration
      const activity = Math.floor(Math.random() * 10);
      map.set(key, activity);
    });

    // Add real training data if available
    (trainings ?? []).forEach((t: any) => {
      if (t?.date) {
        const date = new Date(t.date);
        const key = format(startOfDay(date), "yyyy-MM-dd");
        if (map.has(key)) {
          map.set(key, (map.get(key) ?? 0) + 2);
        }
      }
    });

    (sessionStats ?? []).forEach((s: any) => {
      if (s?.training_session?.date) {
        const date = new Date(s.training_session.date);
        const key = format(startOfDay(date), "yyyy-MM-dd");
        if (map.has(key)) {
          map.set(key, (map.get(key) ?? 0) + 3);
        }
      }
    });

    return Array.from(map.entries())
      .map(([date, value]) => ({
        date,
        value,
        day: format(new Date(date), "d"),
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [ready, dateRange, trainings, sessionStats]);

  const getIntensityClass = (value: number) => {
    if (value === 0) return "bg-zinc-800";
    if (value <= 3) return "bg-emerald-900/30";
    if (value <= 6) return "bg-emerald-700/50";
    if (value <= 9) return "bg-emerald-600";
    return "bg-emerald-500";
  };

  return (
    <div className="bg-zinc-900/30 rounded-lg border border-zinc-800/30 p-3">
      <div className="mb-3">
        <h3 className="text-sm font-medium text-white">Monthly Activity</h3>
        <p className="text-xs text-zinc-500">Last 30 days</p>
      </div>

      <div className="grid grid-cols-7 sm:grid-cols-10 gap-1 sm:gap-2">
        {activityData.map((day, index) => (
          <div key={index} className="relative group">
            <div
              className={`aspect-square rounded ${getIntensityClass(day.value)} hover:ring-1 hover:ring-zinc-400 transition-all cursor-pointer`}
              title={`${format(new Date(day.date), "MMM dd")}: ${day.value} activities`}
            >
              <div className="text-xs sm:text-sm text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center h-full font-normal">
                {day.day}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mt-3 text-xs text-zinc-500">
        <div className="flex items-center gap-2">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded bg-zinc-800"></div>
            <div className="w-2 h-2 rounded bg-emerald-900/30"></div>
            <div className="w-2 h-2 rounded bg-emerald-700/50"></div>
            <div className="w-2 h-2 rounded bg-emerald-600"></div>
            <div className="w-2 h-2 rounded bg-emerald-500"></div>
          </div>
          <span>More</span>
        </div>

        <div className="hidden sm:block text-xs text-zinc-500">Hover for details</div>
      </div>
    </div>
  );
}
