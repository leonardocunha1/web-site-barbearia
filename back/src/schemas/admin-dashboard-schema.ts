import { z } from 'zod';

export const adminDashboardMetricsSchema = z.object({
  professionalsActive: z
    .number()
    .int({ message: 'O numero de profissionais deve ser inteiro' })
    .nonnegative({ message: 'O numero de profissionais nao pode ser negativo' }),
  newProfessionals: z
    .number()
    .int({ message: 'O numero de novos profissionais deve ser inteiro' })
    .nonnegative({ message: 'O numero de novos profissionais nao pode ser negativo' }),
  bookingsToday: z
    .number()
    .int({ message: 'O numero de agendamentos deve ser inteiro' })
    .nonnegative({ message: 'O numero de agendamentos nao pode ser negativo' }),
  cancellationsLast24h: z
    .number()
    .int({ message: 'O numero de cancelamentos deve ser inteiro' })
    .nonnegative({ message: 'O numero de cancelamentos nao pode ser negativo' }),
});

export const adminDashboardTopProfessionalSchema = z.object({
  id: z.string().uuid({ message: 'ID do profissional invalido' }),
  name: z.string().min(2, { message: 'Nome do profissional invalido' }),
  totalBookings: z
    .number()
    .int({ message: 'O numero de atendimentos deve ser inteiro' })
    .nonnegative(),
});

export const adminDashboardTopServiceSchema = z.object({
  id: z.string().uuid({ message: 'ID do servico invalido' }),
  name: z.string().min(2, { message: 'Nome do servico invalido' }),
  totalBookings: z
    .number()
    .int({ message: 'O numero de agendamentos deve ser inteiro' })
    .nonnegative(),
});

export const adminDashboardFinancialSchema = z.object({
  revenueTotal: z.number().nonnegative({ message: 'O faturamento nao pode ser negativo' }),
  completedBookings: z
    .number()
    .int({ message: 'O numero de servicos deve ser inteiro' })
    .nonnegative({ message: 'O numero de servicos nao pode ser negativo' }),
  averageTicket: z.number().nonnegative({ message: 'O ticket medio nao pode ser negativo' }),
});

export const adminDashboardSchema = z.object({
  metrics: adminDashboardMetricsSchema,
  topProfessionals: z.array(adminDashboardTopProfessionalSchema).max(3),
  topServices: z.array(adminDashboardTopServiceSchema).max(3),
  financial: adminDashboardFinancialSchema,
});

export type AdminDashboardMetrics = z.infer<typeof adminDashboardMetricsSchema>;
export type AdminDashboardTopProfessional = z.infer<typeof adminDashboardTopProfessionalSchema>;
export type AdminDashboardTopService = z.infer<typeof adminDashboardTopServiceSchema>;
export type AdminDashboardFinancial = z.infer<typeof adminDashboardFinancialSchema>;
export type AdminDashboard = z.infer<typeof adminDashboardSchema>;
