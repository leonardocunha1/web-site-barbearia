import type { UpdateServiceByIdBodyType } from "./updateServiceByIdBodyType";

export type UpdateServiceByIdBody = {
  /**
   * @minLength 3
   * @maxLength 100
   */
  name?: string;
  type?: UpdateServiceByIdBodyType;
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
