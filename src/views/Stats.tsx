import Header from "@/Headers/Header";
import { SpPage, SpPageBody, SpPageHeader } from "@/layouts/SpPage";
import { BarChart2, SlidersHorizontal, Calendar, Target, Sun, Crosshair, Activity, Building2 } from "lucide-react";
import { userStore } from "@/store/userStore";
import { useStore } from "zustand";
import { useEffect, useState, useCallback, useRef } from "react";

import { useStatsStore } from "@/store/statsStore";
import { useStatsFilters } from "@/hooks/useStatsFilters";
import StatsUserKPI from "@/components/StatsUserKPI";

// Components
import EliminationByPosition from "@/components/EliminationByPosition";
// import WeeklyTrends from "@/components/WeeklyTrends";
import FirstShotMatrixEnhanced from "@/components/FirstShotMatrixEnhanced";

import FilterDrawerStats from "@/components/FilterDrawerStats";
import { useTheme } from "@/contexts/ThemeContext";
import { motion } from "framer-motion";
import { Loader2, RefreshCw } from "lucide-react";
import { squadStore } from "@/store/squadStore";
import { getSquadsByTeamId } from "@/services/squadService";
import { isCommander } from "@/utils/permissions";
import { UserRole } from "@/types/user";

const StatsCard = ({
  title,
  icon: Icon,
  children,
  className = "",
  color = "neutral",
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  className?: string;
  color?: "neutral" | "subtle" | "accent";
}) => {
  const { theme } = useTheme();

  const colorClasses = {
    neutral: {
      bg: theme === "dark" ? "bg-zinc-900/50" : "bg-white",
      border: theme === "dark" ? "border-zinc-900" : "border-gray-200",
      icon: theme === "dark" ? "text-zinc-400" : "text-gray-600",
    },
    subtle: {
      bg: theme === "dark" ? "bg-zinc-900/50" : "bg-gray-50",
      border: theme === "dark" ? "border-zinc-900" : "border-gray-300",
      icon: theme === "dark" ? "text-zinc-500" : "text-gray-500",
    },
    accent: {
      bg: theme === "dark" ? "bg-zinc-900/50" : "bg-violet-50/50",
      border: theme === "dark" ? "border-zinc-900" : "border-violet-200",
      icon: theme === "dark" ? "text-zinc-400" : "text-violet-600",
    },
  };

  const classes = colorClasses[color];

  return (
    <div className={`rounded-xl border ${classes.bg} ${classes.border} overflow-hidden ${className}`}>
      <div className="px-4 py-3 border-b border-inherit">
        <div className="flex items-center gap-2">
          <Icon className={`w-4 h-4 ${classes.icon}`} />
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">{title}</h3>
        </div>
      </div>
      <div className="">{children}</div>
    </div>
  );
};

