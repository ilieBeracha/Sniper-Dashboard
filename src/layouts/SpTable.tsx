import { useState, useEffect, useMemo, ReactNode, useCallback } from "react";
import { ChevronLeft, ChevronRight, Filter, Search, X, Edit, Eye, Trash2, ChevronUp, ChevronDown } from "lucide-react";

import { useIsMobile } from "@/hooks/useIsMobile";
import { useTheme } from "@/contexts/ThemeContext";
import { Checkbox } from "@/components/ui/checkbox";

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
  sortable?: boolean;
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
  selectable?: boolean;
  onSelectionChange?: (selectedIds: Set<string | number>) => void;
  bulkActions?: ReactNode;
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
    selectable = false,
    onSelectionChange,
    bulkActions,
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
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set());
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);

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

  const handleSort = useCallback((key: string) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return prev.direction === "asc" ? { key, direction: "desc" } : null;
      }
      return { key, direction: "asc" };
    });
  }, []);

  const handleSelectAll = useCallback(
    (checked: boolean, currentFilteredData: T[]) => {
      if (checked) {
        const allIds = new Set(currentFilteredData.map((row) => row.id));
        setSelectedRows(allIds);
        onSelectionChange?.(allIds);
      } else {
        setSelectedRows(new Set());
        onSelectionChange?.(new Set());
      }
    },
    [onSelectionChange],
  );

  const handleSelectRow = useCallback(
    (id: string | number, checked: boolean) => {
      const newSelected = new Set(selectedRows);
      if (checked) {
        newSelected.add(id);
      } else {
        newSelected.delete(id);
      }
      setSelectedRows(newSelected);
      onSelectionChange?.(newSelected);
    },
    [selectedRows, onSelectionChange],
  );

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

  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key as keyof T];
      const bVal = b[sortConfig.key as keyof T];

      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  return (
    <div className={`w-full ${className}`}>
      <div
        className={`rounded-xl border transition-colors duration-200 ${
          theme === "dark" ? "border-zinc-800 bg-zinc-900/50" : "border-gray-200 bg-white shadow-sm"
        }`}
      >
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
          selectedCount={selectedRows.size}
          bulkActions={bulkActions}
          selectable={selectable}
        />

        <div className="overflow-x-auto sm:mx-0">
          <table className={`min-w-full text-sm transition-colors duration-200 ${theme === "dark" ? "text-gray-300" : " text-gray-700"}`}>
            <thead
              className={`text-xs uppercase border-b transition-colors duration-200 sticky top-0 z-10 ${
                theme === "dark" ? "border-zinc-800 bg-zinc-900" : "border-gray-200 bg-gray-100"
              }`}
            >
              <tr>
                {selectable && (
                  <th className="px-4 py-3 w-12">
                    <Checkbox
                      checked={selectedRows.size === sortedData.length && sortedData.length > 0}
                      onCheckedChange={(checked) => handleSelectAll(checked as boolean, sortedData)}
                    />
                  </th>
                )}
                {columns.map((col, idx) => (
                  <th
                    key={idx}
                    className={`px-4 py-3 text-left ${col.className || ""} ${col.hideOnMobile ? "hidden sm:table-cell" : ""} ${
                      col.sortable ? "cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800" : ""
                    }`}
                    style={col.width ? { width: col.width } : undefined}
                    onClick={col.sortable ? () => handleSort(col.key) : undefined}
                  >
                    <div className="flex items-center gap-1">
                      {col.label}
                      {col.sortable && (
                        <div className="flex flex-col">
                          <ChevronUp
                            className={`w-3 h-3 -mb-1 ${
                              sortConfig?.key === col.key && sortConfig.direction === "asc"
                                ? theme === "dark"
                                  ? "text-purple-400"
                                  : "text-purple-600"
                                : "text-gray-400"
                            }`}
                          />
                          <ChevronDown
                            className={`w-3 h-3 -mt-1 ${
                              sortConfig?.key === col.key && sortConfig.direction === "desc"
                                ? theme === "dark"
                                  ? "text-purple-400"
                                  : "text-purple-600"
                                : "text-gray-400"
                            }`}
                          />
                        </div>
                      )}
                    </div>
                  </th>
                ))}
                {(actions || onView || onEdit || onDelete) && <th className="px-4 py-3 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {loading && sortedData.length === 0
                ? // Loading skeleton
                  Array.from({ length: 5 }).map((_, idx) => (
                    <tr key={`skeleton-${idx}`} className="animate-pulse">
                      {selectable && (
                        <td className="px-4 py-2 w-12">
                          <div className="w-4 h-4 bg-gray-200 dark:bg-zinc-700 rounded" />
                        </td>
                      )}
                      {columns.map((col, colIdx) => (
                        <td key={colIdx} className={`px-4 py-2 ${col.className || ""} ${col.hideOnMobile ? "hidden sm:table-cell" : ""}`}>
                          <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-full" />
                        </td>
                      ))}
                      {(actions || onView || onEdit || onDelete) && (
                        <td className="px-4 py-2 text-right">
                          <div className="inline-flex gap-2">
                            <div className="w-8 h-8 bg-gray-200 dark:bg-zinc-700 rounded" />
                            <div className="w-8 h-8 bg-gray-200 dark:bg-zinc-700 rounded" />
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                : sortedData.map((row, idx) => {
                    const isLast = idx === sortedData.length - 1;
                    const isSelected = selectedRows.has(row.id);
                    const highlighted = highlightRow?.(row);
                    return (
                      <tr
                        key={row.id}
                        onClick={() => onRowClick?.(row)}
                        className={`transition-colors border-b cursor-pointer ${
                          isLast ? "border-transparent" : theme === "dark" ? "border-zinc-800/50" : "border-gray-100"
                        } ${
                          highlighted
                            ? "bg-purple-50 dark:bg-purple-900/20"
                            : isSelected
                              ? "bg-blue-50 dark:bg-blue-900/20"
                              : theme === "dark"
                                ? "hover:bg-zinc-800/30"
                                : "hover:bg-gray-50"
                        }`}
                      >
                        {selectable && (
                          <td className="px-4 py-2 w-12" onClick={(e) => e.stopPropagation()}>
                            <Checkbox checked={isSelected} onCheckedChange={(checked) => handleSelectRow(row.id, checked as boolean)} />
                          </td>
                        )}
                        {columns.map((col, idx) => (
                          <td key={idx} className={`px-4 py-2 ${col.className || ""} ${col.hideOnMobile ? "hidden sm:table-cell" : ""}`}>
                            {col.render ? col.render(row[col.key as keyof T], row) : ((row as any)[col.key] ?? "N/A")}
                          </td>
                        ))}
                        {(actions || onView || onEdit || onDelete) && (
                          <td className="px-4 py-2 text-right">
                            <SpTableActions row={row} onView={onView} onEdit={onEdit} onDelete={onDelete} actions={actions} theme={theme} />
                          </td>
                        )}
                      </tr>
                    );
                  })}
            </tbody>
          </table>
        </div>
        {sortedData.length === 0 && data.length > 0 && (
          <div className={`text-center py-2 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
            <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No items match your current filters</p>
          </div>
        )}
        {sortedData.length === 0 && data.length === 0 && emptyState && !loading && <div className="py-8">{emptyState}</div>}
        {pagination && <SpTablePagination pagination={pagination} loading={loading} theme={theme} />}
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
  selectedCount,
  bulkActions,
  selectable,
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
  selectedCount?: number;
  bulkActions?: ReactNode;
  selectable?: boolean;
}) {
  return (
    <div
      className={`p-4 border-b transition-colors duration-200 rounded-t-xl bg-zinc-900/50 ${theme === "dark" ? "border-zinc-800" : "border-gray-200 bg-gray-50"}`}
    >
      {selectable && selectedCount && selectedCount > 0 && (
        <div
          className={`mb-4 p-3 rounded-lg flex items-center justify-between ${
            theme === "dark" ? "bg-blue-900/20 border border-blue-800" : "bg-blue-50 border border-blue-200"
          }`}
        >
          <span className={`text-sm font-medium ${theme === "dark" ? "text-blue-300" : "text-blue-700"}`}>
            {selectedCount} item{selectedCount > 1 ? "s" : ""} selected
          </span>
          {bulkActions && <div className="flex gap-2">{bulkActions}</div>}
        </div>
      )}
      <div className={`${isMobile ? "" : "space-y-4"}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isMobile ? (
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-2 py-1 rounded-lg text-sm transition-colors duration-200 ${
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
              <Eye size={16} />
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
              <Edit size={16} />
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
              <Trash2 size={16} />
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
