import type { RegisterUserBodyRole } from "./registerUserBodyRole";

export type RegisterUserBody = {
  /** @minLength 3 */
  name: string;
  email: string;
  /**
   * @minLength 6
   * @maxLength 100
   */
  password: string;
  role?: RegisterUserBodyRole;
  /** @minLength 1 */
  phone: string;
};
