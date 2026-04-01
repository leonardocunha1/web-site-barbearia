/**
 * Application constants
 * Centralized configuration values
 */

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  ACCOUNT: "/cliente",
  ACCOUNT_ADMIN: "/cliente?tab=admin",
  ACCOUNT_PROFESSIONAL: "/cliente?tab=professional",
  ACCOUNT_CLIENT: "/cliente?tab=client",
} as const;

export const USER_ROLES = {
  ADMIN: "ADMIN",
  PROFESSIONAL: "PROFESSIONAL",
  CLIENT: "CLIENT",
} as const;

export const BOOKING_STATUS = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  CANCELED: "CANCELED",
  COMPLETED: "COMPLETED",
} as const;

export const BOOKING_STATUS_LABELS = {
  PENDING: "Pendente",
  CONFIRMED: "Confirmado",
  CANCELED: "Cancelado",
  COMPLETED: "Concluído",
} as const;

export const PAGINATION_DEFAULTS = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

export const VALIDATION_RULES = {
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  EMAIL_MAX_LENGTH: 255,
  PHONE_LENGTH: 11,
  PASSWORD_MIN_LENGTH: 8,
  SKILL_MAX_LENGTH: 50,
  NOTES_MAX_LENGTH: 500,
} as const;
