import type { GetProfessionals200ProfessionalsItemUser } from "./getProfessionals200ProfessionalsItemUser";
import type { GetProfessionals200ProfessionalsItemServicesItem } from "./getProfessionals200ProfessionalsItemServicesItem";

export type GetProfessionals200ProfessionalsItem = {
  id: string;
  especialidade: string;
  bio?: string;
  avatarUrl?: string;
  ativo?: boolean;
  user: GetProfessionals200ProfessionalsItemUser;
  services: GetProfessionals200ProfessionalsItemServicesItem[];
};
