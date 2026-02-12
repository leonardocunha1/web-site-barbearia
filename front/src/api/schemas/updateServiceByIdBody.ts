export type UpdateServiceByIdBody = {
  /**
   * @minLength 3
   * @maxLength 100
   */
  name?: string;
  /** @maxLength 500 */
  description?: string;
  /**
   * @minimum 0
   * @exclusiveMinimum
   */
  defaultPrice?: number;
  /**
   * @minimum 0
   * @exclusiveMinimum
   */
  duration?: number;
  /** @maxLength 50 */
  category?: string;
  active?: boolean;
};
