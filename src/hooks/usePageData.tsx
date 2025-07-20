import { useEffect, useState, useCallback } from "react";
import { useStore } from "zustand";
import { loaderStore } from "@/store/loaderStore";

interface UsePageDataOptions<T> {
  loadData: () => Promise<T>;
  dependencies?: any[];
  initialData?: T;
  setGlobalLoading?: boolean;
}

export function usePageData<T>({
  loadData,
  dependencies = [],
  initialData,
  setGlobalLoading = true,
}: UsePageDataOptions<T>) {
  const { setIsLoading } = useStore(loaderStore);
  const [data, setData] = useState<T | undefined>(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      if (setGlobalLoading) setIsLoading(true);
      
      const result = await loadData();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setLoading(false);
      if (setGlobalLoading) setIsLoading(false);
    }
  }, [loadData, setIsLoading, setGlobalLoading]);

  useEffect(() => {
    fetchData();
  }, dependencies);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}