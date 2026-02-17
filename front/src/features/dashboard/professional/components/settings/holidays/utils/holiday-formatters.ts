import { format, parseISO } from "date-fns";

export const formatHolidayDate = (value?: string | null) => {
  if (!value) return "-";
  const parsed = parseISO(value);
  return format(parsed, "dd/MM/yyyy");
};

export const buildHolidayDateTime = (value: string) => {
  const date = new Date(`${value}T00:00:00`);
  return date.toISOString();
};
