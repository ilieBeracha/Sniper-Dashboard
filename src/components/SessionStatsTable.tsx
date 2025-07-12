import { Eye, Edit, FileText } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { format } from "date-fns";
import { useState, useMemo, useEffect } from "react";
import { useStore } from "zustand";
import { sessionStore } from "@/store/sessionStore";
import { useParams } from "react-router-dom";
import { SpTable } from "@/layouts/SpTable";

interface SessionStatsTableProps {
  sessionStats: any[];
  onSessionClick: (session: any) => void;
  onEditClick: (session: any) => void;
  newlyAddedSessionId?: string | null;
}

export default function SessionStatsTable({ sessionStats, onSessionClick, onEditClick, newlyAddedSessionId }: SessionStatsTableProps) {
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

  // Watch for changes in sessionStats prop and refresh paginated session stats
  useEffect(() => {
    if (sessionStats?.length > 0 && currentPage === 0) {
      // Reset to first page when session stats change
      loadSessionStats(0, true);
    }
  }, [sessionStats?.length]);

  // Watch for newly added session to highlight it
  useEffect(() => {
    if (newlyAddedSessionId) {
      // Refresh session stats to include the newly added session
      loadSessionStats(0, true);
    }
  }, [newlyAddedSessionId]);

  // Get unique values for filters
  const uniqueDayPeriods = useMemo(() => {
    const periods = sessionStats?.map((stat) => stat.day_period).filter(Boolean);
    return [...new Set(periods)];
  }, [sessionStats]);

  const uniqueSquads = useMemo(() => {
    const squads = sessionStats?.map((stat) => stat.squads?.squad_name).filter(Boolean);
    return [...new Set(squads)];
  }, [sessionStats]);

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
      label: "Assignment",
      render: (_value: any, row: any) => (
        <span className="font-medium truncate max-w-[100px] sm:max-w-[150px]">{row.assignment_session?.assignment?.assignment_name || "N/A"}</span>
      ),
      className: "px-4 sm:px-4 py-3",
    },
    {
      key: "creator",
      label: "Creator",
      render: (_value: any, row: any) => {
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
      render: (value: string) => <span className="capitalize">{value || "N/A"}</span>,
      className: "px-2 sm:px-4 py-3 hidden lg:table-cell",
      hideOnMobile: true,
    },
    {
      key: "time_to_first_shot_sec",
      label: "Time to First Shot",
      render: (value: number | null) => {
        return value !== null ? `${value}s` : "N/A";
      },
      className: "px-2 sm:px-4 py-3 hidden lg:table-cell",
      hideOnMobile: true,
    },
    {
      key: "created_at",
      label: "Created",
      render: (value: string) => format(new Date(value), "yyyy-MM-dd HH:mm"),
      className: "px-2 sm:px-4 py-3 hidden md:table-cell",
      hideOnMobile: true,
    },
  ];

  const filters = [
    {
      key: "day_period",
      label: "All Times",
      type: "select" as const,
      options: uniqueDayPeriods.map((period) => ({ value: period, label: period })),
    },
    {
      key: "squads.squad_name",
      label: "All Squads",
      type: "select" as const,
      options: uniqueSquads.map((squad) => ({ value: squad, label: squad })),
    },
  ];

  const actions = (session: any) => (
    <div className="inline-flex gap-1 sm:gap-2">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onSessionClick(session);
        }}
        className={`p-1.5 sm:p-2 rounded hover:bg-indigo-100 dark:hover:bg-indigo-800/40 ${theme === "dark" ? "text-indigo-400" : "text-indigo-600"}`}
        title="View"
      >
        <Eye size={14} className="sm:w-4 sm:h-4" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEditClick(session);
        }}
        className={`p-1.5 sm:p-2 rounded hover:bg-amber-100 dark:hover:bg-amber-800/40 ${theme === "dark" ? "text-amber-400" : "text-amber-600"}`}
        title="Edit"
      >
        <Edit size={14} className="sm:w-4 sm:h-4" />
      </button>
    </div>
  );

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
      data={paginatedSessionStats}
      columns={columns}
      filters={filters}
      searchPlaceholder="Search..."
      searchFields={["note", "squads.squad_name", "teams.team_name"]}
      onRowClick={onSessionClick}
      actions={actions}
      loading={isLoading}
      pagination={pagination}
      highlightRow={(row) => row.id === newlyAddedSessionId}
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
