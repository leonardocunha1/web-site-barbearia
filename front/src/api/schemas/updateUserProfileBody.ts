export type UpdateUserProfileBody = {
  /** @minLength 3 */
  nome?: string;
  email?: string;
  /** @nullable */
  telefone?: string | null;
};
