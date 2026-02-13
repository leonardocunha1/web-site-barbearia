import {
  z as zod
} from 'zod';



export const zodgetAdminDashboardResponseMetricsProfessionalsActiveMin = 0;
export const zodgetAdminDashboardResponseMetricsNewProfessionalsMin = 0;
export const zodgetAdminDashboardResponseMetricsBookingsTodayMin = 0;
export const zodgetAdminDashboardResponseMetricsCancellationsLast24hMin = 0;
export const zodgetAdminDashboardResponseTopProfessionalsItemNameMin = 2;
export const zodgetAdminDashboardResponseTopProfessionalsItemTotalBookingsMin = 0;
export const zodgetAdminDashboardResponseTopProfessionalsMax = 3;
export const zodgetAdminDashboardResponseTopServicesItemNameMin = 2;
export const zodgetAdminDashboardResponseTopServicesItemTotalBookingsMin = 0;
export const zodgetAdminDashboardResponseTopServicesMax = 3;
export const zodgetAdminDashboardResponseFinancialRevenueTotalMin = 0;
export const zodgetAdminDashboardResponseFinancialCompletedBookingsMin = 0;
export const zodgetAdminDashboardResponseFinancialAverageTicketMin = 0;


export const zodgetAdminDashboardResponse = zod.object({
  "metrics": zod.object({
  "professionalsActive": zod.number().min(zodgetAdminDashboardResponseMetricsProfessionalsActiveMin),
  "newProfessionals": zod.number().min(zodgetAdminDashboardResponseMetricsNewProfessionalsMin),
  "bookingsToday": zod.number().min(zodgetAdminDashboardResponseMetricsBookingsTodayMin),
  "cancellationsLast24h": zod.number().min(zodgetAdminDashboardResponseMetricsCancellationsLast24hMin)
}),
  "topProfessionals": zod.array(zod.object({
  "id": zod.string().uuid(),
  "name": zod.string().min(zodgetAdminDashboardResponseTopProfessionalsItemNameMin),
  "totalBookings": zod.number().min(zodgetAdminDashboardResponseTopProfessionalsItemTotalBookingsMin)
})).max(zodgetAdminDashboardResponseTopProfessionalsMax),
  "topServices": zod.array(zod.object({
  "id": zod.string().uuid(),
  "name": zod.string().min(zodgetAdminDashboardResponseTopServicesItemNameMin),
  "totalBookings": zod.number().min(zodgetAdminDashboardResponseTopServicesItemTotalBookingsMin)
})).max(zodgetAdminDashboardResponseTopServicesMax),
  "financial": zod.object({
  "revenueTotal": zod.number().min(zodgetAdminDashboardResponseFinancialRevenueTotalMin),
  "completedBookings": zod.number().min(zodgetAdminDashboardResponseFinancialCompletedBookingsMin),
  "averageTicket": zod.number().min(zodgetAdminDashboardResponseFinancialAverageTicketMin)
})
})

