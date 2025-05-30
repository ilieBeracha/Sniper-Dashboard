import { TrainingSession } from "@/types/training";
import { useNavigate } from "react-router-dom";
import { format, parseISO, isValid } from "date-fns";
import { ChevronRight, Clock, MapPin, Bookmark, UserCheck } from "lucide-react";
import { isMobile } from "react-device-detect";

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
  const sessionDate = parseISO(session.date);

  const participants = session.participants || [];
  const assignments = session.assignment_sessions || [];

  const handleSessionClick = () => {
    navigate(`/training/${session.id}`);
  };

  return (
    <div
      onClick={handleSessionClick}
      className={`
        relative
        pl-4 pr-4 py-2
        border border-white/10 rounded-lg overflow-hidden
        bg-gradient-to-br from-white/5 to-white/[0.02] 
        hover:from-white/10 hover:to-white/[0.05] 
        transition-all duration-500 ease-in-out
        cursor-pointer
        text-sm
        justify-center
        items-center
        
      `}
    >
      {/* Status */}
      <div className=" flex flex-col items-end gap-2 absolute top-0 right-0 text-sm ">
        <span
          className={`text-xs  px-2 py-1 rounded-bl-lg rounded-tr-lg 
              ${isPast ? "bg-gray-500/10 text-gray-400" : highlight ? "bg-indigo-500/20 text-indigo-300" : "bg-green-500/10 text-green-400"}
            `}
        >
          {isPast ? "Completed" : highlight ? "Today" : "Upcoming"}
        </span>

        <ChevronRight className="w-4 h-4 text-gray-400" />
      </div>
      <div className="flex items-center justify-between text-sm ">
        {/* Date */}
        <div className="w-[100px] h-full text-sm">
          <div className="flex flex-col items-center justify-center bg-white/5 rounded-lg p-2">
            <span className="text-base font-semibold text-white">{showDate ? (isValid(sessionDate) ? format(sessionDate, "d") : "N/A") : (isValid(sessionDate) ? format(sessionDate, "h:mm") : "N/A")}</span>
            <span className="text-xs text-gray-400">{showDate ? (isValid(sessionDate) ? format(sessionDate, "MMM") : "N/A") : (isValid(sessionDate) ? format(sessionDate, "a") : "N/A")}</span>
          </div>
        </div>

        {/* Main Info */}
        <div className="flex-1 ml-4">
          <div className="flex items-center gap-2">
            <h4 className=" text-white text-sm">{session.session_name}</h4>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 mt-1 text-gray-400 text-xs">
            {showDate && !isMobile && (
              <div className="flex items-center">
                <Clock className="w-3 h-3 mr-1.5" />
                {isValid(sessionDate) ? format(sessionDate, "h:mm a") : "N/A"}
              </div>
            )}

            <div className="flex items-center">
              <UserCheck className="w-3 h-3 mr-1.5" />
              {participants.length} participants
            </div>
            {assignments.length > 0 && (
              <div className="flex items-center">
                <Bookmark className="w-3 h-3 mr-1.5" />
                {assignments.length} assignments
              </div>
            )}
            <div className="flex items-center mt-1 *:text-xs">
              <MapPin className="w-3 h-3 mr-1.5" />
              {session.location ? (
                <span className="truncate max-w-[120px]">{session.location}</span>
              ) : (
                <span className="text-gray-500 italic">Unknown location</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
