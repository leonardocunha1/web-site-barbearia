/**
 * Payload for creating new professional
 */
export type CreateProfessionalBody = {
  /** Existing user ID to associate with professional */
  userId: string;
  /**
   * Professional specialty
   * @minLength 3
   */
  especialidade: string;
  /** Professional biography */
  bio?: string;
  /** Professional document number */
  documento?: string;
  /** Professional registration number */
  registro?: string;
  /**
   * Professional avatar URL
   * @pattern ^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$
   */
  avatarUrl?: string;
};
