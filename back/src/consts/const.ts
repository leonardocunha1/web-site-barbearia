// --- Bônus ---
export const POINTS_PER_10_REAIS = 1;
export const VALUE_PER_POINT = 0.5;
export const LOYALTY_BOOKINGS_REQUIRED = 5;
export const LOYALTY_POINTS = 2;
export const BONUS_EXPIRATION_MONTHS = 6;
export const MIN_POINTS_TO_REDEEM = 10;
export const MIN_BOOKING_VALUE_AFTER_DISCOUNT = 0;

// --- Segurança ---
export const PASSWORD_HASH_ROUNDS = 10;
export const ACCESS_TOKEN_EXPIRATION_SECONDS = 60 * 60;
export const REFRESH_TOKEN_EXPIRATION_SECONDS = 60 * 60 * 24 * 7;
export const PASSWORD_RESET_TOKEN_EXPIRATION_HOURS = 2;
export const EMAIL_VERIFICATION_TOKEN_EXPIRATION_HOURS = 24;

// --- Booking ---
export const SCHEDULE_SLOT_MINUTES = 15;
export const MAX_BOOKING_CANCEL_REASON_LENGTH = 255;
export const MIN_BOOKING_CANCEL_HOURS = 2;

// --- Mensagens de cupom ---
export const COUPON_MESSAGES = {
  INVALID: 'Cupom inválido',
  NOT_YET_VALID: 'Cupom ainda não está válido',
  EXPIRED: 'Cupom expirado',
  MAX_USES_REACHED: 'Limite de usos do cupom atingido',
  ALREADY_USED: 'Este cupom já foi utilizado por você',
} as const;

// --- Mensagens de sistema ---
export const SYSTEM_MESSAGES = {
  BOOKING_AUTO_CANCELED: 'Cancelado automaticamente por falta de confirmação',
} as const;
