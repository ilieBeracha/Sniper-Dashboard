import { useState, useEffect, useMemo } from "react";

interface UseTableLogicProps<T> {
  loadData: (limit: number, offset: number) => Promise<T[]>;
  getTotalCount: () => Promise<number>;
  limit?: number;
  dependencies?: any[];
  filterConfigs?: FilterConfig<T>[];
}

interface FilterConfig<T> {
  key: keyof T;
  label: string;
  type: "select";
  formatOption?: (value: any) => string;
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

  const loadPage = async (page: number = 0, reset: boolean = false) => {
    setIsLoading(true);
    try {
      const offset = page * limit;
      const result = await loadData(limit, offset);

      if (reset) {
        setData(result);
      } else {
        setData((prev) => [...prev, ...result]);
      }

      setHasMore(result.length === limit);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error loading page:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadInitialData = async () => {
    await loadPage(0, true);
    try {
      const count = await getTotalCount();
      setTotalCount(count);
    } catch (error) {
      console.error("Error loading total count:", error);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, dependencies);

  const nextPage = () => {
    if (hasMore && !isLoading) {
      loadPage(currentPage + 1, true);
    }
  };

  const prevPage = () => {
    if (currentPage > 0 && !isLoading) {
      loadPage(currentPage - 1, true);
    }
  };

  const refreshData = () => {
    loadPage(0, true);
  };

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
      const uniqueValues = data
        .map((item) => item[config.key])
        .filter(Boolean)
        .filter((value, index, self) => self.indexOf(value) === index);

      return {
        key: config.key as string,
        label: config.label,
        type: config.type,
        options: uniqueValues.map((value) => ({
          value: String(value),
          label: config.formatOption ? config.formatOption(value) : String(value),
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

export type { FilterConfig };
