export type GetProfessionalDashboardRange =
  (typeof GetProfessionalDashboardRange)[keyof typeof GetProfessionalDashboardRange];

 
export const GetProfessionalDashboardRange = {
  today: "today",
  week: "week",
  month: "month",
  custom: "custom",
} as const;
