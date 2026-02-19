import { useMemo } from "react";
import { useListServices } from "@/api";
import type { Service } from "../types";

type UseServicesDataResult = {
  services: Service[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

const mapService = (service: {
  id: string;
  name: string;
  description?: string | null;
  category?: string | null;
  type: "CORTE" | "BARBA" | "SOBRANCELHA" | "ESTETICA";
  active: boolean;
}): Service => ({
  id: service.id,
  nome: service.name,
  descricao: service.description ?? undefined,
  categoria: service.category ?? undefined,
  tipo: service.type,
  ativo: service.active ? "Ativo" : "Inativo",
});

export function useServicesData(): UseServicesDataResult {
  const query = useListServices();

  const services = useMemo(
    () => query.data?.services?.map(mapService) ?? [],
    [query.data],
  );

  const error = query.error ? "Erro ao carregar serviços" : null;

  return {
    services,
    isLoading: query.isLoading,
    error,
    refetch: () => query.refetch().then(() => undefined),
  };
}
