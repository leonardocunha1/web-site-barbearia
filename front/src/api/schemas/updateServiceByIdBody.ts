export type UpdateServiceByIdBody = {
  /**
   * @minLength 3
   * @maxLength 100
   */
  nome?: string;
  /** @maxLength 500 */
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
  /** @maxLength 50 */
  categoria?: string;
  ativo?: boolean;
};
