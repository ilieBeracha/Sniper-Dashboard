import { Eye, Edit, FileText, ChevronRight, ChevronDown } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { format } from "date-fns";
import { useState, useEffect, useMemo } from "react";
import { useStore } from "zustand";
import { sessionStore } from "@/store/sessionStore";
import { useParams } from "react-router-dom";
import { SpTable } from "@/layouts/SpTable";

interface SessionStatsTableProps {
  sessionStats: any[];
  onSessionStatsClick: (session: any) => void;
  onSessionStatsEditClick: (session: any) => void;
  newlyAddedSessionId?: string | null;
}

interface GroupedAssignment {
  assignmentId: string;
  assignmentName: string;
  sessions: any[];
  expanded: boolean;
}

export default function SessionStatsTable({
  sessionStats,
  onSessionStatsClick,
  onSessionStatsEditClick,
  newlyAddedSessionId,
}: SessionStatsTableProps) {
  const { theme } = useTheme();
  const { id } = useParams();
  const { getSessionStatsByTrainingId, getSessionStatsCountByTrainingId } = useStore(sessionStore);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [paginatedSessionStats, setPaginatedSessionStats] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const SESSION_LIMIT = 20;

  // Expanded groups state - initialize with all groups expanded
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [isInitialized, setIsInitialized] = useState(false);

  // Load paginated session stats
  const loadSessionStats = async (page: number = 0, reset: boolean = false) => {
    if (!id) return;

    setIsLoading(true);
    try {
      const offset = page * SESSION_LIMIT;
      const result = await getSessionStatsByTrainingId(id, SESSION_LIMIT, offset);

      if (reset) {
        setPaginatedSessionStats(result);
      } else {
        setPaginatedSessionStats((prev) => [...prev, ...result]);
      }

      setHasMore(result.length === SESSION_LIMIT);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error loading session stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load initial session stats and total count
  useEffect(() => {
    const loadInitialData = async () => {
      if (!id) return;

      // Load both session stats and total count
      await loadSessionStats(0, true);

      try {
        const count = await getSessionStatsCountByTrainingId(id);
        setTotalCount(count);
      } catch (error) {
        console.error("Error loading total count:", error);
      }
    };

    loadInitialData();
  }, [id]);

  useEffect(() => {
    if (sessionStats?.length > 0 && currentPage === 0) {
      loadSessionStats(0, true);
    }
  }, [sessionStats?.length]);

  useEffect(() => {
    if (newlyAddedSessionId) {
      loadSessionStats(0, true);
    }
  }, [newlyAddedSessionId]);

  // Initialize expanded groups when data loads
  useEffect(() => {
    if (paginatedSessionStats.length > 0 && !isInitialized) {
      const assignmentIds = new Set<string>();
      paginatedSessionStats.forEach((session) => {
        if (session.assignment_id) {
          assignmentIds.add(session.assignment_id);
        }
      });
      setExpandedGroups(assignmentIds);
      setIsInitialized(true);
    }
  }, [paginatedSessionStats, isInitialized]);

  // Group sessions by assignment
  const groupedData = useMemo(() => {
    const groups: Record<string, GroupedAssignment> = {};

    paginatedSessionStats.forEach((session) => {
      const assignmentId = session.assignment_id;
      const assignmentName = session.assignment_session?.assignment?.assignment_name || "Unknown Assignment";

      if (!groups[assignmentId]) {
        groups[assignmentId] = {
          assignmentId,
          assignmentName,
          sessions: [],
          expanded: expandedGroups.has(assignmentId),
        };
      }

      groups[assignmentId].sessions.push(session);
    });

    // Convert to array and sort by assignment name
    return Object.values(groups).sort((a, b) => a.assignmentName.localeCompare(b.assignmentName));
  }, [paginatedSessionStats, expandedGroups]);

  // Flatten grouped data for table display
  const flattenedData = useMemo(() => {
    const flattened: any[] = [];

    groupedData.forEach((group) => {
      // Add group header
      flattened.push({
        id: `group-${group.assignmentId}`,
        isGroup: true,
        assignmentId: group.assignmentId,
        assignmentName: group.assignmentName,
        sessionCount: group.sessions.length,
        expanded: group.expanded,
      });

      // Add sessions if expanded
      if (group.expanded) {
        group.sessions.forEach((session) => {
          flattened.push({
            ...session,
            isGroup: false,
            isChild: true,
          });
        });
      }
    });

    return flattened;
  }, [groupedData]);

  const toggleGroup = (assignmentId: string) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(assignmentId)) {
        newSet.delete(assignmentId);
      } else {
        newSet.add(assignmentId);
      }
      return newSet;
    });
  };

  // Pagination handlers
  const nextPage = () => {
    if (hasMore && !isLoading) {
      loadSessionStats(currentPage + 1, true); // Reset to replace data, not append
    }
  };

  const prevPage = () => {
    if (currentPage > 0 && !isLoading) {
      loadSessionStats(currentPage - 1, true);
    }
  };

  const columns = [
    {
      key: "assignment",
      label: "Assignment / Session",
      render: (_value: any, row: any) => {
        if (row.isGroup) {
          return (
            <div className="flex items-center gap-2 font-semibold">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleGroup(row.assignmentId);
                }}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              >
                {row.expanded ? <ChevronDown className="w-4 h-4 text-gray-500" /> : <ChevronRight className="w-4 h-4 text-gray-500" />}
              </button>
              <span>{row.assignmentName}</span>
              <span className="text-sm text-gray-500">({row.sessionCount})</span>
            </div>
          );
        }
        return (
          <div className={`${row.isChild ? "pl-8" : ""} flex items-center gap-2`}>
            <span className="text-sm text-gray-500">•</span>
            <span className="truncate max-w-[150px]">Session {format(new Date(row.created_at), "MMM dd, HH:mm")}</span>
          </div>
        );
      },
      className: "px-4 sm:px-4 py-3",
    },
    {
      key: "creator",
      label: "Creator",
      render: (_value: any, row: any) => {
        if (row.isGroup) return null;
        const creator = row.users;
        return (
          <span className="truncate max-w-[80px] sm:max-w-none">
            {creator ? `${creator.first_name} ${creator.last_name}`.trim() || creator.email : "N/A"}
          </span>
        );
      },
      className: "px-2 sm:px-4 py-3",
    },
    {
      key: "day_period",
      label: "Day/Night",
      render: (value: string, row: any) => {
        if (row.isGroup) return null;
        return <span className="capitalize">{value || "N/A"}</span>;
      },
      className: "px-2 sm:px-4 py-3 hidden lg:table-cell",
      hideOnMobile: true,
    },
    {
      key: "time_to_first_shot_sec",
      label: "Time to First Shot",
      render: (value: number | null, row: any) => {
        if (row.isGroup) return null;
        return value !== null ? `${value}s` : "N/A";
      },
      className: "px-2 sm:px-4 py-3 hidden lg:table-cell",
      hideOnMobile: true,
    },
    {
      key: "note",
      label: "Note",
      render: (value: string, row: any) => {
        if (row.isGroup) return null;
        return value ? (
          <span className="truncate max-w-[100px]" title={value}>
            {value}
          </span>
        ) : (
          <span className="text-gray-400">-</span>
        );
      },
      className: "px-2 sm:px-4 py-3 hidden md:table-cell",
      hideOnMobile: true,
    },
  ];

  const actions = (row: any) => {
    if (row.isGroup) return null;

    return (
      <div className="inline-flex gap-1 sm:gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSessionStatsClick(row);
          }}
          className={`p-1.5 sm:p-2 rounded hover:bg-indigo-100 dark:hover:bg-indigo-800/40 ${theme === "dark" ? "text-indigo-400" : "text-indigo-600"}`}
          title="View"
        >
          <Eye size={14} className="sm:w-4 sm:h-4" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSessionStatsEditClick(row);
          }}
          className={`p-1.5 sm:p-2 rounded hover:bg-amber-100 dark:hover:bg-amber-800/40 ${theme === "dark" ? "text-amber-400" : "text-amber-600"}`}
          title="Edit"
        >
          <Edit size={14} className="sm:w-4 sm:h-4" />
        </button>
      </div>
    );
  };

  const pagination = {
    currentPage,
    totalPages: Math.ceil(totalCount / SESSION_LIMIT),
    pageSize: SESSION_LIMIT,
    totalItems: totalCount,
    onPageChange: (page: number) => loadSessionStats(page, true),
    onNextPage: nextPage,
    onPrevPage: prevPage,
    hasMore,
  };

  if (sessionStats?.length === 0) {
    return (
      <div className={`text-center py-12 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
        <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-medium mb-2">No session stats yet</h3>
        <p className="text-sm">Add your first session stats to get started</p>
      </div>
    );
  }

  return (
    <SpTable
      data={flattenedData}
      columns={columns}
      filters={[]}
      searchPlaceholder="Search..."
      onRowClick={(row) => {
        if (!row.isGroup) {
          onSessionStatsClick(row);
        }
      }}
      actions={actions}
      loading={isLoading}
      pagination={pagination}
      highlightRow={(row) => !row.isGroup && row.id === newlyAddedSessionId}
      emptyState={
        <div className={`text-center py-12 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
          <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">No session stats yet</h3>
          <p className="text-sm">Add your first session stats to get started</p>
        </div>
      }
    />
  );
}
