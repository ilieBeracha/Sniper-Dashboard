import { Edit, Target, MoreVertical, BarChart } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { useStore } from "zustand";
import { performanceStore } from "@/store/performance";
import { useParams } from "react-router-dom";
import { SpTable } from "@/layouts/SpTable";
import { GroupingScoreEntry } from "@/types/performance";
import GroupScoreModal from "./GroupScoreModal";
import { sessionStore } from "@/store/sessionStore";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";

interface GroupStatsTableProps {
  onGroupStatsClick?: (group: GroupingScoreEntry) => void;
  onGroupStatsEditClick?: (group: GroupingScoreEntry) => void;
  newlyAddedGroupId?: string | null;
}

export default function GroupStatsTable({ onGroupStatsEditClick = () => {}, newlyAddedGroupId }: GroupStatsTableProps) {
  const { theme } = useTheme();
  const { id } = useParams();

  const { groupingScores, isLoading, fetchGroupingScores, getGroupingScoresCount, groupingScoresTotalCount } = useStore(performanceStore);
  const { getGroupingScoreComparisonById } = useStore(sessionStore);
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const GROUP_LIMIT = 20;

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load paginated group stats
  const loadGroupStats = async (page: number = currentPage) => {
    if (!id) return;

    try {
      await fetchGroupingScores(id, GROUP_LIMIT, page * GROUP_LIMIT);
    } catch (error) {
      console.error("Error loading group stats:", error);
    }
  };

  // Load total count
  const loadTotalCount = async () => {
    if (!id) return;
    try {
      await getGroupingScoresCount(id);
    } catch (error) {
      console.error("Error loading group stats count:", error);
    }
  };

  const handleGroupStatsClick = async (group: GroupingScoreEntry) => {
    await getGroupingScoreComparisonById(group.id);
    setIsModalOpen(true);
  };

  // Load initial data when component mounts or id changes
  useEffect(() => {
    if (id) {
      setCurrentPage(0);
      loadTotalCount();
      loadGroupStats(0);
    }
  }, [id]);

  // Reload data when page changes
  useEffect(() => {
    if (id) {
      loadGroupStats(currentPage);
    }
  }, [currentPage]);

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
      render: (value: number, row: GroupingScoreEntry) => (
        <span
          className="font-mono font-semibold text-blue-600 dark:text-blue-400 cursor-pointer hover:underline"
          onClick={async (e) => {
            e.stopPropagation();
            setIsModalOpen(true);
            await getGroupingScoreComparisonById(row.id);
          }}
        >
          {value ? `${value} cm` : "N/A"}
        </span>
      ),
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
      <Dropdown>
        <DropdownTrigger>
          <button
            onClick={(e) => e.stopPropagation()}
            className={`p-1.5 sm:p-2 rounded hover:bg-gray-100 dark:hover:bg-zinc-800 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
            title="More options"
          >
            <MoreVertical size={16} />
          </button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Group actions"
          className={`${theme === "dark" ? "bg-zinc-900" : "bg-white"} rounded-lg shadow-lg border ${theme === "dark" ? "border-zinc-800" : "border-gray-200"}`}
        >
          <DropdownItem
            key="stats"
            className={`text-sm ${theme === "dark" ? "text-gray-200 hover:bg-zinc-800" : "text-gray-700 hover:bg-gray-50"}`}
            onPress={async () => {
              await getGroupingScoreComparisonById(row.id);
              setIsModalOpen(true);
            }}
            startContent={<BarChart size={14} />}
          >
            Show Stats
          </DropdownItem>
          <DropdownItem
            key="edit"
            className={`text-sm ${theme === "dark" ? "text-gray-200 hover:bg-zinc-800" : "text-gray-700 hover:bg-gray-50"}`}
            onPress={() => onGroupStatsEditClick(row)}
            startContent={<Edit size={14} />}
          >
            Edit
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );

  const hasMore = (currentPage + 1) * GROUP_LIMIT < groupingScoresTotalCount;

  const pagination = {
    currentPage,
    totalPages: Math.ceil(groupingScoresTotalCount / GROUP_LIMIT),
    pageSize: GROUP_LIMIT,
    totalItems: groupingScoresTotalCount,
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

  if (groupingScores?.length === 0 && !isLoading) {
    return (
      <div className={`text-center py-12 `}>
        <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-medium mb-2">No group stats yet</h3>
        <p className="text-sm">Add your first group stats to get started</p>
      </div>
    );
  }

  // Calculate stats for header
  const totalGroups = groupingScoresTotalCount;
  const currentPageGroups = groupingScores?.length || 0;
  const avgDispersion = groupingScores?.length
    ? (
        groupingScores.reduce((sum, score) => sum + (score.cm_dispersion || 0), 0) / groupingScores.filter((score) => score.cm_dispersion).length
      ).toFixed(1)
    : "0";
  const bestDispersion = groupingScores?.length
    ? Math.min(...groupingScores.filter((score) => score.cm_dispersion).map((score) => score.cm_dispersion || Infinity))
    : 0;

  return (
    <>
      {/* Stats Header */}
      <div className={`p-4 rounded-lg border ${theme === "dark" ? "bg-zinc-900/50 border-zinc-800" : "bg-gray-50 border-gray-200"}`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Target className={`w-5 h-5 ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`} />
            <h3 className="text-lg font-semibold">Group Statistics</h3>
          </div>

          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex flex-col items-center">
              <span className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Total Groups</span>
              <span className="font-semibold text-lg">{totalGroups}</span>
            </div>

            {totalGroups > 0 && (
              <>
                <div className="flex flex-col items-center">
                  <span className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Avg Dispersion</span>
                  <span className={`font-semibold text-lg ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`}>
                    {avgDispersion !== "NaN" ? `${avgDispersion} cm` : "N/A"}
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <span className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Best Group</span>
                  <span className={`font-semibold text-lg ${theme === "dark" ? "text-green-400" : "text-green-600"}`}>
                    {bestDispersion !== Infinity ? `${bestDispersion} cm` : "N/A"}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <SpTable
        data={groupingScores || []}
        columns={columns as any}
        filters={[]}
        searchPlaceholder="Search groups..."
        onRowClick={(row) => handleGroupStatsClick(row)}
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
      <GroupScoreModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
