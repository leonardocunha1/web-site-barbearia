export type CreateServiceBody = {
  /**
   * @minLength 3
   * @maxLength 100
   */
  name: string;
  /** @maxLength 500 */
  description?: string;
  /** @maxLength 50 */
  category?: string;
  type: "CORTE" | "BARBA" | "SOBRANCELHA" | "ESTETICA";
  active?: boolean;
};
