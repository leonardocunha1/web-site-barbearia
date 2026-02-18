/**
 * Intervalos de refetch para queries do React Query
 */
export const REFETCH_INTERVALS = {
  DASHBOARD: 30_000, // 30 segundos
  REAL_TIME: 5_000, // 5 segundos
  SLOW: 60_000, // 1 minuto
  VERY_SLOW: 300_000, // 5 minutos
} as const;

/**
 * Delays e timeouts
 */
export const DELAYS = {
  DEBOUNCE_SEARCH: 300,
  DEBOUNCE_INPUT: 500,
  TOAST_DURATION: 3_000,
  ANIMATION_DURATION: 200,
} as const;
