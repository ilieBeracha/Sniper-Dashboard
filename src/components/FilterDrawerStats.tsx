import { useState, useEffect } from "react";
import { X, Filter, LayoutGrid, Layers, Calendar, Sun, Target, Building2 } from "lucide-react";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { useTheme } from "@/contexts/ThemeContext";
import { useIsMobile } from "@/hooks/useIsMobile";
import type { PositionEnum, StatsFilters } from "@/types/stats";
import { DayNight } from "@/types/equipment";
import { userStore } from "@/store/userStore";
import { useStore } from "zustand";
import { squadStore } from "@/store/squadStore";
import { isCommander } from "@/utils/permissions";
import { UserRole } from "@/types/user";
import { motion, AnimatePresence } from "framer-motion";

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: StatsFilters;
  onFiltersChange: (filters: StatsFilters) => void;
  onApply: () => void;
  onClear: () => void;
  autoLoadStackView?: boolean;
  onAutoLoadChange?: (value: boolean) => void;
  viewMode?: "grid" | "stack";
  onViewModeChange?: (mode: "grid" | "stack") => void;
}

const arrOrNull = <T,>(a: T[] | null | undefined) => (a && a.length ? a : null);
const validPositions: PositionEnum[] = ["Sitting", "Standing", "Lying", "Operational"];

function sanitize(filters: StatsFilters): StatsFilters {
  const dayNight = arrOrNull(filters.dayNight?.map((d) => (d || "").toLowerCase() as DayNight));
  const positions = arrOrNull((filters.positions ?? []).filter((p): p is PositionEnum => validPositions.includes(p as PositionEnum)));

  // Dates: keep as ISO or null; do not coerce
  const startDate = filters.startDate ?? null;
  const endDate = filters.endDate ?? null;

  // Keep squadIds as is - don't force to null
  const squadIds = filters.squadIds ?? null;

  return { startDate, endDate, dayNight, positions, squadIds };
}

