/**
 * Dados do profissional
 */
export type GetProfessionalDashboard200Professional = {
  /** ID do profissional */
  id: string;
  /**
   * Nome do profissional
   * @minLength 2
   * @maxLength 100
   */
  name: string;
  /** Email do profissional */
  email: string;
  /**
   * Telefone do profissional
   * @nullable
   */
  phone: string | null;
  /**
   * Especialidade do profissional
   * @minLength 3
   * @maxLength 50
   */
  specialty: string;
  /**
   * Biografia do profissional
   * @nullable
   */
  bio: string | null;
  /**
   * URL do avatar do profissional
   * @nullable
   */
  avatarUrl: string | null;
  /**
   * Documento do profissional
   * @nullable
   */
  document: string | null;
  /** Status ativo do profissional */
  active: boolean;
};
