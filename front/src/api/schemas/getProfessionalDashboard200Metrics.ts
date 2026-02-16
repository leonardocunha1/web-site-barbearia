import type { GetProfessionalDashboard200MetricsTopServicesItem } from "./getProfessionalDashboard200MetricsTopServicesItem";

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
  /**
   * Quantidade de agendamentos pendentes
   * @minimum 0
   */
  pendingCount: number;
  /**
   * Taxa de cancelamento em percentual
   * @minimum 0
   */
  cancellationRate: number;
  /**
   * Taxa de conclusão em percentual
   * @minimum 0
   */
  completionRate: number;
  /**
   * Ganho médio por agendamento
   * @minimum 0
   */
  averageTicket: number;
  /**
   * Top 5 serviços mais agendados
   * @maxItems 5
   */
  topServices: GetProfessionalDashboard200MetricsTopServicesItem[];
};
