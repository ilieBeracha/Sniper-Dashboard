import { format } from "date-fns";
import { Sun, Moon, Activity, Info, Building2, Edit3, Trash2, Users, MoreVertical, Target, Crosshair, Ruler } from "lucide-react";
import { Tooltip } from "@heroui/tooltip";
import { useTheme } from "@/contexts/ThemeContext";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Popover, PopoverTrigger, PopoverContent, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import ProfileCapitalFirstLatter from "./ProfileCapitalFirstLatter";
import { TooltipContent, TooltipTrigger } from "@radix-ui/react-tooltip";

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
    <div className="grid gap-3" style={{ gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(320px, 1fr))" }}>
      {data.map((item) => {
        const assignmentName = item?.assignment_session?.assignment?.assignment_name || "Unknown";

        const teamName = item.teams?.team_name || "No Team";

        // Calculate total shots and hits from targets
        let totalShots = 0;
        let totalHits = 0;
        
        // Check both possible data structures for targets
        const targets = item.targets || item.target_stats || [];
        
        targets.forEach((target: any) => {
          // Check for engagements in different possible locations
          const engagements = target.engagements || target.target_engagements || [];
          
          engagements.forEach((engagement: any) => {
            totalShots += engagement.shots_fired || 0;
            totalHits += engagement.target_hits || 0;
          });
        });

        // Distances (min-max)
        const distances = targets.map((t: any) => t.distance_m || t.distance).filter(Boolean);
        const minDistance = distances.length ? Math.min(...distances) : null;
        const maxDistance = distances.length ? Math.max(...distances) : null;

        // Calculate hit percentage
        const hitPercentage = totalShots > 0 ? Math.round((totalHits / totalShots) * 100) : 0;

        return (
          <div
            key={item.id}
            className={`group relative rounded-lg border p-3 transition-all cursor-pointer overflow-hidden ${
              theme === "dark"
                ? "border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800/70 hover:border-zinc-700 hover:shadow-xl"
                : "border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 hover:shadow-lg"
            }`}
            onClick={() => onCardClick?.(item)}
          >
            {/* Background accent */}
            <div
              className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none ${
                theme === "dark" ? "bg-gradient-to-br from-zinc-800/20 to-transparent" : "bg-gradient-to-br from-gray-100/50 to-transparent"
              }`}
            />

            {/* Action dropdown - positioned absolute */}
            {(onEdit || onDelete) && (
              <div className="absolute top-2 right-2 z-10">
                <Dropdown placement="bottom-end">
                  <DropdownTrigger>
                    <button
                      className={`p-1.5 rounded-lg transition-colors ${
                        theme === "dark"
                          ? "hover:bg-zinc-800 text-zinc-500 hover:text-zinc-200"
                          : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                      }`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical size={16} />
                    </button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Session actions"
                    className={`${theme === "dark" ? "bg-zinc-800/80 border-zinc-700 rounded-lg" : "bg-gray-200/80 shadow-lg border-gray-200 rounded-lg"}`}
                    onAction={(key) => {
                      if (key === "edit" && onEdit) {
                        onEdit(item);
                      } else if (key === "delete" && onDelete) {
                        onDelete(item);
                      }
                    }}
                  >
                    {onEdit ? (
                      <DropdownItem
                        key="edit"
                        startContent={<Edit3 size={14} />}
                        className={theme === "dark" ? "text-zinc-300 hover:bg-zinc-700" : "text-gray-700 hover:bg-gray-100"}
                      >
                        Edit Session
                      </DropdownItem>
                    ) : null}
                    {onDelete ? (
                      <DropdownItem
                        key="delete"
                        startContent={<Trash2 size={14} />}
                        className={theme === "dark" ? "text-red-400 hover:bg-red-900/20" : "text-red-600 hover:bg-red-50"}
                        color="danger"
                      >
                        Delete Session
                      </DropdownItem>
                    ) : null}
                  </DropdownMenu>
                </Dropdown>
              </div>
            )}

            {/* Main Content */}
            <div className="relative">
              {/* Header Row */}
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm truncate" title={assignmentName}>
                    {assignmentName}
                  </h3>
                  <p className="text-xs opacity-60 mt-0.5">{format(new Date(item.created_at), "dd MMM · HH:mm")}</p>
                </div>
              </div>

              {/* Compact Info Grid */}
              <div className="grid grid-cols-2 gap-2 mb-2">
                {/* Team */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs">
                    <Building2 size={10} className="opacity-50" />
                    <span className="truncate opacity-80" title={teamName}>
                      {teamName}
                    </span>
                  </div>
                </div>

                {/* Shots and Hits Stats */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1">
                      <Target size={10} className="opacity-50" />
                      <span className={`font-medium ${theme === "dark" ? "text-zinc-300" : "text-gray-700"}`}>
                        {totalShots}
                      </span>
                      <span className="opacity-60">shots</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Crosshair size={10} className="opacity-50" />
                      <span className={`font-medium ${theme === "dark" ? "text-zinc-300" : "text-gray-700"}`}>
                        {totalHits}
                      </span>
                      <span className="opacity-60">hits</span>
                      {totalShots > 0 && (
                        <span className={`ml-1 font-medium ${
                          hitPercentage >= 70 
                            ? theme === "dark" ? "text-green-400" : "text-green-600"
                            : hitPercentage >= 50
                            ? theme === "dark" ? "text-yellow-400" : "text-yellow-600"
                            : theme === "dark" ? "text-red-400" : "text-red-600"
                        }`}>
                          ({hitPercentage}%)
                        </span>
                      )}
                    </div>
                  </div>
                  {minDistance !== null && (
                    <div className={`flex items-center gap-1 text-[11px] ${theme === "dark" ? "text-zinc-400" : "text-gray-500"}`}>
                      <Ruler size={10} className="opacity-50" />
                      <span>
                        {minDistance === maxDistance ? `${minDistance}m` : `${minDistance}-${maxDistance}m`}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Row - Tags */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {/* Day/Night */}
                <span
                  className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-medium ${
                    item.day_period === "day"
                      ? theme === "dark"
                        ? "bg-yellow-500/10 text-yellow-400"
                        : "bg-yellow-50 text-yellow-700"
                      : theme === "dark"
                        ? "bg-indigo-500/10 text-indigo-400"
                        : "bg-indigo-50 text-indigo-700"
                  }`}
                >
                  {item.day_period === "day" ? <Sun size={10} /> : <Moon size={10} />}
                  <span className="capitalize">{item.day_period}</span>
                </span>

                {/* Effort */}
                {item.effort !== null && (
                  <span
                    className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-medium ${
                      item.effort
                        ? theme === "dark"
                          ? "bg-green-500/10 text-green-400"
                          : "bg-green-50 text-green-700"
                        : theme === "dark"
                          ? "bg-zinc-700/50 text-zinc-400"
                          : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <Activity size={10} />
                    <span>{item.effort ? "Effort" : "Rest"}</span>
                  </span>
                )}

                {/* Note indicator */}
                {item.note && (
                  <span
                    className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-medium ${
                      theme === "dark" ? "bg-blue-500/10 text-blue-400" : "bg-blue-50 text-blue-700"
                    }`}
                    data-tooltip-id={`note-${item.id}`}
                    data-tooltip-content={item.note}
                  >
                    <span>Note</span>
                    <Tooltip id={`note-${item.id}`}>
                      <TooltipTrigger>
                        <Info size={10} />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">{item.note}</p>
                      </TooltipContent>
                    </Tooltip>
                  </span>
                )}
              </div>
            </div>

            {/* Participants avatars in bottom right corner */}
            <div className="absolute bottom-3 right-3">
              <Popover placement="top-end">
                <PopoverTrigger>
                  <div className="cursor-pointer transition-transform hover:scale-110" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center -space-x-2">
                      {/* Show participants if available */}
                      {(item.session_participants || []).length > 0 ? (
                        <>
                          {/* Show first 3 participants as avatar circles */}
                          {(item.session_participants || []).slice(0, 3).map((participant: any, idx: number) => (
                            <div key={idx} className="relative" style={{ zIndex: 30 - idx * 10 }}>
                              <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-semibold ring-2 ${
                                  theme === "dark" ? "ring-zinc-900 bg-zinc-700 text-zinc-300" : "ring-white bg-gray-200 text-gray-700"
                                }`}
                              >
                                {participant.users?.first_name?.[0]?.toUpperCase() || participant.users?.email?.[0]?.toUpperCase() || "?"}
                              </div>
                              {/* Role indicator dot */}
                              {participant.user_duty && (
                                <div
                                  className={`absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 rounded-full ${
                                    participant.user_duty === "Sniper" ? "bg-red-500" : "bg-blue-500"
                                  }`}
                                />
                              )}
                            </div>
                          ))}

                          {/* Show remaining count if more than 3 */}
                          {(item.session_participants || []).length > 3 && (
                            <div
                              className={`relative w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-semibold ring-2 ${
                                theme === "dark" ? "bg-zinc-800 text-zinc-400 ring-zinc-900" : "bg-gray-100 text-gray-600 ring-white"
                              }`}
                            >
                              +{(item.session_participants || []).length - 3}
                            </div>
                          )}
                        </>
                      ) : (
                        /* Show icon when no participants */
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            theme === "dark" ? "bg-zinc-800 text-zinc-500" : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          <Users size={12} />
                        </div>
                      )}
                    </div>
                  </div>
                </PopoverTrigger>
                <PopoverContent
                  className={`p-3 min-w-[240px] rounded-lg shadow-xl border ${
                    theme === "dark" ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"
                  }`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <h4 className={`text-sm font-medium mb-3 ${theme === "dark" ? "text-zinc-200" : "text-gray-800"}`}>
                    Session Participants ({item.session_participants?.length || 0})
                  </h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {(item.session_participants || []).length > 0 ? (
                      (item.session_participants || []).map((participant: any, idx: number) => {
                        const name = participant.users
                          ? `${participant.users.first_name || ""} ${participant.users.last_name || ""}`.trim() || participant.users.email
                          : "Unknown";
                        return (
                          <div
                            key={idx}
                            className={`p-2 rounded-lg flex items-center gap-3 ${theme === "dark" ? "hover:bg-zinc-700/50" : "hover:bg-gray-50"}`}
                          >
                            <ProfileCapitalFirstLatter firstName={participant.users?.first_name} lastName={participant.users?.last_name} />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{name}</p>
                              <p className={`text-xs ${theme === "dark" ? "text-zinc-400" : "text-gray-500"}`}>
                                {participant.user_duty || "Unknown Role"}
                              </p>
                            </div>
                            <span
                              className={`text-xs px-2 py-1 rounded-full font-medium ${
                                participant.user_duty === "Sniper"
                                  ? theme === "dark"
                                    ? "bg-red-500/10 text-red-400 border border-red-500/20"
                                    : "bg-red-50 text-red-700 border border-red-200"
                                  : theme === "dark"
                                    ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                    : "bg-blue-50 text-blue-700 border border-blue-200"
                              }`}
                            >
                              {participant.user_duty === "Sniper" ? "SNP" : "SPT"}
                            </span>
                          </div>
                        );
                      })
                    ) : (
                      <div className={`text-center py-4 ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>
                        <Users size={24} className="mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No participants recorded</p>
                      </div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        );
      })}
    </div>
  );
}
