import { TrainingSession, Assignment } from "@/types/training";
import { useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { ChevronRight, Clock, MapPin, Bookmark, Lock, UserCheck, Edit } from "lucide-react";
import TrainingParticipantBadge from "./TrainingParticipantBadge";

export function TrainingSessionCard({
  session,
  currentUserId,
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
  const assignments = session.assignment_session || [];

  const isParticipant = participants.some((p) => p.participant_id === currentUserId);
  const canAccess = !isPast || (isPast && isParticipant);

  const handleSessionClick = () => {
    if (!canAccess) {
      alert("Only participants can access details of completed training sessions");
      return;
    }
    navigate(`/training/${session.id}`);
  };

  return (
    <div
      onClick={handleSessionClick}
      className={`
        border border-white/5 rounded-lg p-3 min-h-[50px]
        ${highlight ? "bg-indigo-500/5 border-indigo-500/20" : isPast ? "bg-[#1A1A1A]" : "bg-[#1E1E1E]"}
        hover:bg-[#252525] transition-all duration-200 
        ${highlight ? "shadow-md shadow-indigo-900/10" : ""}
        ${canAccess ? "cursor-pointer" : "cursor-not-allowed opacity-80"}
      `}
    >
      <div className="flex items-center justify-between">
        {/* Date */}
        <div className="min-w-[60px] mr-3">
          <div className="flex flex-col items-center justify-center bg-[#161616] rounded-md p-1.5">
            <span className="text-xs font-bold text-white">{showDate ? format(sessionDate, "d") : format(sessionDate, "h:mm")}</span>
            <span className="text-[10px] text-gray-400">{showDate ? format(sessionDate, "MMM") : format(sessionDate, "a")}</span>
          </div>
        </div>

        {/* Main Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-white text-sm">{session.session_name}</h4>
            {isParticipant && <TrainingParticipantBadge />}

            {isPast &&
              (isParticipant ? <div className="w-3.5 h-3.5 bg-green-500 rounded-full"></div> : <Lock className="w-3.5 h-3.5 text-gray-500" />)}
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-gray-400 text-xs">
            {showDate && (
              <div className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {format(sessionDate, "h:mm a")}
              </div>
            )}
            <div className="flex items-center">
              <MapPin className="w-3 h-3 mr-1" />
              {session.location ? (
                <span className="truncate max-w-[120px]">{session.location}</span>
              ) : (
                <span className="text-gray-500 italic">Unknown location</span>
              )}
            </div>
            <div className="flex items-center">
              <UserCheck className="w-3 h-3 mr-1" />
              {participants.length} participants
            </div>
            {assignments.length > 0 && (
              <div className="flex items-center">
                <Bookmark className="w-3 h-3 mr-1" />
                {assignments.length} assignments
              </div>
            )}
          </div>
        </div>

        {/* Status */}
        <div className="ml-3 flex flex-col items-end">
          <span
            className={`text-[10px] font-medium px-2 py-0.5 rounded-full
              ${isPast ? "bg-gray-500/10 text-gray-400" : highlight ? "bg-indigo-500/20 text-indigo-300" : "bg-green-500/10 text-green-400"}
            `}
          >
            {isPast ? "Completed" : highlight ? "Today" : "Upcoming"}
          </span>

          <div className="mt-2">
            {canAccess ? (
              isPast ? (
                <Edit className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-500" />
              )
            ) : (
              <div className="rounded-full bg-gray-800/50 p-1">
                <Lock className="w-3.5 h-3.5 text-gray-600" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Assignments Preview */}
      {assignments.length > 0 && (
        <div className="mt-2 pl-16 flex flex-wrap gap-1">
          {assignments.slice(0, 3).map((assignment: Assignment) => (
            <span key={assignment.id} className="inline-block px-1.5 py-0.5 bg-[#161616] rounded text-xs text-gray-400">
              {assignment.assignment.assignment_name}
            </span>
          ))}
          {assignments.length > 3 && <span className="inline-block px-1.5 py-0.5 text-xs text-gray-500">+{assignments.length - 3} more</span>}
        </div>
      )}
    </div>
  );
}
