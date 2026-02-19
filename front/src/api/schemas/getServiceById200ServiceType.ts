export type GetServiceById200ServiceType =
  (typeof GetServiceById200ServiceType)[keyof typeof GetServiceById200ServiceType];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetServiceById200ServiceType = {
  CORTE: "CORTE",
  BARBA: "BARBA",
  SOBRANCELHA: "SOBRANCELHA",
  ESTETICA: "ESTETICA",
} as const;
