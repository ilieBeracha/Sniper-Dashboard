import { TrainingSession } from "@/types/training";
import { useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { ChevronRight, Clock, MapPin, Bookmark } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { primitives } from "@/styles/core";
import { Checkbox } from "@/components/ui/checkbox";

interface TrainingSessionCardSelectableProps {
  session: TrainingSession;
  showDate?: boolean;
  highlight?: boolean;
  isPast?: boolean;
  isSelectable?: boolean;
  isSelected?: boolean;
  onSelectionChange?: (sessionId: string, isSelected: boolean) => void;
}

export function TrainingSessionCardSelectable({
  session,
  showDate = true,
  highlight = false,
  isPast = false,
  isSelectable = false,
  isSelected = false,
  onSelectionChange,
}: TrainingSessionCardSelectableProps) {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const sessionDate = parseISO(session.date);

  // Ensure session has an ID
  if (!session.id) return null;
  const sessionId = session.id;

  const handleCardClick = (e: React.MouseEvent) => {
    // If clicking on checkbox area, don't navigate
    if (isSelectable && (e.target as HTMLElement).closest('.checkbox-wrapper')) {
      return;
    }
    
    if (isSelectable) {
      // In selection mode, clicking anywhere on the card toggles selection
      e.preventDefault();
      e.stopPropagation();
      onSelectionChange?.(sessionId, !isSelected);
    } else {
      // Normal mode - navigate to training details
      navigate(`/training/${sessionId}`);
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    onSelectionChange?.(sessionId, checked);
  };

  return (
    <div className="relative flex items-start gap-3">
      {isSelectable && (
        <div className="checkbox-wrapper flex items-center pt-4">
          <Checkbox
            checked={isSelected}
            onCheckedChange={handleCheckboxChange}
            className="cursor-pointer"
          />
        </div>
      )}
      
      <div
        onClick={handleCardClick}
        className={`flex-1 relative p-0 border rounded-lg overflow-hidden transition-all duration-300 ease-in-out text-sm hover:shadow-md group ${
          isSelectable ? 'cursor-pointer' : 'cursor-pointer'
        } ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
        style={{
          backgroundColor: theme === "dark" ? `${primitives.grey.grey900}80` : primitives.white.white,
          borderColor: isSelected 
            ? 'transparent' 
            : theme === "dark" ? `${primitives.white.white}1A` : primitives.grey.grey200,
        }}
        onMouseEnter={(e) => {
          if (!isSelected) {
            e.currentTarget.style.borderColor = theme === "dark" ? `${primitives.white.white}33` : primitives.grey.grey300;
            if (theme === "light") {
              e.currentTarget.style.backgroundColor = primitives.grey.grey50;
            }
          }
        }}
        onMouseLeave={(e) => {
          if (!isSelected) {
            e.currentTarget.style.borderColor = theme === "dark" ? `${primitives.white.white}1A` : primitives.grey.grey200;
            if (theme === "light") {
              e.currentTarget.style.backgroundColor = primitives.white.white;
            }
          }
        }}
      >
        {/* Status Badge - Absolute positioned */}
        {highlight && (
          <div className="absolute top-3 right-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          </div>
        )}

        {/* Header section with colored stripe */}
        <div className="px-4 py-3 pb-0">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3
                className="font-semibold flex items-center gap-2"
                style={{
                  color: isPast
                    ? theme === "dark"
                      ? primitives.grey.grey400
                      : primitives.grey.grey600
                    : theme === "dark"
                    ? primitives.white.white
                    : primitives.grey.grey900,
                }}
              >
                {session.session_name}
                {highlight && <Bookmark className="w-4 h-4 text-green-500" />}
              </h3>
              {showDate && (
                <div className="flex items-center gap-3 mt-1">
                  <span
                    className="text-xs flex items-center gap-1"
                    style={{
                      color: theme === "dark" ? primitives.grey.grey500 : primitives.grey.grey600,
                    }}
                  >
                    <Clock className="w-3 h-3" />
                    {format(sessionDate, "MMM d, h:mm a")}
                  </span>
                  {session.location && (
                    <span
                      className="text-xs flex items-center gap-1"
                      style={{
                        color: theme === "dark" ? primitives.grey.grey500 : primitives.grey.grey600,
                      }}
                    >
                      <MapPin className="w-3 h-3" />
                      {session.location}
                    </span>
                  )}
                </div>
              )}
            </div>
            {!isSelectable && (
              <ChevronRight
                className="w-5 h-5 mt-0.5 transition-transform duration-200 group-hover:translate-x-1"
                style={{
                  color: theme === "dark" ? primitives.grey.grey600 : primitives.grey.grey400,
                }}
              />
            )}
          </div>
        </div>

        {/* Assignment Info */}
        <div className="px-4 pb-3">
          <div className="flex items-center justify-between mt-3">
            {session.assignments && session.assignments.length > 0 && (
              <div className="flex items-center gap-2">
                <Bookmark className="w-3 h-3" style={{ color: theme === "dark" ? primitives.grey.grey500 : primitives.grey.grey600 }} />
                <span
                  className="text-xs"
                  style={{
                    color: theme === "dark" ? primitives.grey.grey500 : primitives.grey.grey600,
                  }}
                >
                  {session.assignments.length} assignment{session.assignments.length > 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}