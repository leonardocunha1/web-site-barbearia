export type CreateServiceBody = {
  /**
   * @minLength 3
   * @maxLength 100
   */
  nome: string;
  /** @maxLength 500 */
  descricao?: string;
  /** @maxLength 50 */
  categoria?: string;
};
