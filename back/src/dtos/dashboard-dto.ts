export type TimeRange = 'today' | 'week' | 'month' | 'custom';

export type DashboardRequestDTO = {
  range: TimeRange;
  startDate?: Date; // Apenas para 'custom'
  endDate?: Date; // Apenas para 'custom'
};

export type DashboardResponseDTO = {
  professional: {
    name: string;
    specialty: string;
    avatarUrl: string | null;
  };
  metrics: {
    appointments: number;
    earnings: number;
    canceled: number;
    completed: number;
  };
  nextAppointments: {
    id: string;
    date: Date;
    clientName: string;
    service: string;
    status: 'PENDING' | 'CONFIRMED';
  }[];
};
