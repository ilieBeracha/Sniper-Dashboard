import { useState, useMemo } from "react";
import { format } from "date-fns";
import { ChevronDown, ChevronRight, Sun, Moon, Activity, Clock, Info, Users, Building2, Target, Layers } from "lucide-react";
import { Tooltip } from "react-tooltip";
import { useTheme } from "@/contexts/ThemeContext";

interface AssignmentStackViewProps {
  data: any[];
  onCardClick?: (session: any) => void;
  onEdit?: (session: any) => void;
  onDelete?: (session: any) => void;
}

export default function AssignmentStackView({ data, onCardClick, onEdit, onDelete }: AssignmentStackViewProps) {
  const { theme } = useTheme();
  const [expandedAssignments, setExpandedAssignments] = useState<Set<string>>(new Set());

  // Group sessions by assignment
  const groupedSessions = useMemo(() => {
    const groups = data.reduce(
      (acc, session) => {
        const assignmentName = session.assignment_session?.assignment?.assignment_name || "Unknown Assignment";
        if (!acc[assignmentName]) {
          acc[assignmentName] = [];
        }
        acc[assignmentName].push(session);
        return acc;
      },
      {} as Record<string, any[]>,
    );

    // Sort sessions within each group by created_at desc
    Object.keys(groups).forEach((key) => {
      groups[key].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    });

    return groups;
  }, [data]);

  const toggleAssignment = (assignmentName: string) => {
    const newExpanded = new Set(expandedAssignments);
    if (newExpanded.has(assignmentName)) {
      newExpanded.delete(assignmentName);
    } else {
      newExpanded.add(assignmentName);
    }
    setExpandedAssignments(newExpanded);
  };

  const getAssignmentStats = (sessions: any[]) => {
    const totalSessions = sessions.length;
    const effortSessions = sessions.filter((s) => s.effort === true).length;
    const daySessions = sessions.filter((s) => s.day_period === "day").length;
    const nightSessions = sessions.filter((s) => s.day_period === "night").length;

    // Get all distances
    const allDistances = sessions.flatMap((s) => (s.target_stats || []).map((t: any) => t.distance_m).filter(Boolean));
    const avgDistance = allDistances.length > 0 ? Math.round(allDistances.reduce((a, b) => a + b, 0) / allDistances.length) : null;

    return { totalSessions, effortSessions, daySessions, nightSessions, avgDistance };
  };

  if (!data || data.length === 0) {
    return <div className="text-center py-12 opacity-70 text-sm">No session stats yet</div>;
  }

  return (
    <div className="space-y-4">
      {Object.entries(groupedSessions).map(([assignmentName, sessions]) => {
        const isExpanded = expandedAssignments.has(assignmentName);
        const stats = getAssignmentStats(sessions as any[]);

        return (
          <div
            key={assignmentName}
            className={`rounded-xl border overflow-hidden transition-all ${
              theme === "dark" ? "border-zinc-800 bg-gradient-to-br from-zinc-900/80 to-zinc-800/50" : "border-gray-200 bg-white"
            }`}
          >
            {/* Assignment Header */}
            <div
              className={`p-4 cursor-pointer transition-colors ${theme === "dark" ? "hover:bg-zinc-800/50" : "hover:bg-gray-50"}`}
              onClick={() => toggleAssignment(assignmentName)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                  <div>
                    <h3 className="font-semibold text-base flex items-center gap-2">
                      <Layers size={18} className="opacity-70" />
                      {assignmentName}
                    </h3>
                    <div className="flex items-center gap-4 mt-1 text-xs opacity-70">
                      <span>{stats.totalSessions} sessions</span>
                      {stats.avgDistance && <span>Avg: {stats.avgDistance}m</span>}
                    </div>
                  </div>
                </div>

                {/* Assignment Stats Pills */}
                <div className="flex items-center gap-2">
                  {stats.daySessions > 0 && (
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${
                        theme === "dark" ? "bg-yellow-600/20 text-yellow-300" : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      <Sun size={10} /> {stats.daySessions}
                    </span>
                  )}
                  {stats.nightSessions > 0 && (
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${
                        theme === "dark" ? "bg-indigo-600/20 text-indigo-300" : "bg-indigo-100 text-indigo-700"
                      }`}
                    >
                      <Moon size={10} /> {stats.nightSessions}
                    </span>
                  )}
                  {stats.effortSessions > 0 && (
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${
                        theme === "dark" ? "bg-green-600/20 text-green-300" : "bg-green-100 text-green-700"
                      }`}
                    >
                      <Activity size={10} /> {stats.effortSessions}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Expanded Sessions */}
            {isExpanded && (
              <div className={`border-t ${theme === "dark" ? "border-zinc-800" : "border-gray-200"}`}>
                <div className="p-4 space-y-3">
                  {(sessions as any[])?.map((item: any) => {
                    const shooterName = item.users ? `${item.users.first_name} ${item.users.last_name}`.trim() || item.users.email : "N/A";
                    const teamName = item.teams?.team_name || "No Team";
                    const distances = (item.target_stats || []).map((t: any) => t.distance_m).filter(Boolean);
                    const minDistance = distances.length > 0 ? Math.min(...distances) : null;
                    const maxDistance = distances.length > 0 ? Math.max(...distances) : null;

                    return (
                      <div
                        key={item.id}
                        className={`rounded-lg border p-3 flex flex-col gap-2 transition-all cursor-pointer ${
                          theme === "dark"
                            ? "border-zinc-700 bg-zinc-800/30 hover:bg-zinc-800/50 hover:border-zinc-600"
                            : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                        }`}
                        onClick={() => onCardClick?.(item)}
                      >
                        {/* Session Header */}
                        <div className="flex items-center justify-between">
                          <span className="text-xs opacity-70">{format(new Date(item.created_at), "dd MMM HH:mm")}</span>

                          {/* Tags */}
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs ${
                                item.day_period === "day"
                                  ? theme === "dark"
                                    ? "bg-yellow-600/20 text-yellow-300"
                                    : "bg-yellow-100 text-yellow-700"
                                  : theme === "dark"
                                    ? "bg-indigo-600/20 text-indigo-300"
                                    : "bg-indigo-100 text-indigo-700"
                              }`}
                            >
                              {item.day_period === "day" ? <Sun size={10} /> : <Moon size={10} />}
                            </span>

                            {item.effort !== null && (
                              <span
                                className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs ${
                                  item.effort
                                    ? theme === "dark"
                                      ? "bg-green-600/20 text-green-300"
                                      : "bg-green-100 text-green-700"
                                    : theme === "dark"
                                      ? "bg-red-600/20 text-red-300"
                                      : "bg-red-100 text-red-700"
                                }`}
                              >
                                <Activity size={10} />
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Session Info */}
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex items-center gap-1.5 opacity-80">
                            <Users size={10} />
                            <span className="truncate" title={shooterName}>
                              {shooterName}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 opacity-80">
                            <Building2 size={10} />
                            <span className="truncate" title={teamName}>
                              {teamName}
                            </span>
                          </div>
                        </div>

                        {/* Stats Row */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 text-xs">
                            {minDistance !== null && (
                              <div className="flex items-center gap-1 opacity-80">
                                <Target size={10} />
                                <span>{minDistance === maxDistance ? `${minDistance}m` : `${minDistance}-${maxDistance}m`}</span>
                              </div>
                            )}
                            {item.time_to_first_shot_sec !== null && (
                              <div className="flex items-center gap-1 opacity-80">
                                <Clock size={10} />
                                <span>{item.time_to_first_shot_sec}s</span>
                              </div>
                            )}
                            {item.note && (
                              <div
                                className="flex items-center gap-1 opacity-80"
                                data-tooltip-id={`note-${item.id}`}
                                data-tooltip-content={item.note}
                              >
                                <Info size={10} />
                                <Tooltip
                                  id={`note-${item.id}`}
                                  className={`!opacity-100 !border !rounded-lg !p-2 !text-xs ${
                                    theme === "dark" ? "!bg-[#1A1A1A] !text-gray-300 !border-white/10" : "!bg-white !text-gray-700 !border-gray-200"
                                  }`}
                                />
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          {(onEdit || onDelete) && (
                            <div className="flex gap-1.5">
                              {onEdit && (
                                <button
                                  className={`px-2 py-0.5 rounded text-xs font-medium transition-all ${
                                    theme === "dark"
                                      ? "border-zinc-700 bg-zinc-800/50 hover:bg-zinc-700/70 hover:border-zinc-600"
                                      : "border-gray-200 bg-white hover:bg-gray-100"
                                  } border`}
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
                                  className={`px-2 py-0.5 rounded text-xs font-medium transition-all ${
                                    theme === "dark"
                                      ? "border-zinc-700 bg-zinc-800/50 hover:bg-red-900/30 hover:border-red-800/50 hover:text-red-400"
                                      : "border-gray-200 bg-white hover:bg-red-50 hover:border-red-200 hover:text-red-600"
                                  } border`}
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
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
