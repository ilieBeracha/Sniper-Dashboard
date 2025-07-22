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

  // Group-aware pagination state
  const ROW_LIMIT = 20; // preferred maximum rows per page (may overflow if a single group is larger)
  const [currentPage, setCurrentPage] = useState(0);
  const [allSessionStats, setAllSessionStats] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  // derived state – whether there is a next page (re-computed later)
  const [hasMore, setHasMore] = useState(false);

  // Expanded groups state - initialize with all groups expanded
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [isInitialized, setIsInitialized] = useState(false);

  // Load ALL session stats once – we will paginate client-side by group.
  const loadAllSessionStats = async () => {
    if (!id) return;

    setIsLoading(true);
    try {
      // 1. Fetch total count so we can request all rows in one call.
      const count = await getSessionStatsCountByTrainingId(id);
      setTotalCount(count);

      // 2. Fetch ALL rows. If count is 0 we still proceed to show empty state.
      const result = await getSessionStatsByTrainingId(id, count || 1, 0);
      setAllSessionStats(result);
    } catch (error) {
      console.error("Error loading session stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load data once when component mounts / id changes
  useEffect(() => {
    loadAllSessionStats();
  }, [id]);

  // Reload ALL stats if parent component provides refreshed list or added session
  useEffect(() => {
    if (sessionStats?.length > 0) {
      loadAllSessionStats();
    }
  }, [sessionStats?.length]);

  useEffect(() => {
    if (newlyAddedSessionId) {
      loadAllSessionStats();
    }
  }, [newlyAddedSessionId]);

  // Initialize expanded groups when data loads
  useEffect(() => {
    if (allSessionStats.length > 0 && !isInitialized) {
      const assignmentIds = new Set<string>();
      allSessionStats.forEach((session) => {
        if (session.assignment_id) {
          assignmentIds.add(session.assignment_id);
        }
      });
      setExpandedGroups(assignmentIds);
      setIsInitialized(true);
    }
  }, [allSessionStats, isInitialized]);

  // Group sessions by assignment (from ALL data)
  const groupedData = useMemo(() => {
    const groups: Record<string, GroupedAssignment> = {};

    allSessionStats.forEach((session) => {
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
  }, [allSessionStats, expandedGroups]);

  // Build group-aware pages – ensures a group is never split across pages.
  const groupPages = useMemo(() => {
    const pages: GroupedAssignment[][] = [];
    let current: GroupedAssignment[] = [];
    let rowCount = 0;

    const getGroupRows = (g: GroupedAssignment) => (g.expanded ? g.sessions.length + 1 : 1);

    groupedData.forEach((group) => {
      const rows = getGroupRows(group);

      // If adding this group exceeds ROW_LIMIT and we already have at least one group on the page, start new page.
      if (rowCount > 0 && rowCount + rows > ROW_LIMIT) {
        pages.push(current);
        current = [];
        rowCount = 0;
      }

      current.push(group);
      rowCount += rows;
    });

    if (current.length) pages.push(current);

    return pages;
  }, [groupedData]);

  // Adjust current page index if number of pages changed (e.g., after collapsing groups)
  useEffect(() => {
    if (currentPage >= groupPages.length) {
      setCurrentPage(groupPages.length === 0 ? 0 : groupPages.length - 1);
    }
    setHasMore(currentPage < groupPages.length - 1);
  }, [groupPages.length, currentPage]);

  // Flatten data for the CURRENT page only
  const flattenedData = useMemo(() => {
    if (groupPages.length === 0) return [];

    const flattened: any[] = [];

    const pageGroups = groupPages[currentPage] || [];

    pageGroups.forEach((group) => {
      // Add group header
      flattened.push({
        id: `group-${group.assignmentId}`,
        isGroup: true,
        assignmentId: group.assignmentId,
        assignmentName: group.assignmentName,
        sessionCount: group.sessions.length,
        expanded: group.expanded,
      });

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
  }, [groupPages, currentPage]);

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

  // Pagination handlers – purely client-side now
  const nextPage = () => {
    if (currentPage < groupPages.length - 1) {
      setCurrentPage((p) => p + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage((p) => p - 1);
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
    totalPages: groupPages.length || 1,
    pageSize: flattenedData.length,
    totalItems: totalCount,
    onPageChange: (page: number) => setCurrentPage(page),
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
