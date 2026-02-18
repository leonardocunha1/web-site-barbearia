/**
 * Formatos de data padrão
 */
export const DATE_FORMATS = {
  ISO_DATE: "yyyy-MM-dd",
  BR_DATE: "dd/MM/yyyy",
  DISPLAY_DATE: "dd 'de' MMMM 'de' yyyy",
  DISPLAY_DATE_SHORT: "dd/MM",
  ISO_DATETIME: "yyyy-MM-dd'T'HH:mm:ss",
} as const;

/**
 * Formatos de hora
 */
export const TIME_FORMATS = {
  HOUR_MINUTE: "HH:mm",
  FULL: "HH:mm:ss",
} as const;
