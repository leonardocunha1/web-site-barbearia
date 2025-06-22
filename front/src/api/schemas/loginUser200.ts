import type { LoginUser200User } from "./loginUser200User";

/**
 * Login bem-sucedido
 */
export type LoginUser200 = {
  token: string;
  user: LoginUser200User;
};
