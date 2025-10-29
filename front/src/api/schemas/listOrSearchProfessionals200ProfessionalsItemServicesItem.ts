export type ListOrSearchProfessionals200ProfessionalsItemServicesItem = {
  /** ID do serviço */
  id: string;
  /**
   * Nome do serviço
   * @minLength 2
   */
  nome: string;
  /**
   * Descrição do serviço
   * @maxLength 200
   */
  descricao?: string;
  /** Indica se o serviço está vinculado ao profissional */
  linked: boolean;
};
