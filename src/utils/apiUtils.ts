export class ApiError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export interface ApiOptions {
  timeout?: number;
}

const DEFAULT_TIMEOUT = 30000; // 30 seconds

/**
 * Wrapper for API calls with timeout
 */
export async function apiCallWithTimeout<T>(
  apiCall: () => Promise<T>,
  options: ApiOptions = {}
): Promise<T> {
  const { timeout = DEFAULT_TIMEOUT } = options;

  try {
    // Create timeout promise
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new ApiError('Request timeout', 'TIMEOUT'));
      }, timeout);
    });

    // Race between API call and timeout
    const result = await Promise.race([
      apiCall(),
      timeoutPromise
    ]);

    return result;
  } catch (error) {
    // Don't retry on timeout errors
    if (error instanceof ApiError && error.code === 'TIMEOUT') {
      throw error;
    }
    
    // Check if it's a network error
    if (error instanceof Error && error.message.includes('Failed to fetch')) {
      throw new ApiError('Network error. Please check your connection.', 'NETWORK_ERROR', error);
    }
    
    throw error;
  }
}

/**
 * Execute multiple API calls with individual error handling
 */
export async function executeParallelApiCalls<T extends Record<string, () => Promise<any>>>(
  calls: T,
  options: ApiOptions = {}
): Promise<{
  [K in keyof T]: { success: boolean; data?: Awaited<ReturnType<T[K]>>; error?: Error }
}> {
  const entries = Object.entries(calls) as [keyof T, T[keyof T]][];
  
  const results = await Promise.all(
    entries.map(async ([key, call]) => {
      try {
        const data = await apiCallWithTimeout(call, options);
        return { key, success: true, data };
      } catch (error) {
        console.error(`API call '${String(key)}' failed:`, error);
        return { key, success: false, error: error as Error };
      }
    })
  );

  return results.reduce((acc, { key, ...result }) => {
    acc[key] = result;
    return acc;
  }, {} as any);
}