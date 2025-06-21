export type PostProfessionalsProfessionalIdServicesBody = {
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
