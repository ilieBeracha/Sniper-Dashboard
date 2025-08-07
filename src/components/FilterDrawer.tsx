import { useState, useEffect } from "react";
import { X, Filter, LayoutGrid, Layers } from "lucide-react";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { useTheme } from "@/contexts/ThemeContext";
import { useIsMobile } from "@/hooks/useIsMobile";

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    filterDay: string;
    filterEffort: string;
    filterDistance: string;
    filterParticipated: boolean;
    sortOrder: string;
  };
  onFiltersChange: (filters: any) => void;
  onApply: () => void;
  onClear: () => void;
  autoLoadStackView?: boolean;
  onAutoLoadChange?: (value: boolean) => void;
  viewMode?: "grid" | "stack";
  onViewModeChange?: (mode: "grid" | "stack") => void;
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
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleApply = () => {
    onFiltersChange(localFilters);
    onApply();
    onClose();
  };

  const handleClear = () => {
    const clearedFilters = {
      filterDay: "all",
      filterEffort: "all",
      filterDistance: "all",
      filterParticipated: false,
      sortOrder: "recent",
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
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
      <div className={`fixed z-50 transition-transform duration-300 ${
        isMobile 
          ? `bottom-0 left-0 right-0 ${isOpen ? "translate-y-0" : "translate-y-full"}`
          : `top-0 right-0 bottom-0 ${isOpen ? "translate-x-0" : "translate-x-full"}`
      }`}>
        <div
          className={`${
            theme === "dark" ? "bg-gradient-to-b from-zinc-900 to-zinc-950" : "bg-white"
          } ${
            isMobile 
              ? `rounded-t-2xl border-t ${theme === "dark" ? "border-zinc-800" : "border-gray-200"}` 
              : `h-full border-l ${theme === "dark" ? "border-zinc-800" : "border-gray-200"}`
          } shadow-2xl ${!isMobile ? 'w-[400px] relative' : ''}`}
        >
          {/* Handle - Only on mobile */}
          {isMobile && (
            <div className="flex justify-center pt-2">
              <div className={`w-12 h-1.5 rounded-full ${theme === "dark" ? "bg-zinc-600" : "bg-gray-300"}`} />
            </div>
          )}

          {/* Header */}
          <div className={`flex items-center justify-between p-4 ${isMobile ? 'pb-2' : 'pt-6'}`}>
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
          <div className={`px-4 pb-4 overflow-y-auto custom-scrollbar ${
            isMobile ? 'max-h-[60vh]' : 'h-[calc(100vh-200px)]'
          }`}>
            {/* Filters Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {/* Day/Night */}
              <div>
                <label className="text-xs font-medium opacity-70 mb-1 block">Day/Night</label>
                <Select value={localFilters.filterDay} onValueChange={(v) => setLocalFilters({ ...localFilters, filterDay: v })}>
                  <SelectTrigger
                    className={`w-full h-9 ${
                      theme === "dark" ? "bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700/50" : "bg-gray-50 border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    <span className="text-sm">{localFilters.filterDay === "all" ? "All" : localFilters.filterDay}</span>
                  </SelectTrigger>
                  <SelectContent className={theme === "dark" ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"}>
                    <SelectItem
                      value="all"
                      className={theme === "dark" ? "focus:bg-zinc-700 focus:text-zinc-100" : "focus:bg-gray-100 focus:text-gray-900"}
                    >
                      All
                    </SelectItem>
                    <SelectItem
                      value="day"
                      className={theme === "dark" ? "focus:bg-zinc-700 focus:text-zinc-100" : "focus:bg-gray-100 focus:text-gray-900"}
                    >
                      Day
                    </SelectItem>
                    <SelectItem
                      value="night"
                      className={theme === "dark" ? "focus:bg-zinc-700 focus:text-zinc-100" : "focus:bg-gray-100 focus:text-gray-900"}
                    >
                      Night
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Effort */}
              <div>
                <label className="text-xs font-medium opacity-70 mb-1 block">Effort</label>
                <Select value={localFilters.filterEffort} onValueChange={(v) => setLocalFilters({ ...localFilters, filterEffort: v })}>
                  <SelectTrigger
                    className={`w-full h-9 ${
                      theme === "dark" ? "bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700/50" : "bg-gray-50 border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    <span className="text-sm">
                      {localFilters.filterEffort === "all" ? "All" : localFilters.filterEffort === "true" ? "Yes" : "No"}
                    </span>
                  </SelectTrigger>
                  <SelectContent className={theme === "dark" ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"}>
                    <SelectItem
                      value="all"
                      className={theme === "dark" ? "focus:bg-zinc-700 focus:text-zinc-100" : "focus:bg-gray-100 focus:text-gray-900"}
                    >
                      All
                    </SelectItem>
                    <SelectItem
                      value="true"
                      className={theme === "dark" ? "focus:bg-zinc-700 focus:text-zinc-100" : "focus:bg-gray-100 focus:text-gray-900"}
                    >
                      Yes
                    </SelectItem>
                    <SelectItem
                      value="false"
                      className={theme === "dark" ? "focus:bg-zinc-700 focus:text-zinc-100" : "focus:bg-gray-100 focus:text-gray-900"}
                    >
                      No
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Distance */}
              <div>
                <label className="text-xs font-medium opacity-70 mb-1 block">Distance</label>
                <Select value={localFilters.filterDistance} onValueChange={(v) => setLocalFilters({ ...localFilters, filterDistance: v })}>
                  <SelectTrigger
                    className={`w-full h-9 ${
                      theme === "dark" ? "bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700/50" : "bg-gray-50 border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    <span className="text-sm">{localFilters.filterDistance === "all" ? "All" : `${localFilters.filterDistance}m`}</span>
                  </SelectTrigger>
                  <SelectContent className={theme === "dark" ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"}>
                    <SelectItem
                      value="all"
                      className={theme === "dark" ? "focus:bg-zinc-700 focus:text-zinc-100" : "focus:bg-gray-100 focus:text-gray-900"}
                    >
                      All
                    </SelectItem>
                    <SelectItem
                      value="0-300"
                      className={theme === "dark" ? "focus:bg-zinc-700 focus:text-zinc-100" : "focus:bg-gray-100 focus:text-gray-900"}
                    >
                      0-300m
                    </SelectItem>
                    <SelectItem
                      value="300-600"
                      className={theme === "dark" ? "focus:bg-zinc-700 focus:text-zinc-100" : "focus:bg-gray-100 focus:text-gray-900"}
                    >
                      300-600m
                    </SelectItem>
                    <SelectItem
                      value="600-900"
                      className={theme === "dark" ? "focus:bg-zinc-700 focus:text-zinc-100" : "focus:bg-gray-100 focus:text-gray-900"}
                    >
                      600-900m
                    </SelectItem>
                    <SelectItem
                      value="900+"
                      className={theme === "dark" ? "focus:bg-zinc-700 focus:text-zinc-100" : "focus:bg-gray-100 focus:text-gray-900"}
                    >
                      900m+
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* My Sessions */}
              <div>
                <label className="text-xs font-medium opacity-70 mb-1 block">Participation</label>
                <button
                  onClick={() =>
                    setLocalFilters({
                      ...localFilters,
                      filterParticipated: !localFilters.filterParticipated,
                    })
                  }
                  className={`w-full h-9 px-3 rounded-md border text-sm font-medium transition-all ${
                    localFilters.filterParticipated
                      ? theme === "dark"
                        ? "bg-zinc-700/50 border-zinc-600 text-zinc-100"
                        : "bg-gray-200 border-gray-400 text-gray-900"
                      : theme === "dark"
                        ? "bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700/50 text-zinc-400"
                        : "bg-gray-50 border-gray-300 hover:bg-gray-100 text-gray-600"
                  }`}
                >
                  {localFilters.filterParticipated ? "My Sessions" : "All Sessions"}
                </button>
              </div>
            </div>

            {/* Sort Order */}
            <div className={`border-t pt-3 mt-3 ${theme === "dark" ? "border-zinc-800" : "border-gray-200"}`}>
              <label className="text-xs font-medium opacity-70 mb-2 block">Sort By</label>
              <Select value={localFilters.sortOrder} onValueChange={(v) => setLocalFilters({ ...localFilters, sortOrder: v })}>
                <SelectTrigger
                  className={`w-full h-10 ${
                    theme === "dark" ? "bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700/50" : "bg-gray-50 border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  <span className="text-sm">{localFilters.sortOrder === "recent" ? "Most Recent" : "Best Sessions"}</span>
                </SelectTrigger>
                <SelectContent className={theme === "dark" ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"}>
                  <SelectItem value="recent" className={theme === "dark" ? "focus:bg-zinc-700 focus:text-zinc-100" : ""}>
                    Most Recent
                  </SelectItem>
                  <SelectItem value="best" className={theme === "dark" ? "focus:bg-zinc-700 focus:text-zinc-100" : ""}>
                    Best Sessions
                  </SelectItem>
                </SelectContent>
              </Select>
              {localFilters.sortOrder === "best" && <p className="text-xs opacity-50 mt-1">Sorted by effort and maximum target distance</p>}
            </div>

            {/* View Mode and Auto-load Settings */}
            {(onViewModeChange || onAutoLoadChange) && (
              <div className={`border-t pt-3 mt-3 ${theme === "dark" ? "border-zinc-800" : "border-gray-200"}`}>
                {/* View Mode Toggle */}
                {onViewModeChange && (
                  <div className="mb-3">
                    <label className="text-xs font-medium opacity-70 mb-2 block">View Mode</label>
                    <div className={`flex rounded-lg p-1 ${theme === 'dark' ? 'bg-zinc-800/50 border border-zinc-700' : 'bg-gray-100 border border-gray-300'}`}>
                      <button
                        onClick={() => onViewModeChange("grid")}
                        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded transition-all ${
                          viewMode === "grid"
                            ? theme === 'dark' 
                              ? 'bg-zinc-700 text-white' 
                              : 'bg-white text-gray-900 shadow-sm'
                            : theme === 'dark'
                              ? 'text-zinc-400 hover:text-zinc-300'
                              : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        <LayoutGrid size={16} />
                        <span className="text-sm font-medium">Grid</span>
                      </button>
                      <button
                        onClick={() => onViewModeChange("stack")}
                        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded transition-all ${
                          viewMode === "stack"
                            ? theme === 'dark' 
                              ? 'bg-zinc-700 text-white' 
                              : 'bg-white text-gray-900 shadow-sm'
                            : theme === 'dark'
                              ? 'text-zinc-400 hover:text-zinc-300'
                              : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        <Layers size={16} />
                        <span className="text-sm font-medium">Stack</span>
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Auto-load Toggle */}
                {onAutoLoadChange && (
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoLoadStackView || false}
                      onChange={(e) => onAutoLoadChange(e.target.checked)}
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
            {(localFilters.filterDay !== "all" ||
              localFilters.filterEffort !== "all" ||
              localFilters.filterDistance !== "all" ||
              localFilters.filterParticipated ||
              localFilters.sortOrder !== "recent") && (
              <div className={`border-t pt-3 mt-3 ${theme === "dark" ? "border-zinc-800" : "border-gray-200"}`}>
                <div className="flex flex-wrap gap-1.5">
                  {localFilters.filterDay !== "all" && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        theme === "dark" ? "bg-blue-600/20 text-blue-300" : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {localFilters.filterDay}
                    </span>
                  )}
                  {localFilters.filterEffort !== "all" && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        theme === "dark" ? "bg-green-600/20 text-green-300" : "bg-green-100 text-green-700"
                      }`}
                    >
                      Effort: {localFilters.filterEffort === "true" ? "Yes" : "No"}
                    </span>
                  )}
                  {localFilters.filterDistance !== "all" && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        theme === "dark" ? "bg-purple-600/20 text-purple-300" : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      {localFilters.filterDistance}m
                    </span>
                  )}
                  {localFilters.filterParticipated && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        theme === "dark" ? "bg-orange-600/20 text-orange-300" : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      My sessions
                    </span>
                  )}
                  {localFilters.sortOrder !== "recent" && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        theme === "dark" ? "bg-indigo-600/20 text-indigo-300" : "bg-indigo-100 text-indigo-700"
                      }`}
                    >
                      Best sessions
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className={`flex gap-3 p-4 border-t ${theme === "dark" ? "border-zinc-800" : "border-gray-200"} ${
            !isMobile ? `absolute bottom-0 left-0 right-0 ${theme === "dark" ? "bg-zinc-950" : "bg-white"}` : ''
          }`}>
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
