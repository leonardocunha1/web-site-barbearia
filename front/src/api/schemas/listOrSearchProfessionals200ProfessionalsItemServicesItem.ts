export type ListOrSearchProfessionals200ProfessionalsItemServicesItem = {
  /** ID do serviço */
  id: string;
  /**
   * Nome do serviço
   * @minLength 2
   */
  name: string;
  /**
   * Descrição do serviço
   * @maxLength 200
   */
  description?: string;
  /** Indica se o serviço está vinculado ao profissional */
  linked: boolean;
};
