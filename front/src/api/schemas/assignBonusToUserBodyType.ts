/**
 * Tipo de bônus que pode ser atribuído
 */
export type AssignBonusToUserBodyType =
  (typeof AssignBonusToUserBodyType)[keyof typeof AssignBonusToUserBodyType];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AssignBonusToUserBodyType = {
  BOOKING_POINTS: "BOOKING_POINTS",
  LOYALTY: "LOYALTY",
} as const;
