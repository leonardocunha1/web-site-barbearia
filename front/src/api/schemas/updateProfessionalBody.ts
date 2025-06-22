/**
 * Professional profile update payload
 */
export type UpdateProfessionalBody = {
  /**
   * Updated professional specialty
   * @minLength 3
   */
  especialidade?: string;
  /**
   * Updated professional biography
   * @nullable
   */
  bio?: string | null;
  /**
   * Professional document number
   * @nullable
   */
  documento?: string | null;
  /**
   * Professional registration number
   * @nullable
   */
  registro?: string | null;
  /** Set professional active status */
  ativo?: boolean;
  /**
   * Updated avatar URL
   * @nullable
   * @pattern ^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$
   */
  avatarUrl?: string | null;
};