export default function Stats() {
  const { user } = useStore(userStore);
  const { theme } = useTheme();
  const { getStatsOverviewTotals, getFirstShotMetrics, getEliminationByPosition, getWeeklyTrends, getFirstShotMatrix } = useStore(useStatsStore);
  const { filters, setFilters, clearFilters } = useStatsFilters();
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastFiltersHash, setLastFiltersHash] = useState<string>("");
  const [dataVersion, setDataVersion] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  const { squads } = useStore(squadStore);
  // Create a stable hash of filters for comparison
  const getFiltersHash = useCallback((currentFilters: any) => {
    return JSON.stringify({
      startDate: currentFilters.startDate,
      endDate: currentFilters.endDate,
      dayNight: currentFilters.dayNight?.sort(),
      positions: currentFilters.positions?.sort(),
      squadIds: currentFilters.squadIds?.sort(),
    });
  }, []);

  useEffect(() => {
    console.log("squads", squads);
    if (isCommander(user?.user_role as UserRole) && user?.team_id) {
      getSquadsByTeamId(user?.team_id);
    }
  }, [user?.team_id]);

  // Robust data refresh function with proper error handling and cancellation
  const refreshData = useCallback(
    async (forceRefresh = false) => {
      if (!user?.team_id) return;

      const currentFiltersHash = getFiltersHash(filters);

      // Skip if filters haven't changed and not forced
      if (!forceRefresh && currentFiltersHash === lastFiltersHash && dataVersion > 0) {
        return;
      }

      // Cancel any ongoing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();
      const { signal } = abortControllerRef.current;

      setIsLoading(true);

      try {
        // Increment data version to track changes
        setDataVersion((prev) => prev + 1);

        const results = await Promise.allSettled([
          getStatsOverviewTotals(filters),
          getFirstShotMetrics(filters),
          getEliminationByPosition(filters),
          getWeeklyTrends({ ...filters, p_group_by_weapon: false }),
          getFirstShotMatrix({
            ...filters,
            p_distance_bucket: 25,
            p_min_targets: 0,
            p_min_distance: 100,
            p_max_distance: 900,
          }),
        ]);

        // Check if request was cancelled
        if (signal.aborted) {
          return;
        }

        // Log results and handle any failures
        let hasFailures = false;
        results.forEach((result, index) => {
          if (result.status === "rejected") {
            hasFailures = true;
            console.error(`❌ Request ${index} failed:`, result.reason);
          }
        });

        if (!hasFailures) {
          setLastFiltersHash(currentFiltersHash);
        } else {
          console.warn("⚠️ Some data failed to refresh");
        }
      } catch (error) {
        if (!signal.aborted) {
          console.error("❌ Error refreshing stats data:", error);
        }
      } finally {
        if (!signal.aborted) {
          setIsLoading(false);
        }
      }
    },
    [
      user?.team_id,
      filters,
      lastFiltersHash,
      dataVersion,
      getFiltersHash,
      getStatsOverviewTotals,
      getFirstShotMetrics,
      getEliminationByPosition,
      getWeeklyTrends,
      getFirstShotMatrix,
    ],
  );

  // Clear filters handler
  const handleClearFilters = useCallback(() => {
    clearFilters();
    // Don't call refreshData here - let the useEffect handle it
  }, [clearFilters]);

  // Effect to refresh data when filters change
  useEffect(() => {
    if (user?.team_id) {
      // Always refresh when filters change, including when cleared
      refreshData();
    }
  }, [filters, user?.team_id]); // Remove refreshData from dependencies

  // Effect to refresh data when user changes
  useEffect(() => {
    if (user?.team_id) {
      refreshData(true); // Force refresh for user change
    }
  }, [user?.team_id]); // Remove refreshData from dependencies

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Manual refresh handler
  const handleManualRefresh = useCallback(() => {
    refreshData(true);
  }, [refreshData]);

  // Filter change handler with debouncing
  const handleFiltersChange = useCallback(
    (newFilters: any) => {
      console.log("newFilters", newFilters);
      setFilters(newFilters);
    },
    [setFilters],
  );

  const hasActiveFilters = !!(
    filters.startDate ||
    filters.endDate ||
    filters.dayNight?.length ||
    filters.positions?.length ||
    filters.squadIds?.length
  );

  // Format date range for display
  const getDateRangeDisplay = () => {
    if (filters.startDate && filters.endDate) {
      const start = new Date(filters.startDate);
      const end = new Date(filters.endDate);
      const formatOptions: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };

      // Check if same year
      if (start.getFullYear() === end.getFullYear()) {
        // Check if same month
        if (start.getMonth() === end.getMonth()) {
          return `${start.toLocaleDateString("en-US", formatOptions)} - ${end.getDate()}`;
        }
        return `${start.toLocaleDateString("en-US", formatOptions)} - ${end.toLocaleDateString("en-US", formatOptions)}`;
      }
      return `${start.toLocaleDateString("en-US", { ...formatOptions, year: "2-digit" })} - ${end.toLocaleDateString("en-US", { ...formatOptions, year: "2-digit" })}`;
    }
    return null;
  };

  return (
    <SpPage>
      <Header breadcrumbs={[{ label: "Stats", link: "/stats" }]} />
      <SpPageHeader title="Stats" subtitle="Performance analytics" icon={BarChart2} />

      {/* Filter Section - Improved Mobile Layout */}
      <div className=" px-4 sm:px-0">
        {/* Active Filters Display - Mobile Optimized */}
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-3 p-3 rounded-lg ${theme === "dark" ? "bg-zinc-900/50 border border-zinc-800" : "bg-gray-50 border border-gray-200"}`}
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-xs font-medium ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>Active:</span>

              {/* Date Range */}
              {getDateRangeDisplay() && (
                <span
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${
                    theme === "dark" ? "bg-violet-500/20 text-violet-300" : "bg-violet-100 text-violet-700"
                  }`}
                >
                  <Calendar className="w-3 h-3" />
                  {getDateRangeDisplay()}
                </span>
              )}

              {/* Day/Night */}
              {filters.dayNight?.length && (
                <span
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${
                    theme === "dark" ? "bg-zinc-500/20 text-zinc-300" : "bg-gray-100 text-gray-700"
                  }`}
                >
                  <Sun className="w-3 h-3" />
                  {filters.dayNight.length === 2 ? "Day & Night" : filters.dayNight[0]}
                </span>
              )}

              {/* Position */}
              {filters.positions?.length && (
                <span
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${
                    theme === "dark" ? "bg-zinc-500/20 text-zinc-300" : "bg-gray-100 text-gray-700"
                  }`}
                >
                  <Target className="w-3 h-3" />
                  {filters.positions.length === 1 ? filters.positions[0] : `${filters.positions.length} positions`}
                </span>
              )}

              {/* Squad Filter */}
              {filters.squadIds?.length && (
                <span
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${
                    theme === "dark" ? "bg-orange-500/20 text-orange-300" : "bg-orange-100 text-orange-700"
                  }`}
                >
                  <Building2 className="w-3 h-3" />
                  <span>My Squad</span>
                </span>
              )}

              {/* Clear Button */}
              <button
                onClick={handleClearFilters}
                className={`ml-auto text-xs underline ${
                  theme === "dark" ? "text-zinc-400 hover:text-zinc-300" : "text-gray-600 hover:text-gray-800"
                } transition-colors`}
              >
                Clear
              </button>
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleManualRefresh}
            disabled={isLoading}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all
              ${
                theme === "dark"
                  ? "bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 disabled:opacity-50"
                  : "bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 disabled:opacity-50"
              }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsFilterDrawerOpen(true)}
            disabled={isLoading}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all flex-1 sm:flex-initial
              ${
                theme === "dark"
                  ? "bg-violet-700 hover:bg-violet-500 text-white disabled:opacity-50"
                  : "bg-violet-600 hover:bg-violet-700 text-white disabled:opacity-50"
              }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span
                className={`ml-1 px-1.5 py-0.5 rounded-full text-xs font-medium ${
                  theme === "dark" ? "bg-violet-500/30 text-violet-200" : "bg-violet-500 text-white"
                }`}
              >
                {[
                  filters.startDate ? 1 : 0,
                  filters.endDate ? 1 : 0,
                  filters.dayNight?.length ? 1 : 0,
                  filters.positions?.length ? 1 : 0,
                  filters.squadIds?.length ? 1 : 0,
                ].reduce((a, b) => a + b, 0)}
              </span>
            )}
          </motion.button>
        </div>
      </div>

      <SpPageBody>
        <div className="space-y-6 relative">
          {/* Loading Overlay - Now properly controlled */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black/5 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg min-h-[200px]"
            >
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  theme === "dark" ? "bg-zinc-800 text-white" : "bg-white text-gray-900"
                } shadow-lg`}
              >
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Loading data...</span>
              </div>
            </motion.div>
          )}

          {/* Masonry Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
            {/* KPI Overview - Spans full width */}
            <div className="lg:col-span-12">
              <StatsCard title="Performance Overview" icon={Activity} color="accent">
                <StatsUserKPI />
              </StatsCard>
            </div>

            {/* Position & Elimination - Spans 8 columns */}
            <div className="lg:col-span-8">
              <StatsCard title="Position & Elimination Analysis" icon={Target} color="subtle">
                <EliminationByPosition />
              </StatsCard>
            </div>

            {/* First Shot Matrix - Spans 6 columns */}
            <div className="lg:col-span-6">
              <StatsCard title="First Shot Matrix" icon={Crosshair} color="neutral">
                <FirstShotMatrixEnhanced />
              </StatsCard>
            </div>

            {/* Weekly Trends - Spans 4 columns */}
            {/* <div className="lg:col-span-4">
              <StatsCard title="Weekly Trends" icon={TrendingUp} color="subtle">
                <WeeklyTrends />
              </StatsCard>
            </div> */}
          </div>
          <FilterDrawerStats
            onClear={handleClearFilters}
            isOpen={isFilterDrawerOpen}
            onClose={() => setIsFilterDrawerOpen(false)}
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onApply={() => {
              setIsFilterDrawerOpen(false);
              // Refresh will happen automatically via useEffect
            }}
          />
        </div>
      </SpPageBody>
    </SpPage>
  );
}
