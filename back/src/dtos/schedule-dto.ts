// src/dto/schedule.dto.ts
import { z } from 'zod';

export const getScheduleQuerySchema = z.object({
  professionalId: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // Formato YYYY-MM-DD
});

export type GetScheduleQuery = z.infer<typeof getScheduleQuerySchema>;

export type TimeSlot = {
  time: string; // Formato "HH:MM"
  available: boolean;
  booking?: {
    id: string;
    clientName: string;
    services: string[];
  };
};

export type ScheduleResponse = {
  date: string;
  timeSlots: TimeSlot[];
};
