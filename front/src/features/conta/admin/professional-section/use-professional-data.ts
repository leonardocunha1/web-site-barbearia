import { Professional, servicesProfessionalsList } from "@/app/api/actions/professional";
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (queryParams?: UseProfessionalDataParams) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, ok, error } = await servicesProfessionalsList(queryParams);
      if (ok && data) {
        setProfessionals(data.professionals);
      } else {
        setError(error || "Erro ao carregar profissionais");
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(params);
  }, [params, fetchData]);

  return {
    professionals,
    isLoading,
    error,
    refetch: () => fetchData(params),
  };
}
