/**
 * User account details
 */
export type ListOrSearchProfessionals200ProfessionalsItemUser = {
  /** User ID */
  id: string;
  /**
   * User full name
   * @minLength 2
   */
  nome: string;
  /** User email address */
  email: string;
  /**
   * User phone number
   * @nullable
   * @pattern ^\+?[0-9]{10,15}$
   */
  telefone?: string | null;
};
