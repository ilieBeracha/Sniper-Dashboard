import { useState, useEffect } from "react";
import { X, Filter, LayoutGrid, Layers, Calendar, Check } from "lucide-react";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { useTheme } from "@/contexts/ThemeContext";
import { useIsMobile } from "@/hooks/useIsMobile";
import type { PositionEnum, StatsFilters } from "@/types/stats";
import { useStore } from "zustand";
import { userStore } from "@/store/userStore";
import { DayNight } from "@/types/equipment";

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

// helpers
const arrOrNull = <T,>(a: T[] | null | undefined) => (a && a.length ? a : null);
const validPositions: PositionEnum[] = ["Sitting", "Standing", "Lying", "Operational"];

function sanitize(filters: StatsFilters, meId?: string | null): StatsFilters {
  if (meId) {
    filters.userId = meId;
  }

  const dayNight = arrOrNull(filters.dayNight?.map((d) => (d || "").toLowerCase() as DayNight));
  const positions = arrOrNull((filters.positions ?? []).filter((p): p is PositionEnum => validPositions.includes(p as PositionEnum)));

  // Scope logic: if userId is set → force squadIds=null (self mode). If no userId and no squadIds, leave as-is (up to caller).
  const userId = filters.userId ?? null;
  const squadIds = userId ? null : arrOrNull(filters.squadIds);

  // Dates: keep as ISO or null; do not coerce
  const startDate = filters.startDate ?? null;
  const endDate = filters.endDate ?? null;

  // MinShots removed as requested
  return { squadIds, userId, startDate, endDate, dayNight, positions, minShots: null };
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
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: filters.startDate ? new Date(filters.startDate).toISOString().split("T")[0] : "",
    end: filters.endDate ? new Date(filters.endDate).toISOString().split("T")[0] : "",
  });

  useEffect(() => {
    setLocalFilters(filters);
    setDateRange({
      start: filters.startDate ? new Date(filters.startDate).toISOString().split("T")[0] : "",
      end: filters.endDate ? new Date(filters.endDate).toISOString().split("T")[0] : "",
    });
  }, [filters]);

  const handleApply = () => {
    const next = sanitize(localFilters, user?.id);
    onFiltersChange(next);
    onApply();
    onClose();
  };

  const handleClear = () => {
    const cleared: StatsFilters = {
      squadIds: null,
      userId: null,
      startDate: null,
      endDate: null,
      dayNight: null,
      positions: null,
      minShots: null,
    };
    setLocalFilters(cleared);
    setDateRange({ start: "", end: "" });
    onFiltersChange(cleared);
    onClear();
  };

  const togglePosition = (position: PositionEnum) => {
    const currentPositions = localFilters.positions || [];
    const newPositions = currentPositions.includes(position)
      ? currentPositions.filter((p) => p !== position)
      : [...currentPositions, position];
    
    setLocalFilters({
      ...localFilters,
      positions: newPositions.length > 0 ? newPositions : null,
    });
  };

  const toggleDayNight = (value: DayNight) => {
    const current = localFilters.dayNight || [];
    const newDayNight = current.includes(value)
      ? current.filter((d) => d !== value)
      : [...current, value];
    
    setLocalFilters({
      ...localFilters,
      dayNight: newDayNight.length > 0 ? newDayNight : null,
    });
  };

  const handleDateRangeChange = (type: "start" | "end", value: string) => {
    const newRange = { ...dateRange, [type]: value };
    setDateRange(newRange);
    
    // Update filters
    if (type === "start") {
      setLocalFilters({
        ...localFilters,
        startDate: value ? new Date(value).toISOString() : null,
      });
    } else {
      setLocalFilters({
        ...localFilters,
        endDate: value ? new Date(value).toISOString() : null,
      });
    }
  };

  // Get today's date in YYYY-MM-DD format for max date
  const today = new Date().toISOString().split("T")[0];

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity z-40 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed z-50 transition-transform duration-300 ${
          isMobile
            ? `bottom-0 left-0 right-0 ${isOpen ? "translate-y-0" : "translate-y-full"}`
            : `top-0 right-0 bottom-0 ${isOpen ? "translate-x-0" : "translate-x-full"}`
        }`}
      >
        <div
          className={`${theme === "dark" ? "bg-gradient-to-b from-zinc-900 to-zinc-950" : "bg-white"} ${
            isMobile
              ? `rounded-t-2xl border-t ${theme === "dark" ? "border-zinc-800" : "border-gray-200"}`
              : `h-full border-l ${theme === "dark" ? "border-zinc-800" : "border-gray-200"}`
          } shadow-2xl ${!isMobile ? "w-[400px] relative" : ""}`}
        >
          {/* Handle (mobile) */}
          {isMobile && (
            <div className="flex justify-center pt-2">
              <div className={`w-12 h-1.5 rounded-full ${theme === "dark" ? "bg-zinc-600" : "bg-gray-300"}`} />
            </div>
          )}

          {/* Header */}
          <div className={`flex items-center justify-between p-4 ${isMobile ? "pb-2" : "pt-6"}`}>
            <div className="flex items-center gap-2">
              <Filter size={18} className="opacity-70" />
              <h3 className="text-base font-semibold">Filters</h3>
            </div>
            <button
              onClick={onClose}
              className={`p-1.5 rounded-lg transition-colors ${
                theme === "dark" ? "hover:bg-zinc-800 text-zinc-400" : "hover:bg-gray-100 text-gray-500"
              }`}
            >
              <X size={18} />
            </button>
          </div>

          {/* Content */}
          <div className={`px-4 pb-4 overflow-y-auto custom-scrollbar ${isMobile ? "max-h-[60vh]" : "h-[calc(100vh-200px)]"}`}>
            {/* Date Range Section */}
            <div className="mb-4">
              <label className="text-xs font-medium opacity-70 mb-2 block">Date Range</label>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <input
                      type="date"
                      value={dateRange.start}
                      max={today}
                      onChange={(e) => handleDateRangeChange("start", e.target.value)}
                      className={`w-full h-9 px-3 rounded-md border text-sm ${
                        theme === "dark"
                          ? "bg-zinc-800/50 border-zinc-700 text-zinc-100 hover:bg-zinc-700/50"
                          : "bg-gray-50 border-gray-300 text-gray-900 hover:bg-gray-100"
                      }`}
                      placeholder="Start date"
                    />
                  </div>
                  <span className={`text-sm ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>to</span>
                  <div className="flex-1">
                    <input
                      type="date"
                      value={dateRange.end}
                      min={dateRange.start}
                      max={today}
                      onChange={(e) => handleDateRangeChange("end", e.target.value)}
                      className={`w-full h-9 px-3 rounded-md border text-sm ${
                        theme === "dark"
                          ? "bg-zinc-800/50 border-zinc-700 text-zinc-100 hover:bg-zinc-700/50"
                          : "bg-gray-50 border-gray-300 text-gray-900 hover:bg-gray-100"
                      }`}
                      placeholder="End date"
                    />
                  </div>
                </div>
                
                {/* Quick Date Presets */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      const todayStr = today.toISOString().split("T")[0];
                      handleDateRangeChange("start", todayStr);
                      handleDateRangeChange("end", todayStr);
                    }}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
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
                      handleDateRangeChange("start", lastWeek.toISOString().split("T")[0]);
                      handleDateRangeChange("end", today.toISOString().split("T")[0]);
                    }}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
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
                      handleDateRangeChange("start", lastMonth.toISOString().split("T")[0]);
                      handleDateRangeChange("end", today.toISOString().split("T")[0]);
                    }}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                      theme === "dark"
                        ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300"
                    }`}
                  >
                    Last 30 days
                  </button>
                </div>
              </div>
            </div>

            {/* Day/Night Filter */}
            <div className={`border-t pt-4 ${theme === "dark" ? "border-zinc-800" : "border-gray-200"}`}>
              <label className="text-xs font-medium opacity-70 mb-2 block">Day/Night</label>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleDayNight("day" as DayNight)}
                  className={`flex-1 px-3 py-2 rounded-md border text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                    localFilters.dayNight?.includes("day" as DayNight)
                      ? theme === "dark"
                        ? "bg-zinc-700/50 border-zinc-600 text-zinc-100"
                        : "bg-blue-50 border-blue-300 text-blue-700"
                      : theme === "dark"
                        ? "bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700/50 text-zinc-400"
                        : "bg-gray-50 border-gray-300 hover:bg-gray-100 text-gray-600"
                  }`}
                >
                  {localFilters.dayNight?.includes("day" as DayNight) && <Check size={14} />}
                  Day
                </button>
                <button
                  onClick={() => toggleDayNight("night" as DayNight)}
                  className={`flex-1 px-3 py-2 rounded-md border text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                    localFilters.dayNight?.includes("night" as DayNight)
                      ? theme === "dark"
                        ? "bg-zinc-700/50 border-zinc-600 text-zinc-100"
                        : "bg-blue-50 border-blue-300 text-blue-700"
                      : theme === "dark"
                        ? "bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700/50 text-zinc-400"
                        : "bg-gray-50 border-gray-300 hover:bg-gray-100 text-gray-600"
                  }`}
                >
                  {localFilters.dayNight?.includes("night" as DayNight) && <Check size={14} />}
                  Night
                </button>
              </div>
            </div>

            {/* Position Filter - Multi-select */}
            <div className={`border-t pt-4 mt-4 ${theme === "dark" ? "border-zinc-800" : "border-gray-200"}`}>
              <label className="text-xs font-medium opacity-70 mb-2 block">Positions</label>
              <div className="grid grid-cols-2 gap-2">
                {validPositions.map((position) => (
                  <button
                    key={position}
                    onClick={() => togglePosition(position)}
                    className={`px-3 py-2 rounded-md border text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                      localFilters.positions?.includes(position)
                        ? theme === "dark"
                          ? "bg-zinc-700/50 border-zinc-600 text-zinc-100"
                          : "bg-blue-50 border-blue-300 text-blue-700"
                        : theme === "dark"
                          ? "bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700/50 text-zinc-400"
                          : "bg-gray-50 border-gray-300 hover:bg-gray-100 text-gray-600"
                    }`}
                  >
                    {localFilters.positions?.includes(position) && <Check size={14} />}
                    {position}
                  </button>
                ))}
              </div>
            </div>

            {/* View Mode / Auto-load */}
            {(onViewModeChange || onAutoLoadChange) && (
              <div className={`border-t pt-4 mt-4 ${theme === "dark" ? "border-zinc-800" : "border-gray-200"}`}>
                {onViewModeChange && (
                  <div className="mb-3">
                    <label className="text-xs font-medium opacity-70 mb-2 block">View Mode</label>
                    <div
                      className={`flex rounded-lg p-1 ${
                        theme === "dark" ? "bg-zinc-800/50 border border-zinc-700" : "bg-gray-100 border border-gray-300"
                      }`}
                    >
                      <button
                        onClick={() => onViewModeChange!("grid")}
                        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded transition-all ${
                          viewMode === "grid"
                            ? theme === "dark"
                              ? "bg-zinc-700 text-white"
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
                        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded transition-all ${
                          viewMode === "stack"
                            ? theme === "dark"
                              ? "bg-zinc-700 text-white"
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
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoLoadStackView || false}
                      onChange={(e) => onAutoLoadChange!(e.target.checked)}
                      className={`w-4 h-4 rounded ${theme === "dark" ? "accent-blue-500" : "accent-blue-600"}`}
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium">Auto-disable stack view with filters</div>
                      <div className="text-xs opacity-60 mt-0.5">When filters are active, automatically switch to grid view</div>
                    </div>
                  </label>
                )}
              </div>
            )}

            {/* Active Filters Summary - Improved mobile layout */}
            {(localFilters.dayNight ||
              localFilters.positions ||
              localFilters.userId ||
              localFilters.startDate ||
              localFilters.endDate) && (
              <div className={`border-t pt-3 mt-4 ${theme === "dark" ? "border-zinc-800" : "border-gray-200"}`}>
                <div className="text-xs font-medium opacity-70 mb-2">Active Filters:</div>
                <div className={`${isMobile ? "max-h-20 overflow-y-auto" : ""}`}>
                  <div className="flex flex-wrap gap-1.5">
                    {localFilters.dayNight && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${theme === "dark" ? "bg-blue-600/20 text-blue-300" : "bg-blue-100 text-blue-700"}`}
                      >
                        {localFilters.dayNight.join(" + ")}
                      </span>
                    )}
                    {localFilters.positions && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${theme === "dark" ? "bg-green-600/20 text-green-300" : "bg-green-100 text-green-700"}`}
                      >
                        {localFilters.positions.length === 1 ? localFilters.positions[0] : `${localFilters.positions.length} positions`}
                      </span>
                    )}
                    {localFilters.userId && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${theme === "dark" ? "bg-orange-600/20 text-orange-300" : "bg-orange-100 text-orange-700"}`}
                      >
                        My sessions
                      </span>
                    )}
                    {(localFilters.startDate || localFilters.endDate) && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${theme === "dark" ? "bg-indigo-600/20 text-indigo-300" : "bg-indigo-100 text-indigo-700"}`}
                      >
                        {localFilters.startDate && localFilters.endDate
                          ? `${new Date(localFilters.startDate).toLocaleDateString()} - ${new Date(localFilters.endDate).toLocaleDateString()}`
                          : localFilters.startDate
                            ? `From ${new Date(localFilters.startDate).toLocaleDateString()}`
                            : `Until ${new Date(localFilters.endDate!).toLocaleDateString()}`}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div
            className={`flex gap-3 p-4 border-t ${theme === "dark" ? "border-zinc-800" : "border-gray-200"} ${
              !isMobile ? `absolute bottom-0 left-0 right-0 ${theme === "dark" ? "bg-zinc-950" : "bg-white"}` : ""
            }`}
          >
            <button
              onClick={handleClear}
              className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                theme === "dark" ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-300" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              Clear All
            </button>
            <button
              onClick={handleApply}
              className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                theme === "dark"
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </>
  );
}