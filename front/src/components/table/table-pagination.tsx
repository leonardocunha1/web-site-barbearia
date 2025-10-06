"use client";

import { Button } from "@/components/ui/button";
import { useTableParams } from "@/hooks/useTableParams";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TablePaginationProps {
  totalItems: number;
  className?: string;
}

export function TablePagination({
  totalItems,
  className,
}: TablePaginationProps) {
  const { params, updateParams } = useTableParams();

  const totalPages = Math.ceil(totalItems / params.limit);
  const startItem = (params.page - 1) * params.limit + 1;
  const endItem = Math.min(params.page * params.limit, totalItems);

  const canGoPrevious = params.page > 1;
  const canGoNext = params.page < totalPages;

  const goToPage = (page: number) => {
    updateParams({ page });
  };

  if (totalItems === 0) return null;

  return (
    <div className={className}>
      <div className="flex items-center justify-between">
        <div className="text-muted-foreground text-sm">
          Mostrando {startItem}-{endItem} de {totalItems} itens
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(params.page - 1)}
            disabled={!canGoPrevious}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number;

              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (params.page <= 3) {
                pageNum = i + 1;
              } else if (params.page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = params.page - 2 + i;
              }

              return (
                <Button
                  key={pageNum}
                  variant={params.page === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => goToPage(pageNum)}
                  className="h-8 w-8 p-0"
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(params.page + 1)}
            disabled={!canGoNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
