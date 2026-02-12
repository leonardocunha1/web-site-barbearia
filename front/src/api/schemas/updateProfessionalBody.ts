/**
 * Dados para atualização do perfil profissional
 */
export type UpdateProfessionalBody = {
  /**
   * Especialidade atualizada do profissional
   * @minLength 3
   */
  specialty?: string;
  /**
   * Biografia atualizada do profissional
   * @nullable
   */
  bio?: string | null;
  /**
   * Número do documento profissional
   * @nullable
   */
  document?: string | null;
  /**
   * Número de registro profissional
   * @nullable
   */
  registration?: string | null;
  /** Definir status ativo do profissional */
  active?: boolean;
  /**
   * URL do avatar atualizado
   * @nullable
   * @pattern ^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$
   */
  avatarUrl?: string | null;
};
