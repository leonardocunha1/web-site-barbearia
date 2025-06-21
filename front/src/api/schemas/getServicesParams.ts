export type GetServicesParams = {
  /**
   * @minimum 0
   * @exclusiveMinimum
   */
  page?: number;
  /**
   * @minimum 0
   * @maximum 100
   * @exclusiveMinimum
   */
  limit?: number;
  nome?: string;
  categoria?: string;
  ativo?: boolean;
  professionalId?: string;
};
