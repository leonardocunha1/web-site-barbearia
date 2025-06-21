import type { PostAuthRegisterBodyRole } from "./postAuthRegisterBodyRole";

export type PostAuthRegisterBody = {
  /** @minLength 3 */
  nome: string;
  email: string;
  /** @minLength 6 */
  senha: string;
  role?: PostAuthRegisterBodyRole;
};
