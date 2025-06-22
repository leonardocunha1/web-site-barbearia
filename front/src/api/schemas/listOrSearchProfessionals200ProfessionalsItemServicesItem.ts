export type ListOrSearchProfessionals200ProfessionalsItemServicesItem = {
  /** Service ID */
  id: string;
  /**
   * Service name
   * @minLength 2
   */
  nome: string;
  /**
   * Service description
   * @maxLength 200
   */
  descricao?: string;
};
