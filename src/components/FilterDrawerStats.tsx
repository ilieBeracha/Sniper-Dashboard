import { useState, useEffect } from "react";
import { X, Filter, LayoutGrid, Layers } from "lucide-react";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { useTheme } from "@/contexts/ThemeContext";
import { useIsMobile } from "@/hooks/useIsMobile";
import type { PositionEnum, StatsFilters } from "@/types/stats";
import { DayNight } from "@/types/equipment";

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: StatsFilters; // { squadIds | userId | startDate | endDate | dayNight | positions | minShots }
  onFiltersChange: (filters: StatsFilters) => void; // receives canonical StatsFilters
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

function sanitize(filters: StatsFilters): StatsFilters {
  const dayNight = arrOrNull(filters.dayNight?.map((d) => (d || "").toLowerCase() as DayNight));
  const positions = arrOrNull((filters.positions ?? []).filter((p): p is PositionEnum => validPositions.includes(p as PositionEnum)));

  // Dates: keep as ISO or null; do not coerce
  const startDate = filters.startDate ?? null;
  const endDate = filters.endDate ?? null;

  return { startDate, endDate, dayNight, positions, squadIds: null };
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

  const [localFilters, setLocalFilters] = useState<StatsFilters>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleApply = () => {
    const next = sanitize(localFilters);
    onFiltersChange(next);
    onApply();
    onClose();
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
              <h3 className="text-base font-semibold">Filters & Sort</h3>
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
            {/* Filters Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {/* Day/Night */}
              <div>
                <label className="text-xs font-medium opacity-70 mb-1 block">Day/Night</label>
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
                    className={`w-full h-9 ${
                      theme === "dark" ? "bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700/50" : "bg-gray-50 border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    <span className="text-sm">{localFilters.dayNight?.join(", ") ?? "All"}</span>
                  </SelectTrigger>
                  <SelectContent className={theme === "dark" ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"}>
                    <SelectItem value="ALL">All</SelectItem>
                    <SelectItem value="day">Day</SelectItem>
                    <SelectItem value="night">Night</SelectItem>
                    {/* If you want both, keep the composite */}
                    <SelectItem value="day,night">Day + Night</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Positions */}
              <div>
                <label className="text-xs font-medium opacity-70 mb-1 block">Position</label>
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
                    className={`w-full h-9 ${
                      theme === "dark" ? "bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700/50" : "bg-gray-50 border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    <span className="text-sm">{localFilters.positions?.join(", ") ?? "All"}</span>
                  </SelectTrigger>
                  <SelectContent className={theme === "dark" ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"}>
                    <SelectItem value="ALL">All</SelectItem>
                    <SelectItem value="Sitting">Sitting</SelectItem>
                    <SelectItem value="Standing">Standing</SelectItem>
                    <SelectItem value="Lying">Lying</SelectItem>
                    <SelectItem value="Operational">Operational</SelectItem>
                    {/* Optional composites */}
                    <SelectItem value="Sitting,Standing">Sitting + Standing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Scope: My sessions vs All (squadIds external) */}
            </div>

            {/* Date Range Selection */}
            <div className={`border-t pt-3 mt-3 ${theme === "dark" ? "border-zinc-800" : "border-gray-200"}`}>
              <label className="text-xs font-medium opacity-70 mb-2 block">Date Range</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="text-xs opacity-60 mb-1 block">From</label>
                  <input
                    type="date"
                    value={localFilters.startDate ? new Date(localFilters.startDate).toISOString().split("T")[0] : ""}
                    onChange={(e) =>
                      setLocalFilters({
                        ...localFilters,
                        startDate: e.target.value ? new Date(e.target.value).toISOString() : null,
                      })
                    }
                    className={`w-full h-9 px-3 rounded-md border text-sm ${
                      theme === "dark"
                        ? "bg-zinc-800/50 border-zinc-700 text-zinc-100 hover:bg-zinc-700/50"
                        : "bg-gray-50 border-gray-300 text-gray-900 hover:bg-gray-100"
                    }`}
                  />
                </div>
                <div>
                  <label className="text-xs opacity-60 mb-1 block">To</label>
                  <input
                    type="date"
                    value={localFilters.endDate ? new Date(localFilters.endDate).toISOString().split("T")[0] : ""}
                    onChange={(e) =>
                      setLocalFilters({
                        ...localFilters,
                        endDate: e.target.value ? new Date(e.target.value).toISOString() : null,
                      })
                    }
                    className={`w-full h-9 px-3 rounded-md border text-sm ${
                      theme === "dark"
                        ? "bg-zinc-800/50 border-zinc-700 text-zinc-100 hover:bg-zinc-700/50"
                        : "bg-gray-50 border-gray-300 text-gray-900 hover:bg-gray-100"
                    }`}
                  />
                </div>
              </div>
              {/* Quick Date Presets */}
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
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
                    setLocalFilters({
                      ...localFilters,
                      startDate: lastWeek.toISOString(),
                      endDate: today.toISOString(),
                    });
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
                    setLocalFilters({
                      ...localFilters,
                      startDate: lastMonth.toISOString(),
                      endDate: today.toISOString(),
                    });
                  }}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
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
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
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
              <div className={`border-t pt-3 mt-3 ${theme === "dark" ? "border-zinc-800" : "border-gray-200"}`}>
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

            {/* Active Filters Summary */}
            {(localFilters.dayNight || localFilters.positions || localFilters.startDate || localFilters.endDate) && (
              <div className={`border-t pt-3 mt-3 ${theme === "dark" ? "border-zinc-800" : "border-gray-200"}`}>
                <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start">
                  {localFilters.dayNight && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${theme === "dark" ? "bg-blue-600/20 text-blue-300" : "bg-blue-100 text-blue-700"}`}
                    >
                      {localFilters.dayNight.join(", ")}
                    </span>
                  )}
                  {localFilters.positions && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${theme === "dark" ? "bg-green-600/20 text-green-300" : "bg-green-100 text-green-700"}`}
                    >
                      Positions: {localFilters.positions.join(", ")}
                    </span>
                  )}

                  {localFilters.squadIds && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${theme === "dark" ? "bg-orange-600/20 text-orange-300" : "bg-orange-100 text-orange-700"}`}
                    >
                      My sessions
                    </span>
                  )}
                  {localFilters.startDate && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${theme === "dark" ? "bg-indigo-600/20 text-indigo-300" : "bg-indigo-100 text-indigo-700"}`}
                    >
                      Start: {new Date(localFilters.startDate).toLocaleDateString()}
                    </span>
                  )}
                  {localFilters.endDate && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${theme === "dark" ? "bg-indigo-600/20 text-indigo-300" : "bg-indigo-100 text-indigo-700"}`}
                    >
                      End: {new Date(localFilters.endDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div
            className={`flex flex-col sm:flex-row gap-3 p-4 border-t ${theme === "dark" ? "border-zinc-800" : "border-gray-200"} ${
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
