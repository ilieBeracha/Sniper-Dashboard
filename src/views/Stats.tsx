import Header from "@/Headers/Header";
import { SpPage, SpPageBody, SpPageHeader } from "@/layouts/SpPage";
import { BarChart2, SlidersHorizontal } from "lucide-react";
import { userStore } from "@/store/userStore";
import { useStore } from "zustand";
import { useEffect, useState } from "react";

// import WeeklyActivityBars from "@/components/WeeklyActivityBars";
import { useStatsStore } from "@/store/statsStore";
import { useStatsFilters } from "@/hooks/useStatsFilters";
import StatsUserKPI from "@/components/StatsUserKPI";

// New components
import FirstShotMetrics from "@/components/FirstShotMetrics";
import EliminationByPosition from "@/components/EliminationByPosition";
import WeeklyTrends from "@/components/WeeklyTrends";
import FirstShotMatrixEnhanced from "@/components/FirstShotMatrixEnhanced";

import FilterDrawerStats from "@/components/FilterDrawerStats";
import { useTheme } from "@/contexts/ThemeContext";
import { motion } from "framer-motion";

export default function Stats() {
  const { user } = useStore(userStore);
  const { theme } = useTheme();
  const { getStatsOverviewTotals, getFirstShotMetrics, getEliminationByPosition, getWeeklyTrends, getFirstShotMatrix } = useStore(useStatsStore);
  const { filters, setFilters, clearFilters } = useStatsFilters();
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const refreshData = () => {
    if (user?.team_id) {
      console.log("Refreshing stats page data...");

      getStatsOverviewTotals(filters);
      getFirstShotMetrics(filters);
      getEliminationByPosition(filters);
      getWeeklyTrends({ ...filters, p_group_by_weapon: false });
      getFirstShotMatrix({
        ...filters,
        p_distance_bucket: 25,
        p_min_targets: 0,
        p_min_distance: 100,
        p_max_distance: 900,
      });
    }
  };

  useEffect(() => {
    refreshData();
  }, [user?.team_id, filters]); // Re-fetch when filters change

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && user?.team_id) {
        console.log("Page became visible, refreshing data...");
        refreshData();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    const handleFocus = () => {
      if (user?.team_id) {
        console.log("Window gained focus, refreshing data...");
        refreshData();
      }
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [user?.team_id]);

  return (
    <SpPage>
      <Header breadcrumbs={[{ label: "Stats", link: "/stats" }]} />
      <SpPageHeader title="Stats" subtitle="KPIs, impact and trends" icon={BarChart2} />

      {/* Filter Button Section */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Active filters display */}
          {(filters.startDate || filters.endDate || filters.dayNight?.length || filters.positions?.length) && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2">
              <span className={`text-xs ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>Active filters:</span>
              <div className="flex items-center gap-1">
                {filters.startDate && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs ${theme === "dark" ? "bg-zinc-800 text-zinc-300" : "bg-gray-100 text-gray-700"}`}
                  >
                    From: {new Date(filters.startDate).toLocaleDateString()}
                  </span>
                )}
                {filters.endDate && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs ${theme === "dark" ? "bg-zinc-800 text-zinc-300" : "bg-gray-100 text-gray-700"}`}
                  >
                    To: {new Date(filters.endDate).toLocaleDateString()}
                  </span>
                )}
                {filters.dayNight?.length && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs ${theme === "dark" ? "bg-zinc-800 text-zinc-300" : "bg-gray-100 text-gray-700"}`}
                  >
                    {filters.dayNight.join(", ")}
                  </span>
                )}
                {filters.positions?.length && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs ${theme === "dark" ? "bg-zinc-800 text-zinc-300" : "bg-gray-100 text-gray-700"}`}
                  >
                    {filters.positions.length} position{filters.positions.length > 1 ? "s" : ""}
                  </span>
                )}
              </div>
              <button
                onClick={() => {
                  clearFilters();
                  refreshData();
                }}
                className={`ml-2 text-xs underline ${theme === "dark" ? "text-zinc-400 hover:text-zinc-300" : "text-gray-600 hover:text-gray-800"} transition-colors`}
              >
                Clear all
              </button>
            </motion.div>
          )}
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsFilterDrawerOpen(true)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all
            ${
              theme === "dark"
                ? "bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700"
                : "bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 shadow-sm"
            }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="text-sm font-medium">Filters</span>
          {(filters.startDate || filters.endDate || filters.dayNight?.length || filters.positions?.length) && (
            <span
              className={`ml-1 px-1.5 py-0.5 rounded-full text-xs font-medium
              ${theme === "dark" ? "bg-violet-500/20 text-violet-400" : "bg-violet-100 text-violet-600"}`}
            >
              {[
                filters.startDate ? 1 : 0,
                filters.endDate ? 1 : 0,
                filters.dayNight?.length ? 1 : 0,
                filters.positions?.length ? 1 : 0,
              ].reduce((a, b) => a + b, 0)}
            </span>
          )}
        </motion.button>
      </div>
      <SpPageBody>
        <div className="space-y-2">
          <FilterDrawerStats
            onClear={() => {
              clearFilters();
              refreshData();
            }}
            isOpen={isFilterDrawerOpen}
            onClose={() => setIsFilterDrawerOpen(false)}
            filters={filters}
            onFiltersChange={setFilters}
            onApply={() => {
              refreshData();
            }}
          />
          <StatsUserKPI />

          {/* New Stats Components */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            <FirstShotMetrics />
            <EliminationByPosition />
          </div>

          <WeeklyTrends />

          <FirstShotMatrixEnhanced />
        </div>
      </SpPageBody>
    </SpPage>
  );
}