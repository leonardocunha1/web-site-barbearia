import type { CreateServiceBodyType } from "./createServiceBodyType";

export type CreateServiceBody = {
  /**
   * @minLength 3
   * @maxLength 100
   */
  name: string;
  type: CreateServiceBodyType;
  /** @maxLength 500 */
  description?: string;
  /** @maxLength 50 */
  category?: string;
  active?: boolean;
};
