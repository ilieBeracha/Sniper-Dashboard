import { format } from "date-fns";
import { Sun, Moon, Activity, Clock, Info } from "lucide-react";
import { Tooltip } from "react-tooltip";
import { useTheme } from "@/contexts/ThemeContext";
import { primitives } from "@/styles/core";
import { useIsMobile } from "@/hooks/useIsMobile";

interface SessionStatsCardGridProps {
  data: any[];
  onCardClick?: (session: any) => void;
  onEdit?: (session: any) => void;
  onDelete?: (session: any) => void;
}

export default function SessionStatsCardGrid({ data, onCardClick, onEdit, onDelete }: SessionStatsCardGridProps) {
  const { theme } = useTheme();
  const isMobile = useIsMobile();

  if (!data || data.length === 0) {
    return <div className="text-center py-12 opacity-70 text-sm">No session stats yet</div>;
  }

  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(260px, 1fr))" }}>
      {data.map((item) => {
        const assignmentName = item.assignment_session?.assignment?.assignment_name || "Unknown";
        const shooterName = item.users ? `${item.users.first_name} ${item.users.last_name}`.trim() || item.users.email : "N/A";
        return (
          <div
            key={item.id}
            className={`rounded-xl border p-4 flex flex-col gap-3 transition cursor-pointer hover:shadow-md ${
              theme === "dark" ? "border-white/10 bg-zinc-900/40" : "border-gray-200 bg-white"
            }`}
            onClick={() => onCardClick?.(item)}
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm truncate" title={assignmentName}>
                {assignmentName}
              </h3>
              <span className="text-xs opacity-70">{format(new Date(item.created_at), "dd MMM HH:mm")}</span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 text-xs">
              {/* Day/Night */}
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${
                  item.day_period === "day"
                    ? theme === "dark"
                      ? "bg-yellow-600/20 text-yellow-300"
                      : "bg-yellow-100 text-yellow-700"
                    : theme === "dark"
                      ? "bg-indigo-600/20 text-indigo-300"
                      : "bg-indigo-100 text-indigo-700"
                }`}
              >
                {item.day_period === "day" ? <Sun size={12} /> : <Moon size={12} />} {item.day_period}
              </span>

              {/* Effort */}
              {item.effort !== null && (
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${
                    item.effort
                      ? theme === "dark"
                        ? "bg-green-600/20 text-green-300"
                        : "bg-green-100 text-green-700"
                      : theme === "dark"
                        ? "bg-red-600/20 text-red-300"
                        : "bg-red-100 text-red-700"
                  }`}
                >
                  <Activity size={12} /> {item.effort ? "Effort" : "No Effort"}
                </span>
              )}
            </div>

            {/* Shooter */}
            <div className="text-xs opacity-80 truncate" title={shooterName}>
              Shooter: {shooterName}
            </div>

            {/* Stats Row */}
            <div className="flex items-center gap-3 text-xs">
              {item.time_to_first_shot_sec !== null && (
                <div className="inline-flex items-center gap-1" title="Time to first shot">
                  <Clock size={12} /> {item.time_to_first_shot_sec}s
                </div>
              )}

              {item.note && (
                <div className="inline-flex items-center gap-1" data-tooltip-id={`note-${item.id}`} data-tooltip-content={item.note}>
                  <Info size={12} /> Note
                  <Tooltip
                    id={`note-${item.id}`}
                    className={`!opacity-100 !border !rounded-lg !p-2 !text-xs ${
                      theme === "dark" ? "!bg-[#1A1A1A] !text-gray-300 !border-white/10" : "!bg-white !text-gray-700 !border-gray-200"
                    }`}
                  />
                </div>
              )}
            </div>

            {/* Edit/Delete Actions */}
            {(onEdit || onDelete) && (
              <div className="flex justify-end gap-2 mt-auto text-xs">
                {onEdit && (
                  <button
                    className={`px-2 py-0.5 rounded-md border ${theme === "dark" ? "border-white/10 hover:bg-white/5" : "border-gray-200 hover:bg-gray-100"}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(item);
                    }}
                  >
                    Edit
                  </button>
                )}
                {onDelete && (
                  <button
                    className={`px-2 py-0.5 rounded-md border ${theme === "dark" ? "border-white/10 hover:bg-white/5" : "border-gray-200 hover:bg-gray-100"}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(item);
                    }}
                  >
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
