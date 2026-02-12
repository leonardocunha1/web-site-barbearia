import {
  Professional,
  professionalsList,
} from "@/app/api/actions/professional";
import { useState, useEffect, useCallback } from "react";

interface UseProfessionalDataParams {
  page?: number;
  limit?: number;
  search?: string;
  especialidade?: string;
  status?: string;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
}

export function useProfessionalData(params?: UseProfessionalDataParams) {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(
    async (queryParams?: UseProfessionalDataParams) => {
      setIsLoading(true);
      setError(null);
      try {
        const { data, ok, error } = await professionalsList(queryParams);
        if (ok && data) {
          setProfessionals(data.professionals);
          setTotalCount(data.total);
        } else {
          setError(error || "Erro ao carregar profissionais");
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    fetchData(params);
  }, [params, fetchData]);

  return {
    professionals,
    totalCount,
    isLoading,
    error,
    refetch: () => fetchData(params),
  };
}
