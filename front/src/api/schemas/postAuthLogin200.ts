import type { PostAuthLogin200User } from "./postAuthLogin200User";

/**
 * Login bem-sucedido
 */
export type PostAuthLogin200 = {
  token: string;
  user: PostAuthLogin200User;
};
