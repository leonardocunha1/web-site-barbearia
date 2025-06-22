import type { GetProfessionalSchedule200TimeSlotsItemBooking } from "./getProfessionalSchedule200TimeSlotsItemBooking";

export type GetProfessionalSchedule200TimeSlotsItem = {
  time: string;
  available: boolean;
  booking?: GetProfessionalSchedule200TimeSlotsItemBooking;
};
