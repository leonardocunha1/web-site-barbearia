import type { RegisterUserBodyRole } from "./registerUserBodyRole";

export type RegisterUserBody = {
  /** @minLength 3 */
  nome: string;
  email: string;
  /** @minLength 6 */
  senha: string;
  role?: RegisterUserBodyRole;
  /**
   * @minLength 10
   * @maxLength 11
   */
  telefone: string;
};
