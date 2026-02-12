import { useCallback, useEffect, useState } from "react";
import { servicesGet } from "@/app/api/actions/services";
import type { Service } from "../types";

type UseServicesDataResult = {
  services: Service[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

const mapService = (service: {
  id: string;
  nome: string;
  descricao?: string | null;
  categoria?: string | null;
  ativo: boolean;
}): Service => ({
  id: service.id,
  nome: service.nome,
  descricao: service.descricao ?? undefined,
  categoria:
    service.categoria === "completo"
      ? "Cabelo + Barba"
      : service.categoria === "cabelo"
        ? "Cabelo"
        : "Barba",
  ativo: service.ativo ? "Ativo" : "Inativo",
});

export function useServicesData(): UseServicesDataResult {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const { data, ok, error } = await servicesGet();

    if (!ok || !data) {
      setError(error || "Erro ao carregar serviços");
      setIsLoading(false);
      return;
    }

    const mappedServices = data.services?.map(mapService) ?? [];
    setServices(mappedServices);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  return {
    services,
    isLoading,
    error,
    refetch: fetchServices,
  };
}
