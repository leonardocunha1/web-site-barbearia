import type { ListOrSearchProfessionals200ProfessionalsItemUser } from "./listOrSearchProfessionals200ProfessionalsItemUser";
import type { ListOrSearchProfessionals200ProfessionalsItemServicesItem } from "./listOrSearchProfessionals200ProfessionalsItemServicesItem";

/**
 * Perfil completo do profissional com detalhes do usuário e serviços
 */
export type ListOrSearchProfessionals200ProfessionalsItem = {
  /** Identificador único do profissional */
  id: string;
  /**
   * Especialidade do profissional
   * @minLength 3
   * @maxLength 100
   */
  especialidade: string;
  /**
   * Biografia do profissional
   * @maxLength 500
   */
  bio?: string;
  /**
   * URL da imagem de avatar do profissional
   * @pattern ^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$
   */
  avatarUrl?: string;
  /** Indica se o profissional está ativo */
  ativo?: boolean;
  /** Detalhes da conta do usuário */
  user: ListOrSearchProfessionals200ProfessionalsItemUser;
  /** Lista de serviços oferecidos pelo profissional */
  services: ListOrSearchProfessionals200ProfessionalsItemServicesItem[];
};
