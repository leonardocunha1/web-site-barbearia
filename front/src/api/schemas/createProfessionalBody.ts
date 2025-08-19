/**
 * Dados para criação de novo profissional
 */
export type CreateProfessionalBody = {
  /** ID do usuário existente para associar ao profissional */
  email: string;
  /**
   * Especialidade do profissional
   * @minLength 3
   */
  especialidade: string;
  /** Biografia do profissional */
  bio?: string;
  /** Número do documento profissional */
  documento?: string;
  /** Número de registro profissional */
  registro?: string;
  /**
   * URL do avatar do profissional
   * @pattern ^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$
   */
  avatarUrl?: string;
};
