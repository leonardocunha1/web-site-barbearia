'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';

export type SortDirection = 'asc' | 'desc';

export interface TableParams {
  page: number;
  limit: number;
  sortBy: string;
  sortDirection: SortDirection;
  filters: Record<string, string>;
}

export function useTableParams(defaultParams: Partial<TableParams> = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const params = useMemo((): TableParams => {
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sortBy = searchParams.get('sortBy') || defaultParams.sortBy || 'id';
    const sortDirection = (searchParams.get('sortDirection') as SortDirection) || 
                         defaultParams.sortDirection || 'asc';

    const filters: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      if (!['page', 'limit', 'sortBy', 'sortDirection'].includes(key)) {
        filters[key] = value;
      }
    });

    return {
      page: isNaN(page) ? 1 : page,
      limit: isNaN(limit) ? 10 : limit,
      sortBy,
      sortDirection,
      filters,
    };
  }, [searchParams, defaultParams]);

  const updateParams = useCallback((updates: Partial<TableParams>) => {
    const newParams = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (key === 'page') {
        if (value === 1) newParams.delete('page');
        else newParams.set('page', value.toString());
      } 
      else if (key === 'limit') {
        if (value === 10) newParams.delete('limit');
        else newParams.set('limit', value.toString());
      }
      else if (key === 'sortBy') {
        if (!value) newParams.delete('sortBy');
        else newParams.set('sortBy', value.toString());
      }
      else if (key === 'sortDirection') {
        if (value === 'asc') newParams.delete('sortDirection');
        else newParams.set('sortDirection', value.toString());
      }
      else if (key === 'filters') {
        // Remove existing filters
        newParams.forEach((_, key) => {
          if (!['page', 'limit', 'sortBy', 'sortDirection'].includes(key)) {
            newParams.delete(key);
          }
        });
        
        // Add new filters
        Object.entries(value as Record<string, string>).forEach(([filterKey, filterValue]) => {
          if (filterValue) {
            newParams.set(filterKey, filterValue);
          }
        });
      }
    });

    const queryString = newParams.toString();
    const newUrl = queryString ? `?${queryString}` : '';
    
    router.push(newUrl, { scroll: false });
  }, [router, searchParams]);

  return {
    params,
    updateParams,
  };
}