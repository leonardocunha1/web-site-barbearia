export type UpdateUserProfileBody = {
  /** @minLength 3 */
  name?: string;
  email?: string;
  /** @nullable */
  phone?: string | null;
};
