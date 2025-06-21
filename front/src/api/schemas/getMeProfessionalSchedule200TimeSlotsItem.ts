import type { GetMeProfessionalSchedule200TimeSlotsItemBooking } from "./getMeProfessionalSchedule200TimeSlotsItemBooking";

export type GetMeProfessionalSchedule200TimeSlotsItem = {
  time: string;
  available: boolean;
  booking?: GetMeProfessionalSchedule200TimeSlotsItemBooking;
};
