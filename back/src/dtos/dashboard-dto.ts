export type TimeRange = 'all' | 'today' | 'week' | 'month' | 'custom';

export type DashboardRequestDTO = {
  range: TimeRange;
  startDate?: Date; // Apenas para 'custom'
  endDate?: Date; // Apenas para 'custom'
};

export type DashboardResponseDTO = {
  professional: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    specialty: string;
    bio: string | null;
    avatarUrl: string | null;
    document: string | null;
    active: boolean;
  };
  metrics: {
    // Métricas básicas
    appointments: number;
    earnings: number;
    canceled: number;
    completed: number;

    // Métricas calculadas
    pendingCount: number;
    cancellationRate: number; // Percentual
    completionRate: number; // Percentual
    averageTicket: number; // Ganho médio por agendamento

    // Breakdown de serviços (top 5)
    topServices: Array<{
      service: string;
      count: number;
      percentage: number;
    }>;
  };
  nextAppointments: {
    id: string;
    date: Date;
    clientName: string;
    service: string;
    status: 'PENDING' | 'CONFIRMED';
    totalAmount?: number;
  }[];
};
