export type GetProfessionalsParams = {
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
  /**
   * @minLength 2
   */
  query: string;
  ativo?: boolean;
};
