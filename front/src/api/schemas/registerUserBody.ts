import type { RegisterUserBodyRole } from "./registerUserBodyRole";

export type RegisterUserBody = {
  /** @minLength 3 */
  nome: string;
  email: string;
  /** @minLength 6 */
  senha: string;
  role?: RegisterUserBodyRole;
};
