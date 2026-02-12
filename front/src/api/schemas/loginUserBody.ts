export type LoginUserBody = {
  email: string;
  /** @minLength 6 */
  password: string;
};