export default function FilterDrawer({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  onApply,
  onClear,
  autoLoadStackView,
  onAutoLoadChange,
  viewMode,
  onViewModeChange,
}: FilterDrawerProps) {
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  const { user } = useStore(userStore);
  const [localFilters, setLocalFilters] = useState<StatsFilters>(filters);
  const { squads } = useStore(squadStore);
  const { getSquadsByTeamId } = useStore(squadStore);
  
  useEffect(() => {
    if (isCommander(user?.user_role as UserRole) && user?.team_id) {
      getSquadsByTeamId(user?.team_id);
    }
  }, [user?.team_id]);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleApply = () => {
    const next = sanitize(localFilters);
    onFiltersChange(next);
    onApply();
    // Small delay to ensure smooth transition
    setTimeout(() => {
      onClose();
    }, 100);
  };

  const handleClear = () => {
    const cleared: Partial<StatsFilters> = {
      squadIds: null,
      startDate: null,
      endDate: null,
      dayNight: null,
      positions: null,
    };
    setLocalFilters(cleared as StatsFilters);
    onFiltersChange(cleared as StatsFilters);
    onClear();
  };

  const hasActiveFilters = !!(
    localFilters.startDate ||
    localFilters.endDate ||
    localFilters.dayNight?.length ||
    localFilters.positions?.length ||
    localFilters.squadIds?.length
  );

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <motion.div
        initial={isMobile ? { y: "100%" } : { x: "100%" }}
        animate={isOpen ? (isMobile ? { y: 0 } : { x: 0 }) : (isMobile ? { y: "100%" } : { x: "100%" })}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className={`fixed z-50 ${
          isMobile
            ? "bottom-0 left-0 right-0"
            : "top-0 right-0 bottom-0 w-[440px]"
        }`}
      >
        <div
          className={`${theme === "dark" ? "bg-gradient-to-b from-zinc-900 to-zinc-950" : "bg-white"} ${
            isMobile
              ? `rounded-t-2xl border-t ${theme === "dark" ? "border-zinc-800" : "border-gray-200"}`
              : `h-full border-l ${theme === "dark" ? "border-zinc-800" : "border-gray-200"}`
          } shadow-2xl relative flex flex-col`}
        >
          {/* Handle (mobile) */}
          {isMobile && (
            <div className="flex justify-center pt-3 pb-1">
              <div className={`w-12 h-1.5 rounded-full ${theme === "dark" ? "bg-zinc-600" : "bg-gray-300"}`} />
            </div>
          )}

          {/* Header */}
          <div className={`flex items-center justify-between px-6 ${isMobile ? "py-3" : "pt-6 pb-4"}`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${theme === "dark" ? "bg-zinc-800" : "bg-gray-100"}`}>
                <Filter size={18} className={theme === "dark" ? "text-zinc-400" : "text-gray-600"} />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Filters & Sort</h3>
                {hasActiveFilters && (
                  <p className="text-xs opacity-60 mt-0.5">{Object.values(localFilters).filter(Boolean).length} active</p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-all hover:scale-110 active:scale-95 ${
                theme === "dark" ? "hover:bg-zinc-800 text-zinc-400" : "hover:bg-gray-100 text-gray-500"
              }`}
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className={`flex-1 px-6 pb-6 overflow-y-auto custom-scrollbar ${isMobile ? "max-h-[60vh]" : ""}`}>
            {/* Basic Filters Section */}
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold mb-4 flex items-center gap-2">
                  <div className={`w-1 h-4 rounded-full ${theme === "dark" ? "bg-violet-500" : "bg-violet-600"}`} />
                  Basic Filters
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Day/Night */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Sun size={14} className="opacity-60" />
                      Day/Night
                    </label>
                    <Select
                      value={
                        !localFilters.dayNight || localFilters.dayNight.length === 0
                          ? "ALL"
                          : localFilters.dayNight.length === 2
                            ? "day,night"
                            : localFilters.dayNight[0]
                      }
                      onValueChange={(v) =>
                        setLocalFilters({
                          ...localFilters,
                          dayNight: v === "ALL" ? null : (v.split(",").map((x) => x.toLowerCase()) as DayNight[]),
                        })
                      }
                    >
                      <SelectTrigger
                        className={`w-full h-11 transition-all ${
                          theme === "dark" 
                            ? "bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700/50 focus:border-violet-500" 
                            : "bg-gray-50 border-gray-300 hover:bg-gray-100 focus:border-violet-600"
                        }`}
                      >
                        <SelectValue>{localFilters.dayNight?.join(", ") ?? "All"}</SelectValue>
                      </SelectTrigger>
                      <SelectContent className={theme === "dark" ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"}>
                        <SelectItem value="ALL">All</SelectItem>
                        <SelectItem value="day">Day</SelectItem>
                        <SelectItem value="night">Night</SelectItem>
                        <SelectItem value="day,night">Day + Night</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Positions */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Target size={14} className="opacity-60" />
                      Position
                    </label>
                    <Select
                      value={!localFilters.positions || localFilters.positions.length === 0 ? "ALL" : localFilters.positions.join(",")}
                      onValueChange={(v) =>
                        setLocalFilters({
                          ...localFilters,
                          positions: v === "ALL" ? null : (v.split(",").filter((x) => validPositions.includes(x as PositionEnum)) as PositionEnum[]),
                        })
                      }
                    >
                      <SelectTrigger
                        className={`w-full h-11 transition-all ${
                          theme === "dark" 
                            ? "bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700/50 focus:border-violet-500" 
                            : "bg-gray-50 border-gray-300 hover:bg-gray-100 focus:border-violet-600"
                        }`}
                      >
                        <SelectValue>{localFilters.positions?.join(", ") ?? "All"}</SelectValue>
                      </SelectTrigger>
                      <SelectContent className={theme === "dark" ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"}>
                        <SelectItem value="ALL">All</SelectItem>
                        <SelectItem value="Sitting">Sitting</SelectItem>
                        <SelectItem value="Standing">Standing</SelectItem>
                        <SelectItem value="Lying">Lying</SelectItem>
                        <SelectItem value="Operational">Operational</SelectItem>
                        <SelectItem value="Sitting,Standing">Sitting + Standing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Session Scope Section */}
              <div>
                <h4 className="text-sm font-semibold mb-4 flex items-center gap-2">
                  <div className={`w-1 h-4 rounded-full ${theme === "dark" ? "bg-orange-500" : "bg-orange-600"}`} />
                  Session Scope
                </h4>
                
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setLocalFilters({ ...localFilters, squadIds: null })}
                    className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all hover:scale-105 active:scale-95 ${
                      !localFilters.squadIds
                        ? theme === "dark"
                          ? "bg-violet-600 text-white shadow-lg"
                          : "bg-violet-600 text-white shadow-lg"
                        : theme === "dark"
                          ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300"
                    }`}
                  >
                    All Sessions
                  </button>
                  
                  {isCommander(user?.user_role as UserRole) && squads && squads.length > 0 && (
                    <Select
                      value={localFilters.squadIds?.[0] ?? ""}
                      onValueChange={(v) => setLocalFilters({ ...localFilters, squadIds: v ? [v] : null })}
                    >
                      <SelectTrigger
                        className={`min-w-[150px] h-11 transition-all ${
                          theme === "dark" 
                            ? "bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700/50" 
                            : "bg-gray-50 border-gray-300 hover:bg-gray-100"
                        }`}
                      >
                        <SelectValue placeholder="Select squad" />
                      </SelectTrigger>
                      <SelectContent className={theme === "dark" ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"}>
                        {squads?.map((squad) => (
                          <SelectItem key={squad.id} value={squad.id}>
                            {squad.squad_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  
                  {user?.squad_id && (
                    <button
                      onClick={() => setLocalFilters({ ...localFilters, squadIds: user.squad_id ? [user.squad_id] : null })}
                      className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all hover:scale-105 active:scale-95 flex items-center gap-2 ${
                        localFilters.squadIds?.length === 1 && localFilters.squadIds[0] === user.squad_id
                          ? theme === "dark"
                            ? "bg-orange-600 text-white shadow-lg"
                            : "bg-orange-600 text-white shadow-lg"
                          : theme === "dark"
                            ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300"
                      }`}
                    >
                      <Building2 size={14} />
                      {user?.squad_name || "My Squad"}
                    </button>
                  )}
                </div>
              </div>

              {/* Date Range Section */}
              <div>
                <h4 className="text-sm font-semibold mb-4 flex items-center gap-2">
                  <div className={`w-1 h-4 rounded-full ${theme === "dark" ? "bg-blue-500" : "bg-blue-600"}`} />
                  Date Range
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Calendar size={14} className="opacity-60" />
                      From
                    </label>
                    <input
                      type="date"
                      value={localFilters.startDate ? new Date(localFilters.startDate).toISOString().split("T")[0] : ""}
                      onChange={(e) =>
                        setLocalFilters({
                          ...localFilters,
                          startDate: e.target.value ? new Date(e.target.value).toISOString() : null,
                        })
                      }
                      className={`w-full h-11 px-4 rounded-lg border text-sm transition-all ${
                        theme === "dark"
                          ? "bg-zinc-800/50 border-zinc-700 text-zinc-100 hover:bg-zinc-700/50 focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                          : "bg-gray-50 border-gray-300 text-gray-900 hover:bg-gray-100 focus:border-violet-600 focus:ring-1 focus:ring-violet-600"
                      } focus:outline-none`}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Calendar size={14} className="opacity-60" />
                      To
                    </label>
                    <input
                      type="date"
                      value={localFilters.endDate ? new Date(localFilters.endDate).toISOString().split("T")[0] : ""}
                      onChange={(e) =>
                        setLocalFilters({
                          ...localFilters,
                          endDate: e.target.value ? new Date(e.target.value).toISOString() : null,
                        })
                      }
                      className={`w-full h-11 px-4 rounded-lg border text-sm transition-all ${
                        theme === "dark"
                          ? "bg-zinc-800/50 border-zinc-700 text-zinc-100 hover:bg-zinc-700/50 focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                          : "bg-gray-50 border-gray-300 text-gray-900 hover:bg-gray-100 focus:border-violet-600 focus:ring-1 focus:ring-violet-600"
                      } focus:outline-none`}
                    />
                  </div>
                </div>

                {/* Quick Date Presets */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      const tomorrow = new Date(today);
                      tomorrow.setDate(tomorrow.getDate() + 1);
                      setLocalFilters({
                        ...localFilters,
                        startDate: today.toISOString(),
                        endDate: tomorrow.toISOString(),
                      });
                    }}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all hover:scale-105 active:scale-95 ${
                      theme === "dark"
                        ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300"
                    }`}
                  >
                    Today
                  </button>
                  
                  <button
                    onClick={() => {
                      const today = new Date();
                      const lastWeek = new Date(today);
                      lastWeek.setDate(lastWeek.getDate() - 7);
                      setLocalFilters({
                        ...localFilters,
                        startDate: lastWeek.toISOString(),
                        endDate: today.toISOString(),
                      });
                    }}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all hover:scale-105 active:scale-95 ${
                      theme === "dark"
                        ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300"
                    }`}
                  >
                    Last 7 days
                  </button>
                  
                  <button
                    onClick={() => {
                      const today = new Date();
                      const lastMonth = new Date(today);
                      lastMonth.setDate(lastMonth.getDate() - 30);
                      setLocalFilters({
                        ...localFilters,
                        startDate: lastMonth.toISOString(),
                        endDate: today.toISOString(),
                      });
                    }}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all hover:scale-105 active:scale-95 ${
                      theme === "dark"
                        ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300"
                    }`}
                  >
                    Last 30 days
                  </button>
                  
                  <button
                    onClick={() => {
                      const today = new Date();
                      const thisYear = new Date(today.getFullYear(), 0, 1);
                      setLocalFilters({
                        ...localFilters,
                        startDate: thisYear.toISOString(),
                        endDate: today.toISOString(),
                      });
                    }}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all hover:scale-105 active:scale-95 ${
                      theme === "dark"
                        ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300"
                    }`}
                  >
                    This year
                  </button>
                </div>
              </div>

              {/* View Mode / Auto-load */}
              {(onViewModeChange || onAutoLoadChange) && (
                <div>
                  <h4 className="text-sm font-semibold mb-4 flex items-center gap-2">
                    <div className={`w-1 h-4 rounded-full ${theme === "dark" ? "bg-green-500" : "bg-green-600"}`} />
                    Display Options
                  </h4>
                  
                  {onViewModeChange && (
                    <div className="mb-4">
                      <label className="text-sm font-medium mb-2 block">View Mode</label>
                      <div
                        className={`flex rounded-lg p-1 ${
                          theme === "dark" ? "bg-zinc-800/50 border border-zinc-700" : "bg-gray-100 border border-gray-300"
                        }`}
                      >
                        <button
                          onClick={() => onViewModeChange!("grid")}
                          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-md transition-all ${
                            viewMode === "grid"
                              ? theme === "dark"
                                ? "bg-zinc-700 text-white shadow-sm"
                                : "bg-white text-gray-900 shadow-sm"
                              : theme === "dark"
                                ? "text-zinc-400 hover:text-zinc-300"
                                : "text-gray-500 hover:text-gray-700"
                          }`}
                        >
                          <LayoutGrid size={16} />
                          <span className="text-sm font-medium">Grid</span>
                        </button>
                        <button
                          onClick={() => onViewModeChange!("stack")}
                          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-md transition-all ${
                            viewMode === "stack"
                              ? theme === "dark"
                                ? "bg-zinc-700 text-white shadow-sm"
                                : "bg-white text-gray-900 shadow-sm"
                              : theme === "dark"
                                ? "text-zinc-400 hover:text-zinc-300"
                                : "text-gray-500 hover:text-gray-700"
                          }`}
                        >
                          <Layers size={16} />
                          <span className="text-sm font-medium">Stack</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {onAutoLoadChange && (
                    <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg transition-colors hover:bg-zinc-800/30">
                      <input
                        type="checkbox"
                        checked={autoLoadStackView || false}
                        onChange={(e) => onAutoLoadChange!(e.target.checked)}
                        className={`w-4 h-4 rounded ${theme === "dark" ? "accent-violet-500" : "accent-violet-600"}`}
                      />
                      <div className="flex-1">
                        <div className="text-sm font-medium">Auto-disable stack view with filters</div>
                        <div className="text-xs opacity-60 mt-0.5">Automatically switch to grid view when filters are active</div>
                      </div>
                    </label>
                  )}
                </div>
              )}

              {/* Active Filters Summary */}
              {hasActiveFilters && (
                <div className={`rounded-lg p-4 ${theme === "dark" ? "bg-zinc-800/30 border border-zinc-700/50" : "bg-gray-50 border border-gray-200"}`}>
                  <p className="text-xs font-semibold opacity-70 mb-3">Active Filters</p>
                  <div className="flex flex-wrap gap-2">
                    {localFilters.dayNight && (
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                          theme === "dark" ? "bg-blue-500/20 text-blue-300" : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        <Sun size={12} />
                        {localFilters.dayNight.join(", ")}
                      </span>
                    )}
                    {localFilters.positions && (
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                          theme === "dark" ? "bg-green-500/20 text-green-300" : "bg-green-100 text-green-700"
                        }`}
                      >
                        <Target size={12} />
                        {localFilters.positions.join(", ")}
                      </span>
                    )}
                    {localFilters.squadIds && (
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                          theme === "dark" ? "bg-orange-500/20 text-orange-300" : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        <Building2 size={12} />
                        {user?.squad_name || "Squad"}
                      </span>
                    )}
                    {(localFilters.startDate || localFilters.endDate) && (
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                          theme === "dark" ? "bg-violet-500/20 text-violet-300" : "bg-violet-100 text-violet-700"
                        }`}
                      >
                        <Calendar size={12} />
                        {localFilters.startDate && new Date(localFilters.startDate).toLocaleDateString()}
                        {localFilters.startDate && localFilters.endDate && " - "}
                        {localFilters.endDate && new Date(localFilters.endDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div
            className={`flex flex-col sm:flex-row gap-3 p-6 border-t ${
              theme === "dark" ? "border-zinc-800 bg-zinc-950/80" : "border-gray-200 bg-gray-50/80"
            } backdrop-blur-sm`}
          >
            <button
              onClick={handleClear}
              disabled={!hasActiveFilters}
              className={`flex-1 px-4 py-3 rounded-lg text-sm font-semibold transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${
                theme === "dark" 
                  ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700" 
                  : "bg-white hover:bg-gray-50 text-gray-700 border border-gray-300"
              }`}
            >
              Clear All
            </button>
            <button
              onClick={handleApply}
              className={`flex-1 px-4 py-3 rounded-lg text-sm font-semibold transition-all hover:scale-105 active:scale-95 shadow-lg ${
                theme === "dark"
                  ? "bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white"
                  : "bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white"
              }`}
            >
              Apply Filters
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}