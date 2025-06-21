import type { GetCoupons200CouponsItemType } from "./getCoupons200CouponsItemType";
import type { GetCoupons200CouponsItemScope } from "./getCoupons200CouponsItemScope";
import type { GetCoupons200CouponsItemService } from "./getCoupons200CouponsItemService";
import type { GetCoupons200CouponsItemProfessional } from "./getCoupons200CouponsItemProfessional";
import type { GetCoupons200CouponsItemUser } from "./getCoupons200CouponsItemUser";

export type GetCoupons200CouponsItem = {
  id: string;
  code: string;
  /** @nullable */
  description: string | null;
  type: GetCoupons200CouponsItemType;
  value: number;
  scope: GetCoupons200CouponsItemScope;
  /** @nullable */
  maxUses: number | null;
  uses: number;
  startDate: string;
  /** @nullable */
  endDate: string | null;
  /** @nullable */
  minBookingValue: number | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  /** @nullable */
  service?: GetCoupons200CouponsItemService;
  /** @nullable */
  professional?: GetCoupons200CouponsItemProfessional;
  /** @nullable */
  user?: GetCoupons200CouponsItemUser;
};
