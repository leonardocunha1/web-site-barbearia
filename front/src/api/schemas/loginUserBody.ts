export type LoginUserBody = {
  email: string;
  /** @minLength 6 */
  senha: string;
};
