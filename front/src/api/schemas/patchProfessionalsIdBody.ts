export type PatchProfessionalsIdBody = {
  /** @minLength 3 */
  especialidade?: string;
  /** @nullable */
  bio?: string | null;
  /** @nullable */
  documento?: string | null;
  /** @nullable */
  registro?: string | null;
  ativo?: boolean;
  /** @nullable */
  avatarUrl?: string | null;
};
