/**
 * Detalhes da conta do usuário
 */
export type ListOrSearchProfessionals200ProfessionalsItemUser = {
  /** ID do usuário */
  id: string;
  /**
   * Nome completo do usuário
   * @minLength 2
   */
  nome: string;
  /** Endereço de e-mail do usuário */
  email: string;
  /**
   * Número de telefone do usuário
   * @nullable
   * @pattern ^\+?[0-9]{10,15}$
   */
  telefone?: string | null;
};
