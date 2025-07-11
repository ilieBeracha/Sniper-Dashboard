import { useState, useEffect, useMemo, ReactNode } from "react";
import { ChevronLeft, ChevronRight, Filter, Search, X } from "lucide-react";

import { useIsMobile } from "@/hooks/useIsMobile";
import { useTheme } from "@/contexts/ThemeContext";

export type FilterConfig<T> = {
  key: keyof T;
  label: string;
  type: "select" | "text";
  formatOption?: (value: any) => string;
};

export interface UseTableLogicProps<T> {
  loadData: (limit: number, offset: number) => Promise<T[]>;
  getTotalCount: () => Promise<number>;
  limit?: number;
  dependencies?: any[];
  filterConfigs?: FilterConfig<T>[];
}

export function useTableLogic<T extends { id: string | number }>({
  loadData,
  getTotalCount,
  limit = 20,
  dependencies = [],
  filterConfigs = [],
}: UseTableLogicProps<T>) {
  const [currentPage, setCurrentPage] = useState(0);
  const [data, setData] = useState<T[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [editingItem, setEditingItem] = useState<T | null>(null);
  const [editForm, setEditForm] = useState<Partial<T>>({});

  const loadPage = async (page = 0, reset = false) => {
    setIsLoading(true);
    try {
      const offset = page * limit;
      const result = await loadData(limit, offset);
      setData(reset ? result : [...(reset ? [] : data), ...result]);
      setHasMore(result.length === limit);
      setCurrentPage(page);
    } finally {
      setIsLoading(false);
    }
  };

  const loadInitialData = async () => {
    await loadPage(0, true);
    const count = await getTotalCount();
    setTotalCount(count);
  };

  useEffect(() => {
    loadInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  const nextPage = () => {
    if (hasMore && !isLoading) loadPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 0 && !isLoading) loadPage(currentPage - 1, true);
  };

  const refreshData = () => loadPage(0, true);

  const pagination = {
    currentPage,
    totalPages: Math.ceil(totalCount / limit),
    pageSize: limit,
    totalItems: totalCount,
    onPageChange: (page: number) => loadPage(page, true),
    onNextPage: nextPage,
    onPrevPage: prevPage,
    hasMore,
  };

  const handleEditItem = (item: T) => {
    setEditingItem(item);
    setEditForm(item);
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setEditForm({});
  };

  const handleFormChange = (field: keyof T, value: any) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const isEditing = (item: T) => editingItem?.id === item.id;

  const filters = useMemo(() => {
    return filterConfigs.map((config) => {
      const values = Array.from(
        new Set(
          data
            .map((item) => item[config.key])
            .filter((v) => v !== null && v !== undefined)
            .map((v) => String(v)),
        ),
      );
      return {
        key: String(config.key),
        label: config.label,
        type: config.type,
        options: values.map((v) => ({
          value: v,
          label: config.formatOption ? config.formatOption(v) : v,
        })),
      };
    });
  }, [data, filterConfigs]);

  return {
    data,
    setData,
    isLoading,
    pagination,
    refreshData,
    totalCount,
    editingItem,
    editForm,
    handleEditItem,
    handleCancelEdit,
    handleFormChange,
    isEditing,
    setEditingItem,
    setEditForm,
    filters,
  };
}

export type SpTableFilter = {
  key: string;
  label: string;
  type: "select" | "text";
  placeholder?: string;
  options?: { value: string; label: string }[];
  className?: string;
};

export type SpTableColumn<T> = {
  key: keyof T & string;
  label: string;
  width?: number | string;
  className?: string;
  hideOnMobile?: boolean;
  render?: (value: any, row: T) => ReactNode;
};

export interface SpTablePaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onNextPage: () => void;
  onPrevPage: () => void;
  hasMore: boolean;
}

export interface SpTableProps<T extends { id: string | number }> {
  data?: T[];
  pagination?: SpTablePaginationProps;
  loading?: boolean;
  loadData?: (limit: number, offset: number) => Promise<T[]>;
  getTotalCount?: () => Promise<number>;
  limit?: number;
  dependencies?: any[];
  filterConfigs?: FilterConfig<T>[];
  columns: SpTableColumn<T>[];
  filters?: SpTableFilter[];
  searchPlaceholder?: string;
  searchFields?: (keyof T & string)[];
  onRowClick?: (row: T) => void;
  onEdit?: (row: T) => void;
  onView?: (row: T) => void;
  onDelete?: (row: T) => void;
  actions?: (row: T) => ReactNode;
  emptyState?: ReactNode;
  className?: string;
  highlightRow?: (row: T) => boolean;
}

export function SpTable<T extends { id: string | number }>(props: SpTableProps<T>) {
  const {
    data: externalData = [],
    pagination: externalPagination,
    loading: externalLoading = false,
    loadData,
    getTotalCount,
    limit = 20,
    dependencies = [],
    filterConfigs = [],
    columns,
    filters: staticFilters = [],
    searchPlaceholder = "Search...",
    searchFields = [],
    onRowClick,
    onEdit,
    onView,
    onDelete,
    actions,
    emptyState,
    className = "",
    highlightRow,
  } = props;

  const { theme } = useTheme();
  const isMobile = useIsMobile();

  const hasInternalLogic = loadData && getTotalCount;
  const internalLogic = hasInternalLogic
    ? useTableLogic<T>({
        loadData: loadData as (l: number, o: number) => Promise<T[]>,
        getTotalCount: getTotalCount as () => Promise<number>,
        limit,
        dependencies,
        filterConfigs,
      })
    : null;

  const data = internalLogic ? internalLogic.data : externalData;
  const loading = internalLogic ? internalLogic.isLoading : externalLoading;
  const pagination = internalLogic ? internalLogic.pagination : externalPagination;
  const autoFilters = internalLogic ? internalLogic.filters : [];
  const filters = autoFilters.length ? autoFilters : staticFilters;

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

  const hasActiveFilters = searchTerm.trim() !== "" || Object.values(filterValues).some(Boolean);

  const filteredData = data.filter((row) => {
    const matchesSearch =
      searchTerm.trim() === "" ||
      (searchFields.length === 0
        ? JSON.stringify(row).toLowerCase().includes(searchTerm.toLowerCase())
        : searchFields.some((field) =>
            String(row[field] ?? "")
              .toLowerCase()
              .includes(searchTerm.toLowerCase()),
          ));
    const matchesFilters = Object.entries(filterValues).every(
      ([key, value]) =>
        value.trim() === "" ||
        String((row as any)[key] ?? "")
          .toLowerCase()
          .trim() === value.toLowerCase().trim(),
    );
    return matchesSearch && matchesFilters;
  });

  return (
    <div className={`space-y-4 w-full ${className}`}>
      <div
        className={`rounded-xl border transition-colors duration-200 ${
          theme === "dark" ? "border-zinc-800 bg-zinc-900/50" : "border-gray-200 bg-white shadow-sm"
        }`}
      >
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
            hasActiveFilters={hasActiveFilters}
            clearFilters={clearFilters}
            isMobile={isMobile}
            theme={theme}
          />
        )}
        <div className="overflow-x-auto">
          <table className={`min-w-full text-sm transition-colors duration-200 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
            <thead
              className={`text-xs uppercase border-b transition-colors duration-200 ${
                theme === "dark" ? "border-zinc-800 bg-zinc-800/50" : "border-gray-200 bg-gray-50"
              }`}
            >
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={`px-4 py-3 ${col.className || ""} ${col.hideOnMobile ? "hidden sm:table-cell" : ""}`}
                    style={col.width ? { width: col.width } : undefined}
                  >
                    {col.label}
                  </th>
                ))}
                {(actions || onView || onEdit || onDelete) && <th className="px-4 py-3 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, idx) => {
                const isLast = idx === filteredData.length - 1;
                const highlighted = highlightRow?.(row);
                return (
                  <tr
                    key={row.id}
                    onClick={() => onRowClick?.(row)}
                    className={`transition-colors border-b cursor-pointer ${
                      isLast ? "border-transparent" : theme === "dark" ? "border-zinc-800/50" : "border-gray-100"
                    } ${highlighted ? "bg-gray-100/60 dark:bg-gray-700/30" : theme === "dark" ? "hover:bg-zinc-800/50" : "hover:bg-gray-50"}`}
                  >
                    {columns.map((col) => (
                      <td key={col.key} className={`px-4 py-3 ${col.className || ""} ${col.hideOnMobile ? "hidden sm:table-cell" : ""}`}>
                        {col.render ? col.render(row[col.key], row) : ((row as any)[col.key] ?? "N/A")}
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
        {filteredData.length === 0 && data.length > 0 && (
          <div className={`text-center py-8 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
            <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No items match your current filters</p>
          </div>
        )}
        {filteredData.length === 0 && data.length === 0 && emptyState && <div className="py-8">{emptyState}</div>}
        {pagination && <SpTablePagination pagination={pagination} loading={loading} theme={theme} />}
        {loading && (
          <div className={`text-center py-4 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin border-current" />
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
  setSearchTerm: (v: string) => void;
  filterValues: Record<string, string>;
  onFilterChange: (k: string, v: string) => void;
  filters: SpTableFilter[];
  searchPlaceholder: string;
  showFilters: boolean;
  setShowFilters: (v: boolean) => void;
  hasActiveFilters: boolean;
  clearFilters: () => void;
  isMobile: boolean;
  theme: string;
}) {
  return (
    <div className={`p-4 border-b transition-colors duration-200 ${theme === "dark" ? "border-zinc-800" : "border-gray-200"}`}>
      <div className={`${isMobile ? "" : "space-y-4"}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isMobile ? (
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
                  theme === "dark" ? "bg-zinc-800 text-gray-300 hover:bg-zinc-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Filter className="w-4 h-4" />
                {showFilters ? "Hide" : "Show"} Filters
              </button>
            ) : (
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
        {showFilters && (
          <div className="gap-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
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
            {filters.map((f) => (
              <div key={f.key} className={f.className}>
                {f.type === "select" ? (
                  <select
                    value={filterValues[f.key] || ""}
                    onChange={(e) => onFilterChange(f.key, e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border text-sm transition-colors duration-200 ${
                      theme === "dark"
                        ? "border-zinc-700 bg-zinc-800 text-white focus:border-purple-400"
                        : "border-gray-300 bg-white text-gray-900 focus:border-purple-500"
                    } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                  >
                    <option value="">{f.label}</option>
                    {f.options?.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    placeholder={f.placeholder || f.label}
                    value={filterValues[f.key] || ""}
                    onChange={(e) => onFilterChange(f.key, e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border text-sm transition-colors duration-200 ${
                      theme === "dark"
                        ? "border-zinc-700 bg-zinc-800 text-white placeholder-gray-400 focus:border-purple-400"
                        : "border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-purple-500"
                    } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                  />
                )}
              </div>
            ))}
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
        <div className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>{hasActiveFilters ? "Showing filtered results" : ""}</div>
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
  onView?: (r: any) => void;
  onEdit?: (r: any) => void;
  onDelete?: (r: any) => void;
  actions?: (r: any) => ReactNode;
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

function SpTablePagination({ pagination, loading, theme }: { pagination: SpTablePaginationProps; loading: boolean; theme: string }) {
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
