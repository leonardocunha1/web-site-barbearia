/**
 * Utility functions for sanitizing and transforming DTOs
 */

/**
 * Fields that should be omitted from user responses for security
 */
const SENSITIVE_USER_FIELDS = ['senha', 'password'] as const;

/**
 * Omits sensitive fields from an object
 * 
 * @template T - The object type
 * @template K - Keys to omit
 * @param obj - Source object
 * @param keys - Array of keys to omit
 * @returns New object without specified keys
 * 
 * @example
 * ```typescript
 * const user = { id: '1', email: 'test@test.com', senha: 'hash' };
 * const safe = omit(user, ['senha']); // { id: '1', email: 'test@test.com' }
 * ```
 */
export function omit<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[],
): Omit<T, K> {
  const result = { ...obj };
  keys.forEach((key) => delete result[key]);
  return result;
}

/**
 * Picks only specified fields from an object
 * 
 * @template T - The object type
 * @template K - Keys to pick
 * @param obj - Source object
 * @param keys - Array of keys to pick
 * @returns New object with only specified keys
 * 
 * @example
 * ```typescript
 * const user = { id: '1', email: 'test@test.com', senha: 'hash' };
 * const safe = pick(user, ['id', 'email']); // { id: '1', email: 'test@test.com' }
 * ```
 */
export function pick<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[],
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach((key) => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
}

/**
 * Removes password/sensitive fields from user object
 * 
 * @template T - User object type
 * @param user - User object (potentially with password)
 * @returns User object without sensitive fields
 * 
 * @example
 * ```typescript
 * const safeUser = sanitizeUser(userFromDB);
 * ```
 */
export function sanitizeUser<T extends Record<string, any>>(
  user: T,
): Omit<T, (typeof SENSITIVE_USER_FIELDS)[number]> {
  return omit(user, SENSITIVE_USER_FIELDS as any);
}

/**
 * Converts null to undefined for optional fields
 * Useful for JSON responses where undefined is preferred
 * 
 * @param value - Value to convert
 * @returns undefined if null, otherwise the value
 */
export function nullToUndefined<T>(value: T | null): T | undefined {
  return value === null ? undefined : value;
}

/**
 * Deep sanitizes an object by removing sensitive fields recursively
 * 
 * @param obj - Object to sanitize
 * @returns Sanitized object
 */
export function deepSanitize<T extends Record<string, any>>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => deepSanitize(item)) as any;
  }

  const result = {} as T;
  for (const [key, value] of Object.entries(obj)) {
    // Skip sensitive fields
    if (SENSITIVE_USER_FIELDS.includes(key as any)) {
      continue;
    }

    // Recursively sanitize nested objects
    if (value && typeof value === 'object') {
      result[key as keyof T] = deepSanitize(value);
    } else {
      result[key as keyof T] = value;
    }
  }

  return result;
}

/**
 * Transforms object by applying mapper function to all values
 * 
 * @template T - Object type
 * @param obj - Source object
 * @param mapper - Function to transform each value
 * @returns Transformed object
 */
export function mapValues<T extends Record<string, any>>(
  obj: T,
  mapper: (value: any, key: string) => any,
): T {
  const result = {} as T;
  for (const [key, value] of Object.entries(obj)) {
    result[key as keyof T] = mapper(value, key);
  }
  return result;
}
