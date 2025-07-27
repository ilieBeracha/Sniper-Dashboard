import { TrainingSession } from "@/types/training";
import { useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { ChevronRight, Clock, MapPin, Bookmark } from "lucide-react";
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

  // Desktop design (existing)
  return (
    <div
      onClick={handleSessionClick}
      className="relative p-0 border rounded-lg overflow-hidden transition-all duration-300 ease-in-out cursor-pointer text-sm hover:shadow-md group"
      style={{
        backgroundColor: theme === "dark" ? `${primitives.grey.grey900}80` : primitives.white.white,
        borderColor: theme === "dark" ? `${primitives.white.white}1A` : primitives.grey.grey200,
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
            backgroundColor: isPast ? `${primitives.grey.grey500}1A` : highlight ? `${primitives.blue.blue500}33` : `${primitives.green.green500}1A`,
            color: isPast ? primitives.grey.grey400 : highlight ? primitives.blue.blue300 : primitives.green.green400,
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
            backgroundColor: theme === "dark" ? `${primitives.white.white}0D` : primitives.grey.grey100,
          }}
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
        </div>

        {/* Main Info - Seamless connection */}
        <div className="flex-1 px-4 py-3 flex items-center">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-base font-medium" style={{ color: theme === "dark" ? primitives.white.white : primitives.grey.grey900 }}>
                {session.session_name}
              </h4>
            </div>

            <div
              className="flex flex-wrap items-center gap-x-3 text-xs"
              style={{ color: theme === "dark" ? primitives.grey.grey400 : primitives.grey.grey600 }}
            >
              <div className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {format(sessionDate, "h:mm a")}
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
          <ChevronRight
            className="w-5 h-5 ml-2 transition-transform duration-200 group-hover:translate-x-1"
            style={{ color: theme === "dark" ? primitives.grey.grey400 : primitives.grey.grey600 }}
          />
        </div>
      </div>
    </div>
  );
}
