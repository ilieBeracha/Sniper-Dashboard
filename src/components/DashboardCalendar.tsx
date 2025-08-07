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
    <div className="relative">
      {/* Timeline line */}
      <div
        className="absolute left-3 top-0 bottom-0 w-0.5 rounded-full"
        style={{
          background:
            theme === "dark"
              ? `linear-gradient(to bottom, ${primitives.green.green500}40 0%, ${primitives.blue.blue500}40 100%)`
              : `linear-gradient(to bottom, ${primitives.green.green200} 0%, ${primitives.blue.blue200} 100%)`,
        }}
      />

      <div className="space-y-4">
        {/* Last Training */}
        <TimelineCard session={last} type="last" onClick={last ? () => navigate(`/training/${last.id}`) : undefined} isEmpty={!last} />

        {/* Next Training */}
        <TimelineCard session={next} type="next" onClick={next ? () => navigate(`/training/${next.id}`) : undefined} isEmpty={!next} />
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
      <div className="relative pl-8">
        {/* Timeline dot */}
        <div
          className="absolute left-0 w-6 h-6 rounded-full border-2 flex items-center justify-center"
          style={{
            backgroundColor: isDark ? primitives.grey.grey900 : primitives.white.white,
            borderColor: isDark ? primitives.grey.grey700 : primitives.grey.grey300,
          }}
        >
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: isDark ? primitives.grey.grey700 : primitives.grey.grey300 }} />
        </div>

        <div
          className="p-4 rounded-xl border border-dashed"
          style={{
            backgroundColor: isDark ? `${primitives.grey.grey900}40` : primitives.grey.grey50,
            borderColor: isDark ? primitives.grey.grey800 : primitives.grey.grey300,
          }}
        >
          <div className="flex items-center gap-2">
            <Calendar size={16} className="opacity-30" />
            <span className="text-sm opacity-50">No {type} training scheduled</span>
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
      if (isToday(sessionDate)) return "Today";
      if (isYesterday(sessionDate)) return "Yesterday";
      if (daysUntil <= 7) return `${daysUntil}d ago`;
      return format(sessionDate, "MMM d");
    } else {
      if (isToday(sessionDate)) {
        if (hoursUntil < 1) return "< 1 hour";
        return `${hoursUntil} hours`;
      }
      if (isTomorrow(sessionDate)) return "Tomorrow";
      if (daysUntil <= 7) return `${daysUntil} days`;
      return format(sessionDate, "MMM d");
    }
  };

  const isUrgent = type === "next" && isToday(sessionDate) && hoursUntil < 3;

  return (
    <div className="relative pl-8">
      {/* Timeline dot */}
      <div
        className="absolute left-0 w-6 h-6 rounded-full border-3 flex items-center justify-center"
        style={{
          backgroundColor: isDark ? primitives.grey.grey900 : primitives.white.white,
          borderColor: type === "last" ? primitives.green.green500 : primitives.blue.blue500,
        }}
      >
        <div
          className="w-3 h-3 rounded-full"
          style={{
            backgroundColor: type === "last" ? primitives.green.green500 : primitives.blue.blue500,
          }}
        />
      </div>

      {/* Card */}
      <div
        onClick={onClick}
        className={`
          group relative overflow-hidden rounded-xl border p-3 cursor-pointer
          transition-all duration-200 hover:shadow-lg
          ${
            isDark
              ? "bg-zinc-900/50 border-zinc-800 hover:bg-zinc-800/50 hover:border-zinc-700"
              : "bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300"
          }
          ${isUrgent ? "ring-2 ring-orange-500/50" : ""}
        `}
      >
        {/* Background pattern */}
        <div
          className="absolute top-0 right-0 w-40 h-40 opacity-5"
          style={{
            background: `radial-gradient(circle, ${type === "last" ? primitives.green.green500 : primitives.blue.blue500} 0%, transparent 70%)`,
          }}
        />

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="text-xs font-medium uppercase tracking-wider"
                  style={{
                    color:
                      type === "last"
                        ? isDark
                          ? primitives.green.green400
                          : primitives.green.green600
                        : isDark
                          ? primitives.blue.blue400
                          : primitives.blue.blue600,
                  }}
                >
                  {type === "last" ? "Previous Session" : "Upcoming Session"}
                </span>
                {isUrgent && <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-500">Starting soon</span>}
              </div>
              <h3 className="text-base font-semibold mb-2 pr-8">{session!.session_name}</h3>
            </div>
            <ArrowRight
              size={16}
              className="opacity-0 group-hover:opacity-100 transition-opacity mt-1"
              style={{ color: isDark ? primitives.grey.grey400 : primitives.grey.grey600 }}
            />
          </div>

          {/* Date/Time info */}
          <div className="flex items-center gap-4 mb-3 text-sm">
            <div className="flex items-center gap-2">
              <Calendar size={14} className="opacity-50" />
              <span className="font-medium">{format(sessionDate, "EEE, MMM d")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={14} className="opacity-50" />
              <span>{format(sessionDate, "HH:mm")}</span>
            </div>
            <span className="text-xs opacity-60">({getRelativeTime()})</span>
          </div>

          {/* Metrics */}
          {/* <div className="flex items-center gap-6">
            {getMetrics().map((metric, i) => (
              <div key={i} className="flex items-center gap-2">
                <div
                  className={`
                  p-1.5 rounded
                  ${isDark ? "bg-zinc-800" : "bg-gray-100"}
                `}
                >
                  <metric.icon size={14} className="opacity-60" />
                </div>
                <div>
                  <p className="text-sm font-medium">{metric.value}</p>
                  <p className="text-xs opacity-50">{metric.label}</p>
                </div>
              </div>
            ))}
          </div> */}
        </div>
      </div>
    </div>
  );
}
