import { useState, useEffect } from "react";
import { X, Filter, Calendar, ChevronDown } from "lucide-react";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { useTheme } from "@/contexts/ThemeContext";
import { useIsMobile } from "@/hooks/useIsMobile";
import type { PositionEnum, StatsFilters } from "@/types/stats";
import { DayNight } from "@/types/equipment";

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: StatsFilters;
  onFiltersChange: (filters: StatsFilters) => void;
  onApply: () => void;
  onClear: () => void;
}

const arrOrNull = <T,>(a: T[] | null | undefined) => (a && a.length ? a : null);
const validPositions: PositionEnum[] = ["Sitting", "Standing", "Lying", "Operational"];

function sanitize(filters: StatsFilters): StatsFilters {
  const dayNight = arrOrNull(filters.dayNight?.map((d) => (d || "").toLowerCase() as DayNight));
  const positions = arrOrNull((filters.positions ?? []).filter((p): p is PositionEnum => validPositions.includes(p as PositionEnum)));
  
  const startDate = filters.startDate ?? null;
  const endDate = filters.endDate ?? null;
  
  return { startDate, endDate, dayNight, positions, squadIds: null };
}

export default function FilterDrawerStats({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  onApply,
  onClear,
}: FilterDrawerProps) {
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  
  const [localFilters, setLocalFilters] = useState<StatsFilters>(filters);
  
  // Get today's date in YYYY-MM-DD format for max date constraint
  const today = new Date().toISOString().split('T')[0];
  
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
    const cleared: StatsFilters = {
      squadIds: null,
      startDate: null,
      endDate: null,
      dayNight: null,
      positions: null,
    };
    setLocalFilters(cleared);
    onFiltersChange(cleared);
    onClear();
    onClose();
  };

  const handleDateRangeChange = (start: string | null, end: string | null) => {
    setLocalFilters({
      ...localFilters,
      startDate: start ? new Date(start).toISOString() : null,
      endDate: end ? new Date(end).toISOString() : null,
    });
  };

  const setPresetDateRange = (days: number | 'today' | 'year') => {
    const now = new Date();
    now.setHours(23, 59, 59, 999);
    
    let start: Date;
    if (days === 'today') {
      start = new Date();
      start.setHours(0, 0, 0, 0);
    } else if (days === 'year') {
      start = new Date(now.getFullYear(), 0, 1);
    } else {
      start = new Date();
      start.setDate(start.getDate() - days);
      start.setHours(0, 0, 0, 0);
    }
    
    setLocalFilters({
      ...localFilters,
      startDate: start.toISOString(),
      endDate: now.toISOString(),
    });
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity z-40 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
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
          className={`${theme === "dark" ? "bg-zinc-900" : "bg-white"} ${
            isMobile
              ? `rounded-t-xl border-t ${theme === "dark" ? "border-zinc-800" : "border-gray-200"} max-h-[85vh]`
              : `h-full border-l ${theme === "dark" ? "border-zinc-800" : "border-gray-200"}`
          } shadow-xl ${!isMobile ? "w-[380px]" : ""}`}
        >
          {/* Handle (mobile) */}
          {isMobile && (
            <div className="flex justify-center pt-2 pb-1">
              <div className={`w-10 h-1 rounded-full ${theme === "dark" ? "bg-zinc-600" : "bg-gray-300"}`} />
            </div>
          )}

          {/* Header */}
          <div className={`flex items-center justify-between px-4 ${isMobile ? "py-3" : "py-4"} border-b ${
            theme === "dark" ? "border-zinc-800" : "border-gray-200"
          }`}>
            <div className="flex items-center gap-2">
              <Filter className={`w-4 h-4 ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`} />
              <h3 className={`text-sm font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                Filters
              </h3>
            </div>
            <button
              onClick={onClose}
              className={`p-1.5 rounded-lg transition-colors ${
                theme === "dark" ? "hover:bg-zinc-800 text-zinc-400" : "hover:bg-gray-100 text-gray-500"
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <div className={`overflow-y-auto ${isMobile ? "max-h-[calc(85vh-120px)]" : "h-[calc(100%-120px)]"}`}>
            <div className="p-4 space-y-4">
              {/* Date Range Section */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className={`w-3.5 h-3.5 ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`} />
                  <label className={`text-xs font-medium ${theme === "dark" ? "text-zinc-300" : "text-gray-700"}`}>
                    Date Range
                  </label>
                </div>
                
                {/* Combined Date Range Input */}
                <div className={`relative rounded-lg border ${
                  theme === "dark" ? "bg-zinc-800/50 border-zinc-700" : "bg-gray-50 border-gray-300"
                }`}>
                  <div className="flex items-center">
                    <input
                      type="date"
                      value={localFilters.startDate ? new Date(localFilters.startDate).toISOString().split("T")[0] : ""}
                      onChange={(e) => handleDateRangeChange(e.target.value, localFilters.endDate ? new Date(localFilters.endDate).toISOString().split("T")[0] : null)}
                      max={today}
                      placeholder="Start date"
                      className={`flex-1 h-9 px-3 bg-transparent border-0 text-sm focus:outline-none ${
                        theme === "dark" ? "text-zinc-100 placeholder-zinc-500" : "text-gray-900 placeholder-gray-500"
                      }`}
                    />
                    <span className={`px-2 text-xs ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>to</span>
                    <input
                      type="date"
                      value={localFilters.endDate ? new Date(localFilters.endDate).toISOString().split("T")[0] : ""}
                      onChange={(e) => handleDateRangeChange(localFilters.startDate ? new Date(localFilters.startDate).toISOString().split("T")[0] : null, e.target.value)}
                      min={localFilters.startDate ? new Date(localFilters.startDate).toISOString().split("T")[0] : undefined}
                      max={today}
                      placeholder="End date"
                      className={`flex-1 h-9 px-3 bg-transparent border-0 text-sm focus:outline-none ${
                        theme === "dark" ? "text-zinc-100 placeholder-zinc-500" : "text-gray-900 placeholder-gray-500"
                      }`}
                    />
                  </div>
                </div>

                {/* Quick Date Presets */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <button
                    onClick={() => setPresetDateRange('today')}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                      theme === "dark"
                        ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }`}
                  >
                    Today
                  </button>
                  <button
                    onClick={() => setPresetDateRange(7)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                      theme === "dark"
                        ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }`}
                  >
                    7 days
                  </button>
                  <button
                    onClick={() => setPresetDateRange(30)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                      theme === "dark"
                        ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }`}
                  >
                    30 days
                  </button>
                  <button
                    onClick={() => setPresetDateRange('year')}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                      theme === "dark"
                        ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }`}
                  >
                    Year
                  </button>
                </div>
              </div>

              {/* Other Filters */}
              <div className="grid grid-cols-2 gap-3">
                {/* Day/Night Filter */}
                <div>
                  <label className={`text-xs font-medium mb-1.5 block ${
                    theme === "dark" ? "text-zinc-300" : "text-gray-700"
                  }`}>
                    Time of Day
                  </label>
                  <Select
                    value={
                      !localFilters.dayNight || localFilters.dayNight.length === 0
                        ? "all"
                        : localFilters.dayNight.length === 2
                          ? "both"
                          : localFilters.dayNight[0]
                    }
                    onValueChange={(v) =>
                      setLocalFilters({
                        ...localFilters,
                        dayNight: v === "all" ? null : v === "both" ? ["day", "night"] as DayNight[] : [v as DayNight],
                      })
                    }
                  >
                    <SelectTrigger className={`w-full h-8 text-xs ${
                      theme === "dark" 
                        ? "bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700/50" 
                        : "bg-gray-50 border-gray-300 hover:bg-gray-100"
                    }`}>
                      <span>{
                        !localFilters.dayNight || localFilters.dayNight.length === 0
                          ? "All"
                          : localFilters.dayNight.length === 2
                            ? "Day & Night"
                            : localFilters.dayNight[0] === "day" ? "Day" : "Night"
                      }</span>
                    </SelectTrigger>
                    <SelectContent className={theme === "dark" ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"}>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="day">Day Only</SelectItem>
                      <SelectItem value="night">Night Only</SelectItem>
                      <SelectItem value="both">Day & Night</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Position Filter */}
                <div>
                  <label className={`text-xs font-medium mb-1.5 block ${
                    theme === "dark" ? "text-zinc-300" : "text-gray-700"
                  }`}>
                    Position
                  </label>
                  <Select
                    value={!localFilters.positions || localFilters.positions.length === 0 ? "all" : localFilters.positions[0]}
                    onValueChange={(v) =>
                      setLocalFilters({
                        ...localFilters,
                        positions: v === "all" ? null : [v as PositionEnum],
                      })
                    }
                  >
                    <SelectTrigger className={`w-full h-8 text-xs ${
                      theme === "dark" 
                        ? "bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700/50" 
                        : "bg-gray-50 border-gray-300 hover:bg-gray-100"
                    }`}>
                      <span>{
                        !localFilters.positions || localFilters.positions.length === 0
                          ? "All"
                          : localFilters.positions[0]
                      }</span>
                    </SelectTrigger>
                    <SelectContent className={theme === "dark" ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"}>
                      <SelectItem value="all">All Positions</SelectItem>
                      <SelectItem value="Sitting">Sitting</SelectItem>
                      <SelectItem value="Standing">Standing</SelectItem>
                      <SelectItem value="Lying">Lying</SelectItem>
                      <SelectItem value="Operational">Operational</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Active Filters Summary */}
              {(localFilters.dayNight || localFilters.positions || localFilters.startDate || localFilters.endDate) && (
                <div className={`pt-3 border-t ${theme === "dark" ? "border-zinc-800" : "border-gray-200"}`}>
                  <div className={`text-xs font-medium mb-2 ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>
                    Active Filters
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {localFilters.startDate && localFilters.endDate && (
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md ${
                        theme === "dark" ? "bg-violet-500/20 text-violet-300" : "bg-violet-100 text-violet-700"
                      }`}>
                        <Calendar className="w-3 h-3" />
                        {new Date(localFilters.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        {' - '}
                        {new Date(localFilters.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    )}
                    {localFilters.dayNight && (
                      <span className={`text-xs px-2 py-1 rounded-md ${
                        theme === "dark" ? "bg-blue-500/20 text-blue-300" : "bg-blue-100 text-blue-700"
                      }`}>
                        {localFilters.dayNight.length === 2 ? "Day & Night" : localFilters.dayNight[0]}
                      </span>
                    )}
                    {localFilters.positions && (
                      <span className={`text-xs px-2 py-1 rounded-md ${
                        theme === "dark" ? "bg-green-500/20 text-green-300" : "bg-green-100 text-green-700"
                      }`}>
                        {localFilters.positions[0]}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className={`flex gap-2 p-4 border-t ${
            theme === "dark" ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-200"
          }`}>
            <button
              onClick={handleClear}
              className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                theme === "dark" 
                  ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-300" 
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              Clear All
            </button>
            <button
              onClick={handleApply}
              className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                theme === "dark"
                  ? "bg-violet-600 hover:bg-violet-500 text-white"
                  : "bg-violet-600 hover:bg-violet-700 text-white"
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