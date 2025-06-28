/**
 * Dados para atualização do perfil profissional
 */
export type UpdateProfessionalBody = {
  /**
   * Especialidade atualizada do profissional
   * @minLength 3
   */
  especialidade?: string;
  /**
   * Biografia atualizada do profissional
   * @nullable
   */
  bio?: string | null;
  /**
   * Número do documento profissional
   * @nullable
   */
  documento?: string | null;
  /**
   * Número de registro profissional
   * @nullable
   */
  registro?: string | null;
  /** Definir status ativo do profissional */
  ativo?: boolean;
  /**
   * URL do avatar atualizado
   * @nullable
   * @pattern ^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$
   */
  avatarUrl?: string | null;
};
