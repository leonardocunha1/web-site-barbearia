/**
 * Tipo de bônus que pode ser atribuído
 */
export type AssignBonusToUserBodyType =
  (typeof AssignBonusToUserBodyType)[keyof typeof AssignBonusToUserBodyType];

 
export const AssignBonusToUserBodyType = {
  BOOKING_POINTS: "BOOKING_POINTS",
  LOYALTY: "LOYALTY",
} as const;
