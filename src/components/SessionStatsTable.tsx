import { FileText } from "lucide-react";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { useStore } from "zustand";
import { sessionStore } from "@/store/sessionStore";
import { useParams } from "react-router-dom";
import { SpTable } from "@/layouts/SpTable";

interface SessionStatsTableProps {
  sessionStats: any[];
  onSessionStatsClick: (session: any) => void;
  onSessionStatsEditClick: (session: any) => void;
  newlyAddedSessionId?: string | null;
  onSessionStatsDeleteClick?: (session: any) => void;
  deletingSessionId?: string | null;
}

export default function SessionStatsTable({
  sessionStats,
  onSessionStatsClick,
  onSessionStatsEditClick,
  newlyAddedSessionId,
  onSessionStatsDeleteClick,
  deletingSessionId,
}: SessionStatsTableProps) {
  const { id } = useParams();
  const { getSessionStatsByTrainingId, getSessionStatsCountByTrainingId } = useStore(sessionStore);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [paginatedSessionStats, setPaginatedSessionStats] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const SESSION_LIMIT = 20;

  const [hasLoadedInitialData, setHasLoadedInitialData] = useState(false);

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
      if (!id || hasLoadedInitialData) return;

      // Load both session stats and total count
      await loadSessionStats(0, true);

      try {
        const count = await getSessionStatsCountByTrainingId(id);
        setTotalCount(count);
        setHasLoadedInitialData(true);
      } catch (error) {
        console.error("Error loading total count:", error);
      }
    };

    loadInitialData();
  }, [id]);

  useEffect(() => {
    if (newlyAddedSessionId || deletingSessionId) {
      loadSessionStats(0, true);
      if (deletingSessionId && id) {
        getSessionStatsCountByTrainingId(id).then((count) => setTotalCount(count));
      }
    }
  }, [newlyAddedSessionId, deletingSessionId, id]);

  // Reload data when sessionStats prop changes (e.g., after deletion)
  useEffect(() => {
    if (sessionStats && id && sessionStats !== paginatedSessionStats) {
      loadSessionStats(0, true);
      getSessionStatsCountByTrainingId(id).then((count) => setTotalCount(count));
    }
  }, [sessionStats?.length, id]);

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
      key: "session",
      label: "Session",
      render: (_value: any, row: any) => {
        return (
          <div className="flex items-center gap-2 text-sm font-medium">
            <span className="truncate max-w-[200px]">{format(new Date(row.created_at), "HH:mm")}</span>
          </div>
        );
      },
      className: "px-4 sm:px-4 py-6",
    },
    {
      key: "assignment",
      label: "Assignment",
      render: (_value: any, row: any) => {
        const assignmentName = row.assignment_session?.assignment?.assignment_name || "Unknown Assignment";
        return (
          <span className="truncate max-w-[150px]" title={assignmentName}>
            {assignmentName}
          </span>
        );
      },
      className: "px-2 sm:px-4 py-3",
    },
    {
      key: "creator",
      label: "Creator",
      render: (_value: any, row: any) => {
        void _value; // Mark as used to satisfy TypeScript
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
      render: (value: string) => {
        return <span className="capitalize">{value || "N/A"}</span>;
      },
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
      key: "note",
      label: "Note",
      render: (value: string) => {
        return value ? (
          <span className="truncate max-w-[100px]" title={value}>
            {value}
          </span>
        ) : (
          <span className="text-gray-800">-</span>
        );
      },
      className: "px-2 sm:px-4 py-3 hidden md:table-cell",
      hideOnMobile: true,
    },
  ];

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
      <div className={`text-center py-12 `}>
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
      filters={[
        {
          key: "effort",
          label: "Effort",
          type: "select",
          options: [
            { label: "Yes", value: "true" },
            { label: "No", value: "false" },
            { label: "All", value: "" },
          ],
        },
      ]}
      searchPlaceholder="Search..."
      actions={{
        onRowClick: onSessionStatsClick,
        onEdit: onSessionStatsEditClick,
        onDelete: onSessionStatsDeleteClick,
      }}
      loading={isLoading}
      pagination={pagination}
      highlightRow={(row) => row.id === newlyAddedSessionId}
      emptyState={
        <div className={`text-center py-12 `}>
          <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">No session stats yet</h3>
          <p className="text-sm">Add your first session stats to get started</p>
        </div>
      }
    />
  );
}
