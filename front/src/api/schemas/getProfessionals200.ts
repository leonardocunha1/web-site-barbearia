import type { GetProfessionals200ProfessionalsItem } from "./getProfessionals200ProfessionalsItem";

export type GetProfessionals200 = {
  professionals: GetProfessionals200ProfessionalsItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
