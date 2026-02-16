/**
 * Dados para atualização do perfil profissional
 */
export type UpdateProfessionalBody = {
  /**
   * Nome atualizado do profissional
   * @minLength 2
   */
  name?: string;
  /** E-mail atualizado do profissional */
  email?: string;
  /**
   * Telefone atualizado do profissional
   * @nullable
   * @pattern ^\+?[\d\s()-]{10,20}$
   */
  phone?: string | null;
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
