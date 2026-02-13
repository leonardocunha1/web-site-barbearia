import { z } from 'zod';

export const getScheduleQuerySchema = z.object({
  professionalId: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  serviceIds: z
    .string()
    .transform((val) => {
      try {
        return JSON.parse(val);
      } catch {
        return [];
      }
    })
    .refine((val) => Array.isArray(val), { message: 'serviceIds deve ser um array válido' })
    .optional()
    .default([]),
});

// Schema para rota pública (professionalId vem da URL, não do querystring)
export const getPublicScheduleQuerySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  serviceIds: z
    .union([
      z.string().transform((val) => {
        try {
          return JSON.parse(val);
        } catch {
          return [];
        }
      }),
      z.array(z.string()),
    ])
    .optional()
    .default([]),
});

export type GetScheduleQuery = z.infer<typeof getScheduleQuerySchema>;
export type GetPublicScheduleQuery = z.infer<typeof getPublicScheduleQuerySchema>;

/**
 * Time slot with availability and optional booking info
 * Includes only public client info (name, not email/phone)
 */
export type TimeSlot = {
  time: string; // Formato "HH:MM"
  available: boolean;
  booking?: {
    id: string;
    clientName: string;
    services: string[];
  };
};

/**
 * Schedule response for a specific date
 */
export type ScheduleResponse = {
  date: string;
  timeSlots: TimeSlot[];
};
