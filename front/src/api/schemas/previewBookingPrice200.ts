/**
 * Resumo de preço do agendamento
 */
export type PreviewBookingPrice200 = {
  /** @minimum 0 */
  totalValue: number;
  /** @minimum 0 */
  couponDiscount: number;
  /** @minimum 0 */
  pointsDiscount: number;
  /** @minimum 0 */
  pointsUsed: number;
  /** @minimum 0 */
  finalValue: number;
};
