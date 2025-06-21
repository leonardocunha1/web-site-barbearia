import type { GetMeProfessionalSchedule200TimeSlotsItem } from "./getMeProfessionalSchedule200TimeSlotsItem";
import type { GetMeProfessionalSchedule200BusinessHours } from "./getMeProfessionalSchedule200BusinessHours";

export type GetMeProfessionalSchedule200 = {
  date: string;
  timeSlots: GetMeProfessionalSchedule200TimeSlotsItem[];
  businessHours: GetMeProfessionalSchedule200BusinessHours;
};
