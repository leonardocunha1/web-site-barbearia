export type AddServiceToProfessionalBody = {
  serviceId: string;
  /**
   * @minimum 0
   * @exclusiveMinimum
   */
  preco: number;
  /**
   * @minimum 0
   * @exclusiveMinimum
   */
  duracao: number;
};
