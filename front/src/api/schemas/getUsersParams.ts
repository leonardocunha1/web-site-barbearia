import type { GetUsersRole } from "./getUsersRole";

export type GetUsersParams = {
  /**
   * @minimum 0
   * @exclusiveMinimum
   */
  page?: number;
  /**
   * @minimum 0
   * @maximum 100
   * @exclusiveMinimum
   */
  limit?: number;
  role?: GetUsersRole;
  name?: string;
};
