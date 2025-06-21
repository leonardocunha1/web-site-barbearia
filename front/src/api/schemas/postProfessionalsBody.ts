export type PostProfessionalsBody = {
  userId: string;
  /** @minLength 3 */
  especialidade: string;
  bio?: string;
  documento?: string;
  registro?: string;
  avatarUrl?: string;
};
