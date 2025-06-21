import type { GetCoupons200CouponsItem } from "./getCoupons200CouponsItem";

export type GetCoupons200 = {
  coupons: GetCoupons200CouponsItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
