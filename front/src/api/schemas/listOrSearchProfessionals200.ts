import type { ListOrSearchProfessionals200ProfessionalsItem } from "./listOrSearchProfessionals200ProfessionalsItem";

export type ListOrSearchProfessionals200 = {
  professionals: ListOrSearchProfessionals200ProfessionalsItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
