import type { GetProfessionalSchedule200TimeSlotsItem } from "./getProfessionalSchedule200TimeSlotsItem";
import type { GetProfessionalSchedule200BusinessHours } from "./getProfessionalSchedule200BusinessHours";

export type GetProfessionalSchedule200 = {
  date: string;
  timeSlots: GetProfessionalSchedule200TimeSlotsItem[];
  businessHours: GetProfessionalSchedule200BusinessHours;
};
