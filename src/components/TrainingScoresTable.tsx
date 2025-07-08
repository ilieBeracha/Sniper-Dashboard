import { Eye, Edit, Filter, Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { format } from "date-fns";
import { useState, useMemo, useEffect } from "react";
import { useStore } from "zustand";
import { scoreStore } from "@/store/scoreSrore";
import { useParams } from "react-router-dom";
import { useIsMobile } from "@/hooks/useIsMobile";

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
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState("");
  const [positionFilter, setPositionFilter] = useState("");
  const [dayNightFilter, setDayNightFilter] = useState("");
  const [targetEliminatedFilter, setTargetEliminatedFilter] = useState("");
  const [showFilters, setShowFilters] = useState(!isMobile); // Always show on desktop, hidden by default on mobile

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

  // Update showFilters when screen size changes
  useEffect(() => {
    setShowFilters(!isMobile);
  }, [isMobile]);

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

  // Get unique values for filters (use all scores prop for complete filter options)
  const uniquePositions = useMemo(() => {
    const positions = scores.map((score) => score.position).filter(Boolean);
    return [...new Set(positions)];
  }, [scores]);

  const uniqueDayNight = useMemo(() => {
    const dayNight = scores.map((score) => score.day_night).filter(Boolean);
    return [...new Set(dayNight)];
  }, [scores]);

  // Filter paginated scores based on search and filters
  const filteredScores = useMemo(() => {
    return paginatedScores.filter((score) => {
      const participant = score.score_participants?.[0]?.user;
      const participantName = participant ? `${participant.first_name} ${participant.last_name}` : "";
      const assignmentName = score.assignment_session?.assignment?.assignment_name || "";

      const matchesSearch =
        searchTerm === "" ||
        participantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (score.note && score.note.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesPosition = positionFilter === "" || score.position === positionFilter;
      const matchesDayNight = dayNightFilter === "" || score.day_night === dayNightFilter;
      const matchesTargetEliminated =
        targetEliminatedFilter === "" ||
        (targetEliminatedFilter === "true" && score.target_eliminated === true) ||
        (targetEliminatedFilter === "false" && score.target_eliminated === false) ||
        (targetEliminatedFilter === "null" && score.target_eliminated === null);

      return matchesSearch && matchesPosition && matchesDayNight && matchesTargetEliminated;
    });
  }, [paginatedScores, searchTerm, positionFilter, dayNightFilter, targetEliminatedFilter]);

  const clearFilters = () => {
    setSearchTerm("");
    setPositionFilter("");
    setDayNightFilter("");
    setTargetEliminatedFilter("");
  };

  const hasActiveFilters = searchTerm || positionFilter || dayNightFilter || targetEliminatedFilter;

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

  return (
    <div
      className={`rounded-xl border transition-colors duration-200 ${
        theme === "dark" ? "border-zinc-800 bg-zinc-900/50" : "border-gray-200 bg-white"
      }`}
    >
      {/* Filters Section */}
      <div
        className={`p-4 border-b transition-colors duration-200 flex items-center justify-between ${theme === "dark" ? "border-zinc-800" : "border-gray-200"}`}
      >
        <div className="space-y-4">
          {/* Filter Toggle Button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isMobile && (
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
                    theme === "dark" ? "bg-zinc-800 text-gray-300 hover:bg-zinc-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  {showFilters ? "Hide" : "Show"} Filters
                </button>
              )}
              {!isMobile && (
                <>
                  <Filter className="w-4 h-4" />
                  <span>Filters</span>
                </>
              )}
              {hasActiveFilters && (
                <span
                  className={`inline-flex items-center justify-center w-5 h-5 text-xs rounded-full ${
                    theme === "dark" ? "bg-purple-600 text-white" : "bg-purple-500 text-white"
                  }`}
                >
                  {[searchTerm, positionFilter, dayNightFilter, targetEliminatedFilter].filter(Boolean).length}
                </span>
              )}
            </div>
          </div>

          {/* Collapsible Filter Controls */}
          {showFilters && (
            <div className="gap-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 animate-in slide-in-from-top-2 duration-200">
              <div className="relative sm:col-span-2 lg:col-span-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border transition-colors duration-200 text-sm ${
                    theme === "dark"
                      ? "border-zinc-700 bg-zinc-800 text-white placeholder-gray-400 focus:border-purple-400"
                      : "border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-purple-500"
                  } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                />
              </div>
              {/* Position Filter */}
              <select
                value={positionFilter}
                onChange={(e) => setPositionFilter(e.target.value)}
                className={`px-3 py-2 rounded-lg border text-sm transition-colors duration-200 ${
                  theme === "dark"
                    ? "border-zinc-700 bg-zinc-800 text-white focus:border-purple-400"
                    : "border-gray-300 bg-white text-gray-900 focus:border-purple-500"
                } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
              >
                <option value="">All Positions</option>
                {uniquePositions.map((position) => (
                  <option key={position} value={position}>
                    {position}
                  </option>
                ))}
              </select>

              {/* Day/Night Filter */}
              <select
                value={dayNightFilter}
                onChange={(e) => setDayNightFilter(e.target.value)}
                className={`px-3 py-2 rounded-lg border text-sm transition-colors duration-200 ${
                  theme === "dark"
                    ? "border-zinc-700 bg-zinc-800 text-white focus:border-purple-400"
                    : "border-gray-300 bg-white text-gray-900 focus:border-purple-500"
                } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
              >
                <option value="">All Times</option>
                {uniqueDayNight.map((dayNight) => (
                  <option key={dayNight} value={dayNight}>
                    {dayNight}
                  </option>
                ))}
              </select>

              {/* Target Eliminated Filter */}
              <select
                value={targetEliminatedFilter}
                onChange={(e) => setTargetEliminatedFilter(e.target.value)}
                className={`px-3 py-2 rounded-lg border text-sm transition-colors duration-200 ${
                  theme === "dark"
                    ? "border-zinc-700 bg-zinc-800 text-white focus:border-purple-400"
                    : "border-gray-300 bg-white text-gray-900 focus:border-purple-500"
                } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
              >
                <option value="">All Targets</option>
                <option value="true">Eliminated ✅</option>
                <option value="false">Not Eliminated ❌</option>
                <option value="null">Unknown</option>
              </select>

              {/* Clear Filters Button */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
                    theme === "dark" ? "bg-zinc-700 text-gray-300 hover:bg-zinc-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <X className="w-4 h-4" />
                  Clear
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className={`min-w-full text-sm transition-colors duration-200 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
          <thead
            className={`text-xs uppercase border-b transition-colors duration-200 ${
              theme === "dark" ? "border-zinc-800 bg-zinc-800/50" : "border-gray-200 bg-gray-50"
            }`}
          >
            <tr>
              <th className="px-2 sm:px-4 py-3">Assignment</th>
              <th className="px-2 sm:px-4 py-3">Participant</th>
              <th className="px-2 sm:px-4 py-3  sm:table-cell">Position</th>
              <th className="px-2 sm:px-4 py-3  lg:table-cell">Day/Night</th>
              <th className="px-2 sm:px-4 py-3  lg:table-cell">Target Eliminated</th>
              <th className="px-2 sm:px-4 py-3  md:table-cell">Created</th>
              <th className="px-2 sm:px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredScores.map((score, index) => {
              const isNew = score.id === newlyAddedScoreId;
              const isLastRow = index === filteredScores.length - 1;

              const participant = score.score_participants?.[0]?.user;
              // const wind = score.wind_direction || score.wind_strength ? `${score.wind_direction ?? "?"}° @ ${score.wind_strength ?? "?"}` : "N/A";

              return (
                <tr
                  key={score.id}
                  className={`transition-colors border-b ${
                    isLastRow ? "border-transparent" : theme === "dark" ? "border-zinc-800/50" : "border-gray-100"
                  } ${
                    isNew ? "bg-indigo-100/40 dark:bg-indigo-800/20 animate-pulse" : theme === "dark" ? "hover:bg-zinc-800/50" : "hover:bg-gray-50"
                  }`}
                >
                  <td className="px-2 sm:px-4 py-3 font-medium truncate max-w-[100px] sm:max-w-[150px]">
                    {score.assignment_session?.assignment?.assignment_name || "N/A"}
                  </td>
                  <td className="px-2 sm:px-4 py-3 truncate max-w-[80px] sm:max-w-none">
                    {participant ? `${participant.first_name} ${participant.last_name}` : "N/A"}
                  </td>
                  <td className="px-2 sm:px-4 py-3 capitalize  sm:table-cell">{score.position || "N/A"}</td>
                  <td className="px-2 sm:px-4 py-3 capitalize  lg:table-cell">{score.day_night || "N/A"}</td>
                  <td className="px-2 sm:px-4 py-3  lg:table-cell">
                    {score.target_eliminated === null ? "N/A" : score.target_eliminated ? "✅" : "❌"}
                  </td>
                  <td className="px-2 sm:px-4 py-3  md:table-cell">{format(score.created_at, "yyyy-MM-dd HH:mm")}</td>
                  <td className="px-2 sm:px-4 py-3 text-right">
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
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filteredScores.length === 0 && paginatedScores.length > 0 && (
        <div className={`text-center py-8 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
          <Filter className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No scores match your current filters</p>
        </div>
      )}

      {/* Pagination Controls */}
      {paginatedScores.length > 0 && (
        <div
          className={`flex items-center justify-between p-4 border-t transition-colors duration-200 ${
            theme === "dark" ? "border-zinc-800" : "border-gray-200"
          }`}
        >
          <div className={`text-xs sm:text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
            <span className="hidden sm:inline">
              Page {currentPage + 1} of {Math.ceil(totalCount / SCORES_LIMIT)} •{" "}
            </span>
            <span className="sm:hidden">Page {currentPage + 1} • </span>
            {paginatedScores.length} <span className="hidden sm:inline">of {SCORES_LIMIT} per page</span>
            {totalCount > 0 && <span className="hidden md:inline"> • {totalCount} total scores</span>}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={prevPage}
              disabled={currentPage === 0 || isLoading}
              className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
                currentPage === 0 || isLoading
                  ? "opacity-50 cursor-not-allowed"
                  : theme === "dark"
                    ? "bg-zinc-800 text-gray-300 hover:bg-zinc-700"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            <button
              onClick={nextPage}
              disabled={!hasMore || isLoading}
              className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
                !hasMore || isLoading
                  ? "opacity-50 cursor-not-allowed"
                  : theme === "dark"
                    ? "bg-zinc-800 text-gray-300 hover:bg-zinc-700"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Loading Indicator */}
      {isLoading && (
        <div className={`text-center py-4 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin border-current"></div>
            <span className="text-sm">Loading scores...</span>
          </div>
        </div>
      )}
    </div>
  );
}
