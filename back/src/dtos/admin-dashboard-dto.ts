export type AdminDashboardTimeRange = 'all' | 'today' | 'week' | 'month' | 'custom';

export type AdminDashboardRequestDTO = {
  range: AdminDashboardTimeRange;
  startDate?: Date; // Apenas para 'custom'
  endDate?: Date; // Apenas para 'custom'
};

export type AdminDashboardResponseDTO = {
  metrics: {
    professionalsActive: number;
    newProfessionals: number;
    bookingsToday: number;
    cancellationsLast24h: number;
  };
  topProfessionals: {
    id: string;
    name: string;
    totalBookings: number;
  }[];
  topServices: {
    id: string;
    name: string;
    totalBookings: number;
  }[];
  financial: {
    revenueTotal: number;
    completedBookings: number;
    averageTicket: number;
  };
};
