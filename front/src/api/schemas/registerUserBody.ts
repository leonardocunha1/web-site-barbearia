import type { RegisterUserBodyRole } from "./registerUserBodyRole";

export type RegisterUserBody = {
  /** @minLength 3 */
  nome: string;
  email: string;
  /**
   * @minLength 6
   * @maxLength 100
   */
  senha: string;
  role?: RegisterUserBodyRole;
  /** @minLength 1 */
  telefone: string;
};
