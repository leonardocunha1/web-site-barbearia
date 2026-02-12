export type AddServiceToProfessionalBody = {
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
};
