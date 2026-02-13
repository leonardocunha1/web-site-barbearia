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
