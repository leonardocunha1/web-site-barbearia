import { useGetPublicProfessionalSchedule } from "@/api";
import { toScheduleDate } from "../utils/booking-formatters";

interface UseProfessionalScheduleParams {
  professionalId: string;
  date: string;
  serviceIds?: string[];
}

export function useProfessionalSchedule({
  professionalId,
  date,
  serviceIds,
}: UseProfessionalScheduleParams) {
  const scheduleDate = toScheduleDate(date);
  const queryEnabled = Boolean(
    professionalId && scheduleDate && serviceIds && serviceIds.length > 0,
  );

  const scheduleQuery = useGetPublicProfessionalSchedule(
    professionalId,
    {
      date: scheduleDate,
      serviceIds: queryEnabled
        ? (JSON.stringify(serviceIds) as any)
        : undefined,
    },
    {
      query: {
        enabled: queryEnabled,
      },
    },
  );

  return scheduleQuery;
}
