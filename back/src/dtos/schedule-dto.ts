import { z } from 'zod';

export const getScheduleQuerySchema = z.object({
  professionalId: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export type GetScheduleQuery = z.infer<typeof getScheduleQuerySchema>;

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
