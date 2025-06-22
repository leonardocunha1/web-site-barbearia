export type ListServicesSortOrder =
  (typeof ListServicesSortOrder)[keyof typeof ListServicesSortOrder];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListServicesSortOrder = {
  asc: "asc",
  desc: "desc",
} as const;
