import type { ListOrSearchProfessionals200ProfessionalsItemUser } from "./listOrSearchProfessionals200ProfessionalsItemUser";
import type { ListOrSearchProfessionals200ProfessionalsItemServicesItem } from "./listOrSearchProfessionals200ProfessionalsItemServicesItem";

/**
 * Complete professional profile with user details and services
 */
export type ListOrSearchProfessionals200ProfessionalsItem = {
  /** Unique identifier for the professional */
  id: string;
  /**
   * Professional specialty
   * @minLength 3
   */
  especialidade: string;
  /**
   * Professional biography
   * @maxLength 500
   */
  bio?: string;
  /**
   * URL to professional avatar image
   * @pattern ^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$
   */
  avatarUrl?: string;
  /** Whether the professional is active */
  ativo?: boolean;
  /** User account details */
  user: ListOrSearchProfessionals200ProfessionalsItemUser;
  /** List of services offered by the professional */
  services: ListOrSearchProfessionals200ProfessionalsItemServicesItem[];
};
