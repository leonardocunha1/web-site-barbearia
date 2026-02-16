/**
 * Serviço com estatísticas
 */
export type GetProfessionalDashboard200MetricsTopServicesItem = {
  /** Nome do serviço */
  service: string;
  /**
   * Quantidade de agendamentos
   * @minimum 0
   */
  count: number;
  /**
   * Percentual do total
   * @minimum 0
   */
  percentage: number;
};
