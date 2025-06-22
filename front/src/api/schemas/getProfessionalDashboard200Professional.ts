/**
 * Professional
 */
export type GetProfessionalDashboard200Professional = {
  /** Nome do profissional */
  name: string;
  /** Especialidade do profissional */
  specialty: string;
  /**
   * URL do avatar do profissional, pode ser nulo
   * @nullable
   */
  avatarUrl: string | null;
};
