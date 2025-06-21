export type PatchUsersUpdatePasswordBody = {
  /** @minLength 6 */
  currentPassword: string;
  /** @minLength 6 */
  newPassword: string;
};
