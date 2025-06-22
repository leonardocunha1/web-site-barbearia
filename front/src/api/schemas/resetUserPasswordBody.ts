export type ResetUserPasswordBody = {
  token: string;
  /** @minLength 6 */
  newPassword: string;
};
