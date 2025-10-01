import { useListOrSearchProfessionals, ListOrSearchProfessionals200ProfessionalsItem } from "@/api";

interface Professional {
  id: string;
  name: string;
  email: string;
  role: string;
  ativo: string;
}

export function useProfessionalData() {
  const { data: response, isLoading, refetch } = useListOrSearchProfessionals();

  const professionals: Professional[] = 
    response?.professionals?.map((p: ListOrSearchProfessionals200ProfessionalsItem) => ({
      id: p.id,
      name: p.user.nome,
      email: p.user.email,
      role: p.especialidade,
      ativo: p.ativo ? "Ativo" : "Inativo",
    })) ?? [];

  return {
    professionals,
    isLoading,
    refetch,
  };
}