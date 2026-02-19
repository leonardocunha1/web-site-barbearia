import { useMemo } from "react";
import {
  ListOrSearchProfessionalsParams,
  useListOrSearchProfessionals,
} from "@/api";

export type Professional = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  specialty: string;
  status: "Active" | "Inactive";
};

export function useProfessionalData(params?: ListOrSearchProfessionalsParams) {
  const query = useListOrSearchProfessionals(params);

  const professionals = useMemo<Professional[]>(() => {
    return (
      query.data?.professionals?.map((p) => ({
        id: p.id,
        name: p.user.name,
        email: p.user.email,
        phone: p.user.phone ?? null,
        specialty: p.specialty,
        status: p.active ? "Active" : "Inactive",
      })) ?? []
    );
  }, [query.data]);

  const totalCount = query.data?.total ?? 0;
  const error = query.error ? "Erro ao carregar profissionais" : null;

  return {
    professionals,
    totalCount,
    isLoading: query.isLoading,
    error,
    refetch: () => query.refetch().then(() => undefined),
  };
}
