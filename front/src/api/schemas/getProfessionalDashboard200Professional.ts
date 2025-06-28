/**
 * Dados do profissional
 */
export type GetProfessionalDashboard200Professional = {
  /**
   * Nome do profissional
   * @minLength 2
   * @maxLength 100
   */
  name: string;
  /**
   * Especialidade do profissional
   * @minLength 3
   * @maxLength 50
   */
  specialty: string;
  /**
   * URL do avatar do profissional, pode ser nulo
   * @nullable
   */
  avatarUrl: string | null;
};
