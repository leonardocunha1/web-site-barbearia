import type { PostCouponsBodyType } from "./postCouponsBodyType";
import type { PostCouponsBodyScope } from "./postCouponsBodyScope";

export type PostCouponsBody = {
  /**
   * @minLength 3
   * @maxLength 50
   */
  code: string;
  type: PostCouponsBodyType;
  /**
   * @minimum 0
   * @exclusiveMinimum
   */
  value: number;
  scope: PostCouponsBodyScope;
  /** @maxLength 255 */
  description?: string;
  /**
   * @minimum 0
   * @exclusiveMinimum
   */
  maxUses?: number;
  startDate?: string;
  endDate?: string;
  /**
   * @minimum 0
   * @exclusiveMinimum
   */
  minBookingValue?: number;
  serviceId?: string;
  professionalId?: string;
};
