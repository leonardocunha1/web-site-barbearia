import {
  endOfDay,
  format,
  isValid,
  parse,
  parseISO,
  startOfDay,
} from "date-fns";

type BookingItem = {
  serviceProfessional?: {
    service?: {
      name?: string | null;
    } | null;
  } | null;
};

type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELED" | "COMPLETED";

type DateParts = {
  date: string;
  time: string;
};

export const formatBookingDateTime = (
  isoDateTime?: string | null,
): DateParts => {
  if (!isoDateTime) {
    return { date: "-", time: "-" };
  }

  const parsed = parseISO(isoDateTime);

  return {
    date: format(parsed, "dd/MM/yyyy"),
    time: format(parsed, "HH:mm"),
  };
};

export const formatBookingStatus = (status?: BookingStatus | null) => {
  switch (status) {
    case "CONFIRMED":
      return "Confirmado";
    case "CANCELED":
      return "Cancelado";
    case "COMPLETED":
      return "Concluido";
    case "PENDING":
    default:
      return "Pendente";
  }
};

export const formatBookingServices = (items?: BookingItem[] | null) => {
  if (!items?.length) return "-";

  const names = items
    .map((item) => item.serviceProfessional?.service?.name)
    .filter((name): name is string => Boolean(name));

  return names.length ? names.join(" + ") : "-";
};

const parseDisplayDate = (value?: string | null) => {
  if (!value) return null;
  const parsed = parse(value, "dd/MM/yyyy", new Date());
  return isValid(parsed) ? parsed : null;
};

export const toScheduleDate = (value?: string | null) => {
  const parsed = parseDisplayDate(value);
  return parsed ? format(parsed, "yyyy-MM-dd") : "";
};

export const buildStartDateTime = (
  dateValue?: string | null,
  timeValue?: string | null,
) => {
  const parsedDate = parseDisplayDate(dateValue);
  if (!parsedDate || !timeValue) return "";

  const [hours, minutes] = timeValue.split(":").map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return "";

  const dateTime = new Date(parsedDate);
  dateTime.setHours(hours, minutes, 0, 0);

  return format(dateTime, "yyyy-MM-dd'T'HH:mm:ssXXX");
};

const formatDateWithOffset = (date: Date) =>
  format(date, "yyyy-MM-dd'T'HH:mm:ssXXX");

export const buildDateRangeFilters = (
  startDate?: string | null,
  endDate?: string | null,
) => {
  const parsedStart = startDate ? parseISO(startDate) : null;
  const parsedEnd = endDate ? parseISO(endDate) : null;

  return {
    startDate:
      parsedStart && isValid(parsedStart)
        ? formatDateWithOffset(startOfDay(parsedStart))
        : undefined,
    endDate:
      parsedEnd && isValid(parsedEnd)
        ? formatDateWithOffset(endOfDay(parsedEnd))
        : undefined,
  };
};
