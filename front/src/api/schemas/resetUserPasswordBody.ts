export type ResetUserPasswordBody = {
  /** @minLength 1 */
  token: string;
  /** @minLength 6 */
  newPassword: string;
};
