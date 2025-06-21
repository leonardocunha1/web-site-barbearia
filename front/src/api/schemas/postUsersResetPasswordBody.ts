export type PostUsersResetPasswordBody = {
  token: string;
  /** @minLength 6 */
  newPassword: string;
};
