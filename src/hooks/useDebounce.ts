import { useCallback, useRef, useEffect, useState } from "react";

/**
 * Custom hook that creates a debounced version of a callback function
 * @param callback - The function to debounce
 * @param delay - The delay in milliseconds (default: 500ms)
 * @param deps - Optional dependency array for the callback
 * @returns A debounced version of the callback and a cancel function
 */
export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 500,
  deps?: React.DependencyList
): [T, () => void] {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const callbackRef = useRef(callback);

  // Update callback ref when it changes
  useEffect(() => {
    callbackRef.current = callback;
  }, deps ? [...deps, callback] : [callback]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const debouncedCallback = useCallback(
    ((...args: Parameters<T>) => {
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout
      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    }) as T,
    [delay]
  );

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  return [debouncedCallback, cancel];
}

/**
 * Custom hook that debounces a value
 * @param value - The value to debounce
 * @param delay - The delay in milliseconds (default: 500ms)
 * @returns The debounced value
 */
export function useDebouncedValue<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timeout);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Custom hook for debouncing API calls with loading state
 * @param apiCall - The API call function to debounce
 * @param delay - The delay in milliseconds (default: 500ms)
 * @returns An object with the debounced function, loading state, error state, and cancel function
 */
export function useDebouncedAPI<T extends (...args: any[]) => Promise<any>>(
  apiCall: T,
  delay: number = 500
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const wrappedApiCall = useCallback(
    async (...args: Parameters<T>) => {
      try {
        // Cancel any pending request
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }

        // Create new abort controller
        abortControllerRef.current = new AbortController();

        setIsLoading(true);
        setError(null);

        // Call the API with abort signal if it accepts one
        const result = await apiCall(...args, {
          signal: abortControllerRef.current.signal,
        });

        setIsLoading(false);
        return result;
      } catch (err) {
        // Ignore abort errors
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        setError(err instanceof Error ? err : new Error("An error occurred"));
        setIsLoading(false);
        throw err;
      }
    },
    [apiCall]
  );

  const [debouncedApiCall, cancel] = useDebounce(wrappedApiCall, delay);

  const cancelAll = useCallback(() => {
    cancel();
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsLoading(false);
  }, [cancel]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    debouncedApiCall: debouncedApiCall as T,
    isLoading,
    error,
    cancel: cancelAll,
  };
}

// Example usage with TypeScript
type SearchParams = {
  query: string;
  filters?: Record<string, any>;
};

export function useSearchExample() {
  const searchAPI = async (params: SearchParams, options?: { signal?: AbortSignal }) => {
    const response = await fetch(`/api/search?q=${params.query}`, {
      signal: options?.signal,
    });
    if (!response.ok) throw new Error("Search failed");
    return response.json();
  };

  const { debouncedApiCall, isLoading, error, cancel } = useDebouncedAPI(searchAPI, 300);

  return {
    search: debouncedApiCall,
    isSearching: isLoading,
    searchError: error,
    cancelSearch: cancel,
  };
}