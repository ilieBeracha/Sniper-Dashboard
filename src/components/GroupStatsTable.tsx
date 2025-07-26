import { Edit, Target } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { useStore } from "zustand";
import { performanceStore } from "@/store/performance";
import { useParams } from "react-router-dom";
import { SpTable } from "@/layouts/SpTable";
import { GroupingScoreEntry } from "@/types/performance";

interface GroupStatsTableProps {
  onGroupStatsClick?: (group: GroupingScoreEntry) => void;
  onGroupStatsEditClick?: (group: GroupingScoreEntry) => void;
  newlyAddedGroupId?: string | null;
}

export default function GroupStatsTable({ onGroupStatsClick = () => {}, onGroupStatsEditClick = () => {}, newlyAddedGroupId }: GroupStatsTableProps) {
  const { theme } = useTheme();
  const { id } = useParams();

  const { groupingScores, isLoading, fetchGroupingScores } = useStore(performanceStore);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [paginatedGroupStats, setPaginatedGroupStats] = useState<GroupingScoreEntry[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const GROUP_LIMIT = 20;

  // Load paginated group stats
  const loadGroupStats = async () => {
    if (!id) return;

    try {
      await fetchGroupingScores(id, GROUP_LIMIT, currentPage * GROUP_LIMIT);
    } catch (error) {
      console.error("Error loading group stats:", error);
      setPaginatedGroupStats([]);
      setTotalCount(0);
    }
  };

  // Update paginated data when groupingScores changes
  useEffect(() => {
    if (groupingScores) {
      const offset = currentPage * GROUP_LIMIT;
      const paginatedData = groupingScores.slice(offset, offset + GROUP_LIMIT);

      setPaginatedGroupStats(paginatedData);
      setHasMore(offset + GROUP_LIMIT < groupingScores.length);
      setTotalCount(groupingScores.length);
    } else {
      setPaginatedGroupStats([]);
      setTotalCount(0);
      setHasMore(false);
    }
  }, [groupingScores, currentPage]);

  // Load initial group stats
  useEffect(() => {
    if (id) {
      setCurrentPage(0);
      loadGroupStats();
    }
  }, [id]);

  const columns = [
    {
      key: "type",
      label: "Group Type",
      render: (value: string) => <span className="font-medium">{value || "N/A"}</span>,
      className: "px-4 py-3",
    },
    {
      key: "sniper_name",
      label: "Sniper",
      render: (value: string, row: GroupingScoreEntry) => (
        <span className="truncate max-w-[120px]" title={value}>
          {`${row.sniper_first_name} ${row.sniper_last_name}` || "N/A"}
        </span>
      ),
      className: "px-4 py-3",
    },
    {
      key: "weapon_info",
      label: "Weapon",
      render: (value: string, row: GroupingScoreEntry) => (
        <div className="truncate max-w-[120px]" title={value}>
          <div className="font-medium">{row.weapon_type || "N/A"}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{row.weapon_serial_number || ""}</div>
        </div>
      ),
      className: "px-4 py-3",
    },
    {
      key: "bullets_fired",
      label: "Bullets Fired",
      render: (value: number) => <span className="font-mono">{value || 0}</span>,
      className: "px-4 py-3 text-center",
    },
    {
      key: "shooting_position",
      label: "Position",
      render: (value: string) => <span className="capitalize">{value || "N/A"}</span>,
      className: "px-4 py-3 hidden md:table-cell",
      hideOnMobile: true,
    },
    {
      key: "cm_dispersion",
      label: "CM Dispersion",
      render: (value: number) => <span className="font-mono font-semibold text-blue-600 dark:text-blue-400">{value ? `${value} cm` : "N/A"}</span>,
      className: "px-4 py-3",
    },
    {
      key: "time_seconds",
      label: "Time",
      render: (value: number) => <span className="font-mono text-sm">{value ? `${value}s` : "N/A"}</span>,
      className: "px-4 py-3 hidden md:table-cell",
      hideOnMobile: true,
    },
    {
      key: "effort",
      label: "Effort",
      render: (value: boolean) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            value
              ? "bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-400"
              : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
          }`}
        >
          {value ? "Yes" : "No"}
        </span>
      ),
      className: "px-4 py-3 hidden lg:table-cell",
      hideOnMobile: true,
    },
    {
      key: "created_at",
      label: "Date",
      render: (value: string) => <span className="text-sm">{format(new Date(value), "MMM dd, HH:mm")}</span>,
      className: "px-4 py-3 hidden lg:table-cell",
      hideOnMobile: true,
    },
  ];

  const actions = (row: GroupingScoreEntry) => (
    <div className="inline-flex gap-1 sm:gap-2">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onGroupStatsEditClick(row);
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
    totalPages: Math.ceil(totalCount / GROUP_LIMIT),
    pageSize: GROUP_LIMIT,
    totalItems: totalCount,
    onPageChange: (page: number) => setCurrentPage(page),
    onNextPage: () => {
      if (hasMore && !isLoading) {
        setCurrentPage(currentPage + 1);
      }
    },
    onPrevPage: () => {
      if (currentPage > 0 && !isLoading) {
        setCurrentPage(currentPage - 1);
      }
    },
    hasMore,
  };

  if (paginatedGroupStats?.length === 0 && !isLoading) {
    return (
      <div className={`text-center py-12 `}>
        <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-medium mb-2">No group stats yet</h3>
        <p className="text-sm">Add your first group stats to get started</p>
      </div>
    );
  }

  return (
    <SpTable
      data={paginatedGroupStats}
      columns={columns as any}
      filters={[]}
      searchPlaceholder="Search groups..."
      onRowClick={(row) => onGroupStatsClick(row)}
      actions={actions}
      loading={isLoading}
      pagination={pagination}
      highlightRow={(row) => row.id === newlyAddedGroupId}
      emptyState={
        <div className={`text-center py-12 ${theme === "dark" ? "text-gray-800" : "text-gray-900"}`}>
          <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">No group stats yet</h3>
          <p className="text-sm">Add your first group stats to get started</p>
        </div>
      }
    />
  );
}
