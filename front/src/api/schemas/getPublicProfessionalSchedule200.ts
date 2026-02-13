import type { GetPublicProfessionalSchedule200TimeSlotsItem } from "./getPublicProfessionalSchedule200TimeSlotsItem";
import type { GetPublicProfessionalSchedule200BusinessHours } from "./getPublicProfessionalSchedule200BusinessHours";

export type GetPublicProfessionalSchedule200 = {
  date: string;
  timeSlots: GetPublicProfessionalSchedule200TimeSlotsItem[];
  businessHours?: GetPublicProfessionalSchedule200BusinessHours;
  isHoliday?: boolean;
  holidayReason?: string;
  isClosed?: boolean;
};
