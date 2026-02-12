export type UpdateServiceProfessionalBodyServicesItem = {
  serviceId: string;
  /**
   * @minimum 0
   * @exclusiveMinimum
   */
  price: number;
  /**
   * @minimum 0
   * @exclusiveMinimum
   */
  duration: number;
  linked: boolean;
};
