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
  ACCOUNT: "/conta",
  ACCOUNT_ADMIN: "/conta?tab=admin",
  ACCOUNT_PROFESSIONAL: "/conta?tab=professional",
  ACCOUNT_CLIENT: "/conta?tab=client",
} as const;

export const USER_ROLES = {
  ADMIN: "ADMIN",
  PROFISSIONAL: "PROFISSIONAL",
  CLIENTE: "CLIENTE",
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

export const API_ENDPOINTS = {
  // Auth
  LOGIN: "/auth/login",
  LOGOUT: "/auth/logout",
  VERIFY_EMAIL: "/auth/verify-email",

  // Users
  USERS: "/users",
  USER_PROFILE: "/users/profile",
  USER_ME: "/users/me",

  // Professionals
  PROFESSIONALS: "/professionals",
  PROFESSIONAL_DETAIL: "/professionals/:id",
  PROFESSIONAL_DASHBOARD: "/professionals/:id/dashboard",
  PROFESSIONAL_SCHEDULE: "/professionals/:id/schedule",

  // Services
  SERVICES: "/services",
  SERVICE_DETAIL: "/services/:id",

  // Service Professionals
  SERVICE_PROFESSIONAL: "/service-professional",

  // Bookings
  BOOKINGS: "/bookings",
  BOOKINGS_ME: "/bookings/me",
  BOOKINGS_PROFESSIONAL: "/bookings/:professionalId",
  BOOKING_DETAIL: "/bookings/:bookingId",

  // Holidays
  HOLIDAYS: "/holidays",

  // Business Hours
  BUSINESS_HOURS: "/business-hours",

  // Bonus
  BONUS: "/bonus",

  // Coupons
  COUPONS: "/coupons",
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
