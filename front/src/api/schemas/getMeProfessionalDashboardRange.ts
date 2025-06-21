export type GetMeProfessionalDashboardRange =
  (typeof GetMeProfessionalDashboardRange)[keyof typeof GetMeProfessionalDashboardRange];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetMeProfessionalDashboardRange = {
  today: "today",
  week: "week",
  month: "month",
  custom: "custom",
} as const;
