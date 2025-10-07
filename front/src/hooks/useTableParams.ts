"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

export type SortDirection = "asc" | "desc" | null;

export interface TableParams {
  page: number;
  limit: number;
  sortBy?: string | null;
  sortDirection?: SortDirection;
  filters: Record<string, string>;
}

export function useTableParams(defaultParams: Partial<TableParams> = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 🔹 Parse dos parâmetros da URL
  const params = useMemo((): TableParams => {
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const sortBy = searchParams.get("sortBy") || defaultParams.sortBy || null;

    const sortDirectionRaw = searchParams.get("sortDirection");
    const sortDirection =
      sortDirectionRaw === "asc" || sortDirectionRaw === "desc"
        ? (sortDirectionRaw as SortDirection)
        : null;

    const filters: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      if (!["page", "limit", "sortBy", "sortDirection"].includes(key)) {
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

  // 🔹 Função interna para atualizar a URL
  const pushParams = useCallback(
    (paramsToPush: URLSearchParams) => {
      const queryString = paramsToPush.toString();
      const baseUrl = window.location.pathname; // mantém a rota atual
      router.push(queryString ? `?${queryString}` : baseUrl, { scroll: false });
    },
    [router]
  );

  // 🔹 Atualiza parâmetros na URL
  const updateParams = useCallback(
    (updates: Partial<TableParams>) => {
      const newParams = new URLSearchParams(searchParams);

      Object.entries(updates).forEach(([key, value]) => {
        if (key === "page" || key === "limit") {
          if (value == null || (key === "page" && value === 1) || (key === "limit" && value === 10)) {
            newParams.delete(key);
          } else {
            newParams.set(key, value.toString());
          }
        } else if (key === "sortBy") {
          if (!value) {
            newParams.delete("sortBy");
            newParams.delete("sortDirection");
          } else {
            newParams.set("sortBy", value.toString());
          }
        } else if (key === "sortDirection") {
          if (!value) {
            newParams.delete("sortDirection");
          } else {
            newParams.set("sortDirection", value.toString());
          }
        } else if (key === "filters") {
          // Remove filtros antigos
          Object.keys(value as Record<string, string>).forEach((filterKey) => {
            newParams.delete(filterKey);
          });
          // Adiciona novos filtros
          Object.entries(value as Record<string, string>).forEach(([filterKey, filterValue]) => {
            if (filterValue) newParams.set(filterKey, filterValue);
          });
        }
      });

      pushParams(newParams);
    },
    [searchParams, pushParams]
  );

  // 🔹 Limpa apenas a ordenação
  const clearSorting = useCallback(() => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("sortBy");
    newParams.delete("sortDirection");
    pushParams(newParams);
  }, [searchParams, pushParams]);

  return {
    params,
    updateParams,
    clearSorting,
  };
}
