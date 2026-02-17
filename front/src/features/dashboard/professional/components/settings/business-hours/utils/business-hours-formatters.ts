export const weekDayLabels = [
  "Domingo",
  "Segunda",
  "Terca",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sabado",
];

export const formatWeekDay = (dayOfWeek?: number | null) => {
  if (dayOfWeek == null) return "-";
  return weekDayLabels[dayOfWeek] ?? "-";
};

export const formatBreakTime = (start?: string | null, end?: string | null) => {
  if (!start || !end) return "-";
  return `${start} - ${end}`;
};
