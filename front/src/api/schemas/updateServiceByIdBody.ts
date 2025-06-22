export type UpdateServiceByIdBody = {
  /** @minLength 3 */
  nome?: string;
  descricao?: string;
  /**
   * @minimum 0
   * @exclusiveMinimum
   */
  precoPadrao?: number;
  /**
   * @minimum 0
   * @exclusiveMinimum
   */
  duracao?: number;
  categoria?: string;
  ativo?: boolean;
};
