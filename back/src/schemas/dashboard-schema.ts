import { z } from 'zod';

export const dashboardSchema = z.object({
  professional: z.object({
    name: z.string(),
    specialty: z.string(),
    avatarUrl: z.string().nullable(),
  }),
  metrics: z.object({
    appointments: z.number(),
    earnings: z.number(),
    canceled: z.number(),
    completed: z.number(),
  }),
  nextAppointments: z.array(
    z.object({
      id: z.string().uuid(),
      date: z.date(),
      clientName: z.string(),
      service: z.string(),
      status: z.enum(['PENDENTE', 'CONFIRMADO']),
    }),
  ),
});
