import { z } from 'zod';

// Consulta para dashboard analítico
export const dashboardQuerySchema = z
  .object({
    range: z
      .enum(['all', 'today', 'week', 'month', 'custom'], {
        errorMap: () => ({
          message: 'O período deve ser: all, today, week, month ou custom',
        }),
      })
      .default('month')
      .describe('Período de tempo para análise'),

    startDate: z
      .string()
      .datetime({ offset: true, message: 'Data de início inválida' })
      .optional()
      .describe('Data de início personalizada (obrigatória para período custom)'),

    endDate: z
      .string()
      .datetime({ offset: true, message: 'Data de término inválida' })
      .optional()
      .describe('Data de término personalizada (obrigatória para período custom)'),
  })
  .refine(
    (data) => {
      if (data.range === 'custom') {
        return data.startDate && data.endDate;
      }
      return true;
    },
    {
      message: 'Ambas as datas (início e término) são obrigatórias para período customizado',
      path: ['startDate', 'endDate'],
    },
  )
  .describe('Parâmetros para análise do dashboard admin');

export type DashboardQuery = z.infer<typeof dashboardQuerySchema>;
