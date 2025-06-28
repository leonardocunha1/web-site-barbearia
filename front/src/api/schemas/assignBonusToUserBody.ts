import type { AssignBonusToUserBodyType } from "./assignBonusToUserBodyType";

/**
 * Dados necessários para atribuição de bônus a um usuário
 */
export type AssignBonusToUserBody = {
  userId: string;
  bookingId?: string;
  /** Tipo de bônus que pode ser atribuído */
  type: AssignBonusToUserBodyType;
  /** @maxLength 255 */
  description?: string;
};
