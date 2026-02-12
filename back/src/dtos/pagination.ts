/**
 * Generic type for paginated API responses
 * Eliminates duplication across different DTOs
 * 
 * @template T - The type of items in the response
 * 
 * @example
 * ```typescript
 * export type ListUsersResponse = PaginatedResponse<UserDTO>;
 * export type ListBookingsResponse = PaginatedResponse<BookingDTO>;
 * ```
 */
export type PaginatedResponse<T> = {
  /**
   * Array of items for the current page
   */
  items: T[];

  /**
   * Pagination metadata
   */
  pagination: {
    /**
     * Total number of items across all pages
     */
    total: number;

    /**
     * Current page number (1-based)
     */
    page: number;

    /**
     * Number of items per page
     */
    limit: number;

    /**
     * Total number of pages
     */
    totalPages: number;
  };
};

/**
 * Helper to create a paginated response
 * 
 * @template T - The type of items in the response
 * @param items - Array of items for current page
 * @param total - Total number of items
 * @param page - Current page number
 * @param limit - Items per page
 * @returns Formatted paginated response
 * 
 * @example
 * ```typescript
 * return createPaginatedResponse(users, total, page, limit);
 * ```
 */
export function createPaginatedResponse<T>(
  items: T[],
  total: number,
  page: number,
  limit: number,
): PaginatedResponse<T> {
  return {
    items,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Legacy flat format for backward compatibility
 * Used internally by existing use cases
 */
export type FlatPaginatedResponse<T, K extends string> = {
  [key in K]: T[];
} & {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

/**
 * Helper to create paginated response in flat format
 * Used for backward compatibility with existing controllers
 * 
 * @template T - The type of items in the response
 * @template K - The key name for the items array (e.g., 'users', 'bookings')
 * @param key - Property name for items array
 * @param items - Array of items for current page
 * @param total - Total number of items
 * @param page - Current page number
 * @param limit - Items per page
 * @returns Formatted paginated response in flat format
 * 
 * @example
 * ```typescript
 * return createFlatPaginatedResponse('holidays', holidays, total, page, limit);
 * // Returns: { holidays: [...], total: 10, page: 1, limit: 10, totalPages: 1 }
 * ```
 */
export function createFlatPaginatedResponse<T, K extends string>(
  key: K,
  items: T[],
  total: number,
  page: number,
  limit: number,
): FlatPaginatedResponse<T, K> {
  return {
    [key]: items,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  } as FlatPaginatedResponse<T, K>;
}

/**
 * Legacy format for backward compatibility
 * @deprecated Use PaginatedResponse instead
 */
export type LegacyPaginatedResponse<T> = { date: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

/**
 * Converts legacy format to new format
 * @deprecated Temporary helper during migration
 */
export function toLegacyFormat<T>(
  response: PaginatedResponse<T>,
): LegacyPaginatedResponse<T> {
  return { date: response.items,
    total: response.pagination.total,
    page: response.pagination.page,
    limit: response.pagination.limit,
    totalPages: response.pagination.totalPages,
  };
}
