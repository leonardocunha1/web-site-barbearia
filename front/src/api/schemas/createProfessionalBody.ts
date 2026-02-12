/**
 * Dados para criação de novo profissional
 */
export type CreateProfessionalBody = {
  /** Email do profissional */
  email: string;
  /**
   * Especialidade do profissional
   * @minLength 3
   */
  specialty: string;
  /** Biografia do profissional */
  bio?: string;
  /** Número do documento profissional */
  document?: string;
  /** Número de registro profissional */
  registration?: string;
  /**
   * URL do avatar do profissional
   * @pattern ^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$
   */
  avatarUrl?: string;
  /** Status ativo do profissional */
  active?: boolean;
};
