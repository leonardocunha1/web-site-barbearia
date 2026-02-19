export type ListServices200ServicesItemType =
  (typeof ListServices200ServicesItemType)[keyof typeof ListServices200ServicesItemType];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListServices200ServicesItemType = {
  CORTE: "CORTE",
  BARBA: "BARBA",
  SOBRANCELHA: "SOBRANCELHA",
  ESTETICA: "ESTETICA",
} as const;
