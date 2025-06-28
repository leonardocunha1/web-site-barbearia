/**
 * Métricas do dashboard
 */
export type GetProfessionalDashboard200Metrics = {
  /**
   * Quantidade total de agendamentos
   * @minimum 0
   */
  appointments: number;
  /**
   * Total de ganhos
   * @minimum 0
   */
  earnings: number;
  /**
   * Quantidade de agendamentos cancelados
   * @minimum 0
   */
  canceled: number;
  /**
   * Quantidade de agendamentos concluídos
   * @minimum 0
   */
  completed: number;
};
