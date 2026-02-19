export type UpdateServiceByIdBodyType =
  (typeof UpdateServiceByIdBodyType)[keyof typeof UpdateServiceByIdBodyType];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const UpdateServiceByIdBodyType = {
  CORTE: "CORTE",
  BARBA: "BARBA",
  SOBRANCELHA: "SOBRANCELHA",
  ESTETICA: "ESTETICA",
} as const;
