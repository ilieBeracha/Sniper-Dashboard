import { useTheme } from "@/contexts/ThemeContext";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Search, X, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { ReactNode, useState, useEffect } from "react";

interface SpTableColumn {
  key: string;
  label: string;
  render?: (value: any, row: any) => ReactNode;
  sortable?: boolean;
  width?: string;
  className?: string;
  hideOnMobile?: boolean;
}

interface SpTableFilter {
  key: string;
  label: string;
  type: "text" | "select";
  options?: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
}

interface SpTableProps {
  data: any[];
  columns: SpTableColumn[];
  filters?: SpTableFilter[];
  searchPlaceholder?: string;
  searchFields?: string[];
  onRowClick?: (row: any) => void;
  onEdit?: (row: any) => void;
  onView?: (row: any) => void;
  onDelete?: (row: any) => void;
  actions?: (row: any) => ReactNode;
  emptyState?: ReactNode;
  loading?: boolean;
  pagination?: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    onNextPage: () => void;
    onPrevPage: () => void;
    hasMore: boolean;
  };
  className?: string;
  highlightRow?: (row: any) => boolean;
}

export function SpTable({
  data,
  columns,
  filters = [],
  searchPlaceholder = "Search...",
  searchFields = [],
  onRowClick,
  onEdit,
  onView,
  onDelete,
  actions,
  emptyState,
  loading = false,
  pagination,
  className = "",
  highlightRow,
}: SpTableProps) {
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [showFilters, setShowFilters] = useState(!isMobile);

  useEffect(() => {
    setShowFilters(!isMobile);
  }, [isMobile]);

  const handleFilterChange = (key: string, value: string) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterValues({});
  };

  const hasActiveFilters = searchTerm || Object.values(filterValues).some(Boolean);

  const filteredData = data.filter((row) => {
    // Search filter
    const matchesSearch =
      !searchTerm ||
      searchFields.some((field) =>
        String(row[field] || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()),
      );

    // Custom filters
    const matchesFilters = Object.entries(filterValues).every(([key, value]) => {
      if (!value) return true;
      return String(row[key] || "").toLowerCase() === value.toLowerCase();
    });

    return matchesSearch && matchesFilters;
  });

  return (
    <div className={`space-y-4 w-full ${className}`}>
      <div
        className={`rounded-xl border transition-colors duration-200 ${
          theme === "dark" ? "border-zinc-800 bg-zinc-900/50" : "border-gray-200 bg-white shadow-sm"
        }`}
      >
        {/* Filters Section */}
        {(filters.length > 0 || searchFields.length > 0) && (
          <SpTableFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterValues={filterValues}
            onFilterChange={handleFilterChange}
            filters={filters}
            searchPlaceholder={searchPlaceholder}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            hasActiveFilters={hasActiveFilters as boolean}
            clearFilters={clearFilters}
            isMobile={isMobile}
            theme={theme}
          />
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className={`min-w-full text-sm transition-colors duration-200 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
            <thead
              className={`text-xs uppercase border-b transition-colors duration-200 ${
                theme === "dark" ? "border-zinc-800 bg-zinc-800/50" : "border-gray-200 bg-gray-50"
              }`}
            >
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={`px-4 py-3 ${column.className || ""} ${column.hideOnMobile ? "hidden sm:table-cell" : ""}`}
                    style={column.width ? { width: column.width } : undefined}
                  >
                    {column.label}
                  </th>
                ))}
                {(actions || onView || onEdit || onDelete) && <th className="px-4 py-3 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, index) => {
                const isLastRow = index === filteredData.length - 1;
                const isHighlighted = highlightRow?.(row);

                return (
                  <tr
                    key={row.id || index}
                    onClick={() => onRowClick?.(row)}
                    className={`transition-colors border-b cursor-pointer ${
                      isLastRow ? "border-transparent" : theme === "dark" ? "border-zinc-800/50" : "border-gray-100"
                    } ${isHighlighted ? "bg-gray-100/60 dark:bg-gray-700/30" : theme === "dark" ? "hover:bg-zinc-800/50" : "hover:bg-gray-50"}`}
                  >
                    {columns.map((column) => (
                      <td key={column.key} className={`px-4 py-3 ${column.className || ""} ${column.hideOnMobile ? "hidden sm:table-cell" : ""}`}>
                        {column.render ? column.render(row[column.key], row) : row[column.key] || "N/A"}
                      </td>
                    ))}
                    {(actions || onView || onEdit || onDelete) && (
                      <td className="px-4 py-3 text-right">
                        <SpTableActions row={row} onView={onView} onEdit={onEdit} onDelete={onDelete} actions={actions} theme={theme} />
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredData.length === 0 && data.length > 0 && (
          <div className={`text-center py-8 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
            <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No items match your current filters</p>
          </div>
        )}

        {filteredData.length === 0 && data.length === 0 && emptyState && <div className="py-8">{emptyState}</div>}

        {/* Pagination */}
        {pagination && <SpTablePagination pagination={pagination} loading={loading} theme={theme} />}

        {/* Loading State */}
        {loading && (
          <div className={`text-center py-4 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin border-current"></div>
              <span className="text-sm">Loading...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SpTableFilters({
  searchTerm,
  setSearchTerm,
  filterValues,
  onFilterChange,
  filters,
  searchPlaceholder,
  showFilters,
  setShowFilters,
  hasActiveFilters,
  clearFilters,
  isMobile,
  theme,
}: {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filterValues: Record<string, string>;
  onFilterChange: (key: string, value: string) => void;
  filters: SpTableFilter[];
  searchPlaceholder: string;
  showFilters: boolean;
  setShowFilters: (value: boolean) => void;
  hasActiveFilters: boolean;
  clearFilters: () => void;
  isMobile: boolean;
  theme: string;
}) {
  return (
    <div className={`p-4 border-b transition-colors duration-200 ${theme === "dark" ? "border-zinc-800" : "border-gray-200"}`}>
      <div className="space-y-4">
        {/* Filter Toggle */}
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
                {[searchTerm, ...Object.values(filterValues)].filter(Boolean).length}
              </span>
            )}
          </div>
        </div>

        {/* Filter Controls */}
        {showFilters && (
          <div className="gap-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
            {/* Search */}
            <div className="relative sm:col-span-2 lg:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-1.5 rounded-lg border transition-colors duration-200 text-sm ${
                  theme === "dark"
                    ? "border-zinc-700 bg-zinc-800 text-white placeholder-gray-400 focus:border-purple-400"
                    : "border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-purple-500"
                } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
              />
            </div>

            {/* Custom Filters */}
            {filters.map((filter) => (
              <div key={filter.key} className={filter.className}>
                {filter.type === "select" ? (
                  <select
                    value={filterValues[filter.key] || ""}
                    onChange={(e) => onFilterChange(filter.key, e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border text-sm transition-colors duration-200 ${
                      theme === "dark"
                        ? "border-zinc-700 bg-zinc-800 text-white focus:border-purple-400"
                        : "border-gray-300 bg-white text-gray-900 focus:border-purple-500"
                    } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                  >
                    <option value="">{filter.label}</option>
                    {filter.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    placeholder={filter.placeholder || filter.label}
                    value={filterValues[filter.key] || ""}
                    onChange={(e) => onFilterChange(filter.key, e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border text-sm transition-colors duration-200 ${
                      theme === "dark"
                        ? "border-zinc-700 bg-zinc-800 text-white placeholder-gray-400 focus:border-purple-400"
                        : "border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-purple-500"
                    } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                  />
                )}
              </div>
            ))}

            {/* Clear Filters */}
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

        {/* Results Count */}
        <div className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
          {hasActiveFilters ? `Showing filtered results` : `Showing all items`}
        </div>
      </div>
    </div>
  );
}

function SpTableActions({
  row,
  onView,
  onEdit,
  onDelete,
  actions,
  theme,
}: {
  row: any;
  onView?: (row: any) => void;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  actions?: (row: any) => ReactNode;
  theme: string;
}) {
  return (
    <div className="inline-flex gap-2">
      {actions ? (
        actions(row)
      ) : (
        <>
          {onView && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onView(row);
              }}
              className={`p-2 rounded hover:bg-indigo-100 dark:hover:bg-indigo-800/40 ${theme === "dark" ? "text-indigo-400" : "text-indigo-600"}`}
              title="View"
            >
              <Search size={16} />
            </button>
          )}
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(row);
              }}
              className={`p-2 rounded hover:bg-amber-100 dark:hover:bg-amber-800/40 ${theme === "dark" ? "text-amber-400" : "text-amber-600"}`}
              title="Edit"
            >
              <Search size={16} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(row);
              }}
              className={`p-2 rounded hover:bg-red-100 dark:hover:bg-red-800/40 ${theme === "dark" ? "text-red-400" : "text-red-600"}`}
              title="Delete"
            >
              <X size={16} />
            </button>
          )}
        </>
      )}
    </div>
  );
}

function SpTablePagination({ pagination, loading, theme }: { pagination: SpTableProps["pagination"]; loading: boolean; theme: string }) {
  if (!pagination) return null;

  return (
    <div
      className={`flex items-center justify-between p-4 border-t transition-colors duration-200 ${
        theme === "dark" ? "border-zinc-800" : "border-gray-200"
      }`}
    >
      <div className={`text-xs sm:text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
        <span className="hidden sm:inline">
          Page {pagination.currentPage + 1} of {pagination.totalPages} •{" "}
        </span>
        <span className="sm:hidden">Page {pagination.currentPage + 1} • </span>
        {pagination.pageSize} per page
        {pagination.totalItems > 0 && <span className="hidden md:inline"> • {pagination.totalItems} total items</span>}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={pagination.onPrevPage}
          disabled={pagination.currentPage === 0 || loading}
          className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
            pagination.currentPage === 0 || loading
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
          onClick={pagination.onNextPage}
          disabled={!pagination.hasMore || loading}
          className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
            !pagination.hasMore || loading
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
  );
}
