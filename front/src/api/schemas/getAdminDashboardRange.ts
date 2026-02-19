export type GetAdminDashboardRange =
  (typeof GetAdminDashboardRange)[keyof typeof GetAdminDashboardRange];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetAdminDashboardRange = {
  all: "all",
  today: "today",
  week: "week",
  month: "month",
  custom: "custom",
} as const;
