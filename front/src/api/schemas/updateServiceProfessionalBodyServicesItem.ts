export type UpdateServiceProfessionalBodyServicesItem = {
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
  linked: boolean;
};
