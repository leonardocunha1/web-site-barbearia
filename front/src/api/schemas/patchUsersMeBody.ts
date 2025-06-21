export type PatchUsersMeBody = {
  /** @minLength 3 */
  nome?: string;
  email?: string;
  /** @nullable */
  telefone?: string | null;
};
