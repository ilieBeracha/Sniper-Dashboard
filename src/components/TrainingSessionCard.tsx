import { TrainingSession } from "@/types/training";
import { useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { ChevronRight, Clock, MapPin, Bookmark, UserCheck } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useIsMobile } from "@/hooks/useIsMobile";
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
  const isMobile = useIsMobile();
  const participants = session.participants || [];

  const handleSessionClick = () => {
    navigate(`/training/${session.id}`);
  };

  // Desktop design (existing)
  return (
    <div
      onClick={handleSessionClick}
      className="relative p-0 border rounded-lg overflow-hidden transition-all duration-300 ease-in-out cursor-pointer text-sm hover:shadow-md group"
      style={{
        backgroundColor: theme === "dark" ? `${primitives.grey.grey900}80` : primitives.white.white,
        borderColor: theme === "dark" ? `${primitives.white.white}1A` : primitives.grey.grey200
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = theme === "dark" ? `${primitives.white.white}33` : primitives.grey.grey300;
        if (theme === "light") {
          e.currentTarget.style.backgroundColor = primitives.grey.grey50;
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = theme === "dark" ? `${primitives.white.white}1A` : primitives.grey.grey200;
        if (theme === "light") {
          e.currentTarget.style.backgroundColor = primitives.white.white;
        }
      }}
    >
      {/* Status Badge - Absolute positioned */}
      <div className="absolute top-0 right-0 z-10">
        <span
          className="text-xs px-3 py-1.5 rounded-bl-lg font-medium"
          style={{
            backgroundColor: isPast 
              ? `${primitives.grey.grey500}1A` 
              : highlight 
                ? `${primitives.blue.blue500}33` 
                : `${primitives.green.green500}1A`,
            color: isPast 
              ? primitives.grey.grey400 
              : highlight 
                ? primitives.blue.blue300 
                : primitives.green.green400
          }}
        >
          {isPast ? "Finished" : highlight ? "Today" : "Upcoming"}
        </span>
      </div>

      <div className="flex items-stretch">
        {/* Date Section - No gaps */}
        <div
          className="w-[100px] flex flex-col items-center justify-center px-4 py-5"
          style={{
            backgroundColor: theme === "dark" ? `${primitives.white.white}0D` : primitives.grey.grey100
          }}
        >
          <span className="text-2xl font-semibold leading-tight" style={{ color: theme === "dark" ? primitives.white.white : primitives.grey.grey900 }}>
            {showDate ? format(sessionDate, "d") : format(sessionDate, "h:mm")}
          </span>
          <span className="text-sm mt-0.5" style={{ color: theme === "dark" ? primitives.grey.grey400 : primitives.grey.grey600 }}>
            {showDate ? format(sessionDate, "MMM") : format(sessionDate, "a")}
          </span>
        </div>

        {/* Main Info - Seamless connection */}
        <div className="flex-1 px-4 py-3 flex items-center">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-base font-medium" style={{ color: theme === "dark" ? primitives.white.white : primitives.grey.grey900 }}>
                {session.session_name}
              </h4>
              <ChevronRight className="w-5 h-5 ml-2 transition-transform duration-200 group-hover:translate-x-1" style={{ color: theme === "dark" ? primitives.grey.grey400 : primitives.grey.grey600 }} />
            </div>

            <div
              className="flex flex-wrap items-center gap-x-3 text-xs"
              style={{ color: theme === "dark" ? primitives.grey.grey400 : primitives.grey.grey600 }}
            >
              {!isMobile ? (
                <div className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {format(sessionDate, "h:mm a MMM d")}
                </div>
              ) : (
                <div className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {format(sessionDate, "h:mm a")}
                </div>
              )}

              <div className="flex items-center">
                <UserCheck className="w-3 h-3 mr-1" />
                {participants.length} participants
              </div>
              
              {session.assignments && session.assignments.length > 0 && (
                <div className="flex items-center">
                  <Bookmark className="w-3 h-3 mr-1" />
                  {session.assignments.length} assignments
                </div>
              )}
              
              <div className="flex items-center">
                <MapPin className="w-3 h-3 mr-1" />
                {session.location ? (
                  <span className="truncate max-w-[150px]">{session.location}</span>
                ) : (
                  <span className="italic" style={{ color: theme === "dark" ? primitives.grey.grey500 : primitives.grey.grey400 }}>
                    No location
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// if (isMobile) {
//   return (
//     <div
//       onClick={handleSessionClick}
//       className={`
//         relative
//         px-4 py-2
//         rounded-2xl
//         transition-all duration-  200
//         cursor-pointer
//         ${theme === "dark" ? "bg-gradient-to-br from-transparent to-black/10 border border-zinc-800" : "bg-white border border-gray-100 shadow-sm"}
//       `}
//     >
//       <div className="flex items-start justify-between mb-3">
//         {/* Date/Time info */}
//         <div className={`text-sm transition-colors duration-200 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
//           {format(sessionDate, "d MMM, hh:mm")} to {format(sessionDate, "hh:mmaaa")}
//         </div>

//         {/* Status badge */}
//         {(isPast || highlight) && (
//           <span
//             className={`text-xs px-2 py-1 rounded-full font-medium ${
//               isPast
//                 ? theme === "dark"
//                   ? "bg-gray-800 text-gray-400"
//                   : "bg-gray-100 text-gray-600"
//                 : theme === "dark"
//                   ? "bg-red-500/20 text-red-400"
//                   : "bg-red-50 text-red-600"
//             }`}
//           >
//             {isPast && session.status !== TrainingStatus.Completed
//               ? "Finished"
//               : isPast && session.status === TrainingStatus.Completed
//                 ? "Completed"
//                 : "Today"}
//           </span>
//         )}
//       </div>

//       {/* Title */}
//       <h3 className={`text-lg font-semibold mb-3 transition-colors duration-200 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
//         {session.session_name}
//       </h3>

//       {/* Participants and Price */}
//       <div className="flex items-center gap-2 justify-between">
//         {/* Participant avatars */}
//         <div className="flex items-center">
//           <div className="flex -space-x-2">
//             {participants.slice(0, 3).map((participant, idx) => (
//               <div
//                 key={idx}
//                 className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium border-2 ${
//                   theme === "dark" ? "bg-zinc-700 border-zinc-900 text-zinc-300" : "bg-gray-200 border-white text-gray-700"
//                 }`}
//               >
//                 {participant.user?.first_name?.charAt(0).toUpperCase() || "U"}
//               </div>
//             ))}
//             {participants.length > 3 && (
//               <div
//                 className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium border-2 ${
//                   theme === "dark" ? "bg-zinc-800 border-zinc-900 text-zinc-400" : "bg-gray-100 border-white text-gray-600"
//                 }`}
//               >
//                 +{participants.length - 3}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Assignment count as "price" */}
//         <div
//           className={`text-lg flex items-center gap-2  justify-between w-full font-semibold transition-colors duration-200 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
//         >
//           <div className="flex justify-center items-center gap-2">
//             <User className="w-4 h-4 mr-1.5" />
//             <span className="text-sm">{session.creator_id?.first_name}</span>
//           </div>
//           {session.assignments && session.assignments.length > 0 && session.assignments.length}{" "}
//           {session.assignments && session.assignments.length === 1 ? "task" : "tasks"}
//         </div>
//       </div>
//     </div>
//   );
// }
