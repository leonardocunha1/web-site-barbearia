/**
 * Custom hooks for API operations
 * Provides common patterns for API calls with error handling
 */

import { useCallback, useState } from "react";
import { ApiResponse } from "@/shared/types";

interface UseApiCallOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

/**
 * Hook for making API calls with loading and error states
 */
export function useApiCall<T>(
  apiFunction: (...args: any[]) => Promise<ApiResponse<T>>,
  options?: UseApiCallOptions,
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (...args: any[]) => {
      setLoading(true);
      setError(null);

      try {
        const result = await apiFunction(...args);

        if (!result.ok) {
          const errorMessage =
            typeof result.error === "string"
              ? result.error
              : "Erro ao processar requisição";
          setError(errorMessage);
          options?.onError?.(errorMessage);
          return result;
        }

        options?.onSuccess?.(result.data);
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro desconhecido";
        setError(errorMessage);
        options?.onError?.(errorMessage);
        return { ok: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [apiFunction, options],
  );

  const clearError = useCallback(() => setError(null), []);

  return { execute, loading, error, clearError };
}

/**
 * Hook for managing paginated API calls
 */
export function useApiPagination<T>(
  apiFunction: (
    page: number,
    limit: number,
    ...args: any[]
  ) => Promise<ApiResponse<any>>,
  initialLimit = 10,
) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(initialLimit);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T[]>([]);
  const [total, setTotal] = useState(0);

  const fetch = useCallback(
    async (...args: any[]) => {
      setLoading(true);
      setError(null);

      try {
        const result = await apiFunction(page, limit, ...args);

        if (!result.ok) {
          const errorMessage =
            typeof result.error === "string"
              ? result.error
              : "Erro ao buscar dados";
          setError(errorMessage);
          return result;
        }

        setData(result.data?.items || []);
        setTotal(result.data?.total || 0);
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro desconhecido";
        setError(errorMessage);
        return { ok: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [page, limit, apiFunction],
  );

  return {
    data,
    total,
    page,
    limit,
    loading,
    error,
    setPage,
    setLimit,
    fetch,
    hasNextPage: page * limit < total,
    hasPrevPage: page > 1,
  };
}
