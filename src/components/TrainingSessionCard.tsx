import { TrainingSession, TrainingStatus } from "@/types/training";
import { useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { ChevronRight, Clock, MapPin, Bookmark, UserCheck, User } from "lucide-react";
import { isMobile } from "react-device-detect";
import { useTheme } from "@/contexts/ThemeContext";

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

  const participants = session.participants || [];

  const handleSessionClick = () => {
    navigate(`/training/${session.id}`);
  };

  // Mobile-first design like the event cards in the image
  if (isMobile) {
    return (
      <div
        onClick={handleSessionClick}
        className={`
          relative
          p-4
          rounded-2xl
          transition-all duration-  200
          cursor-pointer
          ${theme === "dark" ? "bg-zinc-900 border border-zinc-800" : "bg-white border border-gray-100 shadow-sm"}
        `}
      >
        <div className="flex items-start justify-between mb-3">
          {/* Date/Time info */}
          <div className={`text-sm transition-colors duration-200 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
            {format(sessionDate, "d MMM, hh:mm")} to {format(sessionDate, "hh:mmaaa")}
          </div>

          {/* Status badge */}
          {(isPast || highlight) && (
            <span
              className={`text-xs px-2 py-1 rounded-full font-medium ${
                isPast
                  ? theme === "dark"
                    ? "bg-gray-800 text-gray-400"
                    : "bg-gray-100 text-gray-600"
                  : theme === "dark"
                    ? "bg-red-500/20 text-red-400"
                    : "bg-red-50 text-red-600"
              }`}
            >
              {isPast && session.status !== TrainingStatus.Completed
                ? "Finished"
                : isPast && session.status === TrainingStatus.Completed
                  ? "Completed"
                  : "Today"}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className={`text-lg font-semibold mb-3 transition-colors duration-200 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
          {session.session_name}
        </h3>

        {/* Participants and Price */}
        <div className="flex items-center gap-2 justify-between">
          {/* Participant avatars */}
          <div className="flex items-center">
            <div className="flex -space-x-2">
              {participants.slice(0, 3).map((participant, idx) => (
                <div
                  key={idx}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium border-2 ${
                    theme === "dark" ? "bg-zinc-700 border-zinc-900 text-zinc-300" : "bg-gray-200 border-white text-gray-700"
                  }`}
                >
                  {participant.user?.first_name?.charAt(0).toUpperCase() || "U"}
                </div>
              ))}
              {participants.length > 3 && (
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium border-2 ${
                    theme === "dark" ? "bg-zinc-800 border-zinc-900 text-zinc-400" : "bg-gray-100 border-white text-gray-600"
                  }`}
                >
                  +{participants.length - 3}
                </div>
              )}
            </div>
          </div>

          {/* Assignment count as "price" */}
          <div
            className={`text-lg flex items-center gap-2  justify-between w-full font-semibold transition-colors duration-200 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
          >
            <div className="flex justify-center items-center gap-2">
              <User className="w-4 h-4 mr-1.5" />
              <span className="text-sm">{session.creator_id?.first_name}</span>
            </div>
            {session.assignments && session.assignments.length > 0 && session.assignments.length}{" "}
            {session.assignments && session.assignments.length === 1 ? "task" : "tasks"}
          </div>
        </div>
      </div>
    );
  }

  // Desktop design (existing)
  return (
    <div
      onClick={handleSessionClick}
      className={`
        relative
        pl-4 pr-4 py-4
        border rounded-lg overflow-hidden
        transition-all duration-500 ease-in-out
        cursor-pointer
        text-sm
        justify-center
        items-center
        ${
          theme === "dark"
            ? "border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] hover:from-white/10 hover:to-white/[0.05]"
            : "border-gray-200 bg-white hover:bg-gray-50"
        }
      `}
    >
      {/* Status */}
      <div className=" flex flex-col items-end gap-2 absolute top-0 right-0 text-sm ">
        <span
          className={`text-xs  px-2 py-1 rounded-bl-lg rounded-tr-lg 
              ${isPast ? "bg-gray-500/10 text-gray-400" : highlight ? "bg-indigo-500/20 text-indigo-300" : "bg-green-500/10 text-green-400"}
            `}
        >
          {isPast ? "Finished" : highlight ? "Today" : "Upcoming"}
        </span>

        <ChevronRight className={`w-4 h-4 transition-colors duration-200 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`} />
      </div>
      <div className="flex items-center justify-between text-sm ">
        {/* Date */}
        <div className="w-[100px] h-full text-sm">
          <div
            className={`flex flex-col items-center justify-center rounded-lg p-2 transition-colors duration-200 ${
              theme === "dark" ? "bg-white/5" : "bg-gray-100"
            }`}
          >
            <span className={`text-base font-semibold transition-colors duration-200 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              {showDate ? format(sessionDate, "d") : format(sessionDate, "h:mm")}
            </span>
            <span className={`text-xs transition-colors duration-200 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              {showDate ? format(sessionDate, "MMM") : format(sessionDate, "a")}
            </span>
          </div>
        </div>

        {/* Main Info */}
        <div className="flex-1 ml-4">
          <div className="flex items-center gap-2">
            <h4 className={`text-sm transition-colors duration-200 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{session.session_name}</h4>
          </div>

          <div
            className={`flex flex-wrap items-center gap-x-4 mt-1 text-xs transition-colors duration-200 ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {showDate && !isMobile && (
              <div className="flex items-center">
                <Clock className="w-3 h-3 mr-1.5" />
                {format(sessionDate, "h:mm a")}
              </div>
            )}

            <div className="flex items-center">
              <UserCheck className="w-3 h-3 mr-1.5" />
              {participants.length} participants
            </div>
            {session.assignments && session.assignments.length > 0 && (
              <div className="flex items-center">
                <Bookmark className="w-3 h-3 mr-1.5" />
                {session.assignments.length} assignments
              </div>
            )}
            <div className="flex items-center mt-1 *:text-xs">
              <MapPin className="w-3 h-3 mr-1.5" />
              {session.location ? (
                <span className="truncate max-w-[120px]">{session.location}</span>
              ) : (
                <span className={`italic transition-colors duration-200 ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>
                  Unknown location
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
