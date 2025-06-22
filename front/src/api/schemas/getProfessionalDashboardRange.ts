export type GetProfessionalDashboardRange =
  (typeof GetProfessionalDashboardRange)[keyof typeof GetProfessionalDashboardRange];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetProfessionalDashboardRange = {
  today: "today",
  week: "week",
  month: "month",
  custom: "custom",
} as const;
