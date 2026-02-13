import type { GetPublicProfessionalSchedule200TimeSlotsItemBooking } from "./getPublicProfessionalSchedule200TimeSlotsItemBooking";

export type GetPublicProfessionalSchedule200TimeSlotsItem = {
  time: string;
  available: boolean;
  booking?: GetPublicProfessionalSchedule200TimeSlotsItemBooking;
};
