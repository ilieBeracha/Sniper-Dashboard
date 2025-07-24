import { useEffect, useCallback } from "react";
import { useStore } from "zustand";
import { loaderStore } from "@/store/loaderStore";

export function useLoadingState(loadFunction: () => Promise<void>, dependencies: any[] = []) {
  const { setIsLoading } = useStore(loaderStore);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      await loadFunction();
    } finally {
      setIsLoading(false);
    }
  }, [loadFunction, setIsLoading]);

  useEffect(() => {
    load();
  }, dependencies);

  return { reload: load };
}
