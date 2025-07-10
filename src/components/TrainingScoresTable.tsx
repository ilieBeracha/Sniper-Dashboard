import { Eye, Edit, Target } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { format } from "date-fns";
import { useState, useMemo, useEffect } from "react";
import { useStore } from "zustand";
import { scoreStore } from "@/store/scoreSrore";
import { useParams } from "react-router-dom";
import { SpTable } from "@/layouts/SpTable";

interface TrainingScoresTableProps {
  scores: any[];
  onScoreClick: (score: any) => void;
  onEditClick: (score: any) => void;
  newlyAddedScoreId?: string | null;
}

export default function TrainingScoresTable({ scores, onScoreClick, onEditClick, newlyAddedScoreId }: TrainingScoresTableProps) {
  const { theme } = useTheme();
  const { id } = useParams();
  const { getScoresByTrainingId, getScoresCountByTrainingId } = useStore(scoreStore);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [paginatedScores, setPaginatedScores] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const SCORES_LIMIT = 20;

  // Load paginated scores
  const loadScores = async (page: number = 0, reset: boolean = false) => {
    if (!id) return;

    setIsLoading(true);
    try {
      const offset = page * SCORES_LIMIT;
      const result = await getScoresByTrainingId(id, SCORES_LIMIT, offset);

      if (reset) {
        setPaginatedScores(result);
      } else {
        setPaginatedScores((prev) => [...prev, ...result]);
      }

      setHasMore(result.length === SCORES_LIMIT);
      setCurrentPage(page);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  // Load initial scores and total count
  useEffect(() => {
    const loadInitialData = async () => {
      if (!id) return;

      // Load both scores and total count
      await loadScores(0, true);

      try {
        const count = await getScoresCountByTrainingId(id);
        setTotalCount(count);
      } catch (error) {
        console.error("Error loading total count:", error);
      }
    };

    loadInitialData();
  }, [id]);

  // Watch for changes in scores prop and refresh paginated scores
  useEffect(() => {
    if (scores.length > 0 && currentPage === 0) {
      // Reset to first page when scores change
      loadScores(0, true);
    }
  }, [scores.length]);

  // Watch for newly added score to highlight it
  useEffect(() => {
    if (newlyAddedScoreId) {
      // Refresh scores to include the newly added score
      loadScores(0, true);
    }
  }, [newlyAddedScoreId]);

  // Get unique values for filters (use all scores prop for complete filter options)
  const uniquePositions = useMemo(() => {
    const positions = scores.map((score) => score.position).filter(Boolean);
    return [...new Set(positions)];
  }, [scores]);

  const uniqueDayNight = useMemo(() => {
    const dayNight = scores.map((score) => score.day_night).filter(Boolean);
    return [...new Set(dayNight)];
  }, [scores]);

  // Pagination handlers
  const nextPage = () => {
    if (hasMore && !isLoading) {
      loadScores(currentPage + 1, true); // Reset to replace data, not append
    }
  };

  const prevPage = () => {
    if (currentPage > 0 && !isLoading) {
      loadScores(currentPage - 1, true);
    }
  };

  const columns = [
    {
      key: "assignment",
      label: "Assignment",
      render: (_value: any, row: any) => (
        <span className="font-medium truncate max-w-[100px] sm:max-w-[150px]">
          {row.assignment_session?.assignment?.assignment_name || "N/A"}
        </span>
      ),
      className: "px-4 sm:px-4 py-3",
    },
    {
      key: "participant",
      label: "Participant",
      render: (_value: any, row: any) => {
        const participant = row.score_participants?.[0]?.user;
        return (
          <span className="truncate max-w-[80px] sm:max-w-none">
            {participant ? `${participant.first_name} ${participant.last_name}` : "N/A"}
          </span>
        );
      },
      className: "px-2 sm:px-4 py-3",
    },
    {
      key: "position",
      label: "Position",
      render: (value: string) => <span className="capitalize">{value || "N/A"}</span>,
      className: "px-2 sm:px-4 py-3 hidden sm:table-cell",
      hideOnMobile: true,
    },
    {
      key: "day_night",
      label: "Day/Night",
      render: (value: string) => <span className="capitalize">{value || "N/A"}</span>,
      className: "px-2 sm:px-4 py-3 hidden lg:table-cell",
      hideOnMobile: true,
    },
    {
      key: "target_eliminated",
      label: "Target Eliminated",
      render: (value: boolean | null) => {
        return value === null ? "N/A" : value ? "✅" : "❌";
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
      key: "position",
      label: "All Positions",
      type: "select" as const,
      options: uniquePositions.map((position) => ({ value: position, label: position })),
    },
    {
      key: "day_night",
      label: "All Times",
      type: "select" as const,
      options: uniqueDayNight.map((dayNight) => ({ value: dayNight, label: dayNight })),
    },
    {
      key: "target_eliminated",
      label: "All Targets",
      type: "select" as const,
      options: [
        { value: "true", label: "Eliminated ✅" },
        { value: "false", label: "Not Eliminated ❌" },
        { value: "null", label: "Unknown" },
      ],
    },
  ];

  const actions = (score: any) => (
    <div className="inline-flex gap-1 sm:gap-2">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onScoreClick(score);
        }}
        className={`p-1.5 sm:p-2 rounded hover:bg-indigo-100 dark:hover:bg-indigo-800/40 ${
          theme === "dark" ? "text-indigo-400" : "text-indigo-600"
        }`}
        title="View"
      >
        <Eye size={14} className="sm:w-4 sm:h-4" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEditClick(score);
        }}
        className={`p-1.5 sm:p-2 rounded hover:bg-amber-100 dark:hover:bg-amber-800/40 ${
          theme === "dark" ? "text-amber-400" : "text-amber-600"
        }`}
        title="Edit"
      >
        <Edit size={14} className="sm:w-4 sm:h-4" />
      </button>
    </div>
  );

  const pagination = {
    currentPage,
    totalPages: Math.ceil(totalCount / SCORES_LIMIT),
    pageSize: SCORES_LIMIT,
    totalItems: totalCount,
    onPageChange: (page: number) => loadScores(page, true),
    onNextPage: nextPage,
    onPrevPage: prevPage,
    hasMore,
  };

  if (scores.length === 0) {
    return (
      <div className={`text-center py-12 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
        <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-medium mb-2">No scores yet</h3>
        <p className="text-sm">Add your first score to get started</p>
      </div>
    );
  }

  return (
    <SpTable
      data={paginatedScores}
      columns={columns}
      filters={filters}
      searchPlaceholder="Search..."
      searchFields={["position", "day_night", "note"]}
      onRowClick={onScoreClick}
      actions={actions}
      loading={isLoading}
      pagination={pagination}
      highlightRow={(row) => row.id === newlyAddedScoreId}
      emptyState={
        <div className={`text-center py-12 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
          <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">No scores yet</h3>
          <p className="text-sm">Add your first score to get started</p>
        </div>
      }
    />
  );
}