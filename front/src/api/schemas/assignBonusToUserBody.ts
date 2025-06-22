import type { AssignBonusToUserBodyType } from "./assignBonusToUserBodyType";

/**
 * AssignBonusBody
 */
export type AssignBonusToUserBody = {
  userId: string;
  bookingId?: string;
  /** BonusType */
  type: AssignBonusToUserBodyType;
  description?: string;
};
