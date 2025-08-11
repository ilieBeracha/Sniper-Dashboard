import { TrainingSession, TrainingStatus } from "@/types/training";
import { useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { ChevronRight, Clock, MapPin, Bookmark, Users } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { primitives } from "@/styles/core";

export function TrainingSessionCard({
  session,
  showDate = true,
  highlight = false,
  isPast = false,
}: {
  session: TrainingSession;
  currentUserId?: string;
  showDate?: boolean;
  highlight?: boolean;
  isPast?: boolean;
}) {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const sessionDate = parseISO(session.date);

  const handleSessionClick = () => {
    navigate(`/training/${session.id}`);
  };

  const statusTextMap: Record<string, string> = {
    [TrainingStatus.Scheduled]: "Scheduled",
    [TrainingStatus.InProgress]: "In progress",
    [TrainingStatus.Completed]: "Finished",
    [TrainingStatus.Finished]: "Finished",
    [TrainingStatus.Canceled]: "Canceled",
  };

  const statusText = session.status ? statusTextMap[session.status] ?? (isPast ? "Finished" : highlight ? "Today" : "Upcoming") : isPast ? "Finished" : highlight ? "Today" : "Upcoming";

  const isCanceled = session.status === TrainingStatus.Canceled;
  const isInProgress = session.status === TrainingStatus.InProgress;
  const isFinished = isPast || session.status === TrainingStatus.Completed || session.status === TrainingStatus.Finished;

  const badgeBg = isCanceled
    ? `${primitives.red.red500}1A`
    : isFinished
    ? `${primitives.grey.grey500}1A`
    : highlight || isInProgress
    ? `${primitives.blue.blue500}33`
    : `${primitives.green.green500}1A`;

  const badgeColor = isCanceled
    ? primitives.red.red400
    : isFinished
    ? primitives.grey.grey400
    : highlight || isInProgress
    ? primitives.blue.blue300
    : primitives.green.green400;

  const accentHex = isCanceled
    ? primitives.red.red500
    : isFinished
    ? primitives.grey.grey500
    : highlight || isInProgress
    ? primitives.blue.blue500
    : primitives.green.green500;

  // Desktop design (enhanced)
  return (
    <div
      onClick={handleSessionClick}
      className={`relative group overflow-hidden cursor-pointer text-sm rounded-lg border transition-all ${
        theme === "dark"
          ? "border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800/70 hover:border-zinc-700 hover:shadow-xl"
          : "border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 hover:shadow-lg"
      }`}
    >
      {/* Gradient hover accent */}
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none ${
          theme === "dark" ? "bg-gradient-to-br from-zinc-800/20 to-transparent" : "bg-gradient-to-br from-gray-100/50 to-transparent"
        }`}
      />

      {/* Left status accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ backgroundColor: accentHex }} />

      {/* Status Badge - Absolute positioned */}
      <div className="absolute top-0 right-0 z-10">
        <span
          className="text-xs px-3 py-1.5 rounded-bl-lg font-medium"
          style={{
            backgroundColor: badgeBg,
            color: badgeColor,
          }}
        >
          {statusText}
        </span>
      </div>

      <div className="flex items-stretch pl-1.5">{/* account for left accent */}
        {/* Date Section */}
        <div
          className={`w-[100px] flex flex-col items-center justify-center px-4 py-5 ${
            theme === "dark" ? "bg-zinc-800/50" : "bg-gray-100"
          }`}
        >
          <span
            className="text-2xl font-semibold leading-tight"
            style={{ color: theme === "dark" ? primitives.white.white : primitives.grey.grey900 }}
          >
            {showDate ? format(sessionDate, "d") : format(sessionDate, "h:mm")}
          </span>
          <span className="text-sm mt-0.5" style={{ color: theme === "dark" ? primitives.grey.grey400 : primitives.grey.grey600 }}>
            {showDate ? format(sessionDate, "MMM") : format(sessionDate, "a")}
          </span>
          <span className="text-xs mt-0.5" style={{ color: theme === "dark" ? primitives.grey.grey500 : primitives.grey.grey500 }}>
            {format(sessionDate, "EEE")}
          </span>
        </div>

        {/* Main Info */}
        <div className="flex-1 px-4 py-4 flex items-center">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-base font-medium" style={{ color: theme === "dark" ? primitives.white.white : primitives.grey.grey900 }}>
                {session.session_name}
              </h4>
            </div>

            {/* Meta pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${
                  theme === "dark" ? "bg-zinc-800/60 text-zinc-300" : "bg-gray-100 text-gray-700"
                }`}
              >
                <Clock className="w-3 h-3" /> {format(sessionDate, "h:mm a")}
              </span>

              {session.assignments && session.assignments.length > 0 && (
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${
                    theme === "dark" ? "bg-blue-500/10 text-blue-300" : "bg-blue-50 text-blue-700"
                  }`}
                >
                  <Bookmark className="w-3 h-3" /> {session.assignments.length} assignments
                </span>
              )}

              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${
                  session.location
                    ? theme === "dark" ? "bg-zinc-800/60 text-zinc-300" : "bg-gray-100 text-gray-700"
                    : theme === "dark" ? "bg-zinc-900/60 text-zinc-500" : "bg-gray-50 text-gray-400 italic"
                }`}
                title={session.location || undefined}
              >
                <MapPin className="w-3 h-3" /> {session.location ? session.location : "No location"}
              </span>

              {session.participants && session.participants.length > 0 && (
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${
                    theme === "dark" ? "bg-green-500/10 text-green-300" : "bg-green-50 text-green-700"
                  }`}
                >
                  <Users className="w-3 h-3" /> {session.participants.length} participants
                </span>
              )}
            </div>
          </div>
          <ChevronRight
            className={`w-5 h-5 ml-2 transition-transform duration-200 ${
              theme === "dark" ? "text-zinc-400" : "text-gray-600"
            } group-hover:translate-x-1`}
          />
        </div>
      </div>
    </div>
  );
}
