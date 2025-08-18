import { TrainingStore } from "@/store/trainingStore";
import { useStore } from "zustand";
import { format, differenceInDays, differenceInHours, isToday, isTomorrow, isYesterday } from "date-fns";
import { TrainingSessionChart } from "@/types/training";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import { primitives } from "@/styles/core";

export default function DashboardCalendar() {
  const useTrainingCalendar = useStore(TrainingStore);
  const { last, next } = useTrainingCalendar.trainingsChartDisplay;
  const navigate = useNavigate();
  const { theme } = useTheme();

  return (
    <div className={`relative rounded-xl border p-4 transition-all duration-200 ${
      theme === "dark" 
        ? "bg-zinc-900/50 border-zinc-800" 
        : "bg-white border-gray-200"
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-sm font-medium flex items-center gap-2 ${
          theme === "dark" ? "text-white" : "text-gray-900"
        }`}>
          <Calendar className="w-4 h-4" />
          Training Schedule
        </h3>
        <button
          onClick={() => navigate("/trainings")}
          className={`text-xs transition-colors ${
            theme === "dark" 
              ? "text-zinc-500 hover:text-zinc-300" 
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          View all →
        </button>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Timeline line */}
        <div
          className="absolute left-4 top-8 bottom-8 w-0.5 rounded-full"
          style={{
            background: theme === "dark"
              ? `linear-gradient(to bottom, ${primitives.grey.grey800} 0%, ${primitives.grey.grey700} 100%)`
              : `linear-gradient(to bottom, ${primitives.grey.grey200} 0%, ${primitives.grey.grey300} 100%)`,
          }}
        />

        <div className="space-y-3">
          {/* Last Training */}
          <TimelineCard 
            session={last} 
            type="last" 
            onClick={last ? () => navigate(`/training/${last.id}`) : undefined} 
            isEmpty={!last} 
          />

          {/* Next Training */}
          <TimelineCard 
            session={next} 
            type="next" 
            onClick={next ? () => navigate(`/training/${next.id}`) : undefined} 
            isEmpty={!next} 
          />
        </div>
      </div>
    </div>
  );
}

function TimelineCard({
  session,
  type,
  onClick,
  isEmpty,
}: {
  session: TrainingSessionChart | null;
  type: "last" | "next";
  onClick?: () => void;
  isEmpty: boolean;
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  if (isEmpty) {
    return (
      <div className="relative pl-10">
        {/* Timeline dot */}
        <div
          className={`absolute left-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
            isDark 
              ? "bg-zinc-900 border-zinc-700" 
              : "bg-gray-50 border-gray-300"
          }`}
        >
          <div className={`w-2 h-2 rounded-full ${
            isDark ? "bg-zinc-600" : "bg-gray-400"
          }`} />
        </div>

        <div
          className={`p-3 rounded-lg border border-dashed transition-all ${
            isDark 
              ? "bg-zinc-800/30 border-zinc-700/50" 
              : "bg-gray-50/50 border-gray-300/50"
          }`}
        >
          <div className="flex items-center gap-2">
            <Calendar size={14} className="opacity-40" />
            <span className={`text-xs ${
              isDark ? "text-zinc-500" : "text-gray-500"
            }`}>
              No {type} training scheduled
            </span>
          </div>
        </div>
      </div>
    );
  }

  const sessionDate = new Date(session!.date);
  const now = new Date();
  const daysUntil = Math.abs(differenceInDays(sessionDate, now));
  const hoursUntil = Math.abs(differenceInHours(sessionDate, now));

  // Get relative time
  const getRelativeTime = () => {
    if (type === "last") {
      if (isToday(sessionDate)) return { text: "Today", highlight: true };
      if (isYesterday(sessionDate)) return { text: "Yesterday", highlight: false };
      if (daysUntil <= 7) return { text: `${daysUntil}d ago`, highlight: false };
      return { text: format(sessionDate, "MMM d"), highlight: false };
    } else {
      if (isToday(sessionDate)) {
        if (hoursUntil < 1) return { text: "< 1 hour", highlight: true };
        return { text: `In ${hoursUntil}h`, highlight: true };
      }
      if (isTomorrow(sessionDate)) return { text: "Tomorrow", highlight: true };
      if (daysUntil <= 7) return { text: `In ${daysUntil} days`, highlight: false };
      return { text: format(sessionDate, "MMM d"), highlight: false };
    }
  };

  const { text: timeText, highlight } = getRelativeTime();
  const isPast = type === "last";

  return (
    <div 
      className="relative pl-10 group cursor-pointer"
      onClick={onClick}
    >
      {/* Timeline dot with status */}
      <div
        className={`absolute left-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
          isPast
            ? isDark 
              ? "bg-zinc-800 border-zinc-600" 
              : "bg-gray-100 border-gray-400"
            : highlight
              ? isDark
                ? "bg-blue-900/30 border-blue-500"
                : "bg-blue-50 border-blue-400"
              : isDark
                ? "bg-green-900/30 border-green-600"
                : "bg-green-50 border-green-500"
        }`}
      >
        <div className={`w-3 h-3 rounded-full ${
          isPast
            ? isDark ? "bg-zinc-500" : "bg-gray-500"
            : highlight
              ? "bg-blue-500 animate-pulse"
              : "bg-green-500"
        }`} />
      </div>

      <div
        className={`p-3 rounded-lg border transition-all duration-200 ${
          isDark 
            ? "bg-zinc-800/50 border-zinc-700/50 hover:bg-zinc-800/70 hover:border-zinc-600/50" 
            : "bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300"
        }`}
      >
        {/* Time badge */}
        <div className="flex items-center justify-between mb-2">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            isPast
              ? isDark 
                ? "bg-zinc-700/50 text-zinc-400" 
                : "bg-gray-100 text-gray-600"
              : highlight
                ? isDark
                  ? "bg-blue-500/20 text-blue-400"
                  : "bg-blue-100 text-blue-700"
                : isDark
                  ? "bg-green-500/20 text-green-400"
                  : "bg-green-100 text-green-700"
          }`}>
            {timeText}
          </span>
          <ArrowRight className={`w-3 h-3 transition-transform group-hover:translate-x-0.5 ${
            isDark ? "text-zinc-600" : "text-gray-400"
          }`} />
        </div>

        {/* Session info */}
        <h4 className={`text-sm font-medium mb-1 ${
          isDark ? "text-white" : "text-gray-900"
        }`}>
          {session!.session_name || "Training Session"}
        </h4>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1">
            <Clock className={`w-3 h-3 ${
              isDark ? "text-zinc-500" : "text-gray-400"
            }`} />
            <span className={isDark ? "text-zinc-400" : "text-gray-600"}>
              {format(sessionDate, "h:mm a")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
