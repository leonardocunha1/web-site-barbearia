export type CreateServiceBodyType =
  (typeof CreateServiceBodyType)[keyof typeof CreateServiceBodyType];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const CreateServiceBodyType = {
  CORTE: "CORTE",
  BARBA: "BARBA",
  SOBRANCELHA: "SOBRANCELHA",
  ESTETICA: "ESTETICA",
} as const;
