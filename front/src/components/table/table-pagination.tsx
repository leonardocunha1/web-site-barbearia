"use client";

import { Button } from "@/components/ui/button";
import { useTableParams } from "@/hooks/useTableParams";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface TablePaginationProps {
  totalItems: number;
  className?: string;
  compact?: boolean;
}

export function TablePagination({
  totalItems,
  className,
  compact = false,
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

  if (totalItems === 0) {
    return null;
  }

  const getPaginationText = () => {
    if (totalItems === 1) {
      return "1 item";
    } else if (startItem === endItem) {
      return `Item ${startItem} de ${totalItems}`;
    } else if (endItem - startItem + 1 === totalItems) {
      return `${totalItems} itens`;
    } else {
      return `${startItem}-${endItem} de ${totalItems} itens`;
    }
  };

  // 🔥 MELHORIA: Geração inteligente de páginas com ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = compact ? 3 : 5;

    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Sempre mostrar primeira página
    pages.push(1);

    // Lógica para ellipsis no início
    if (params.page > 3) {
      pages.push("left-ellipsis");
    }

    // Páginas ao redor da página atual
    const start = Math.max(2, params.page - 1);
    const end = Math.min(totalPages - 1, params.page + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Lógica para ellipsis no final
    if (params.page < totalPages - 2) {
      pages.push("right-ellipsis");
    }

    // Sempre mostrar última página
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between px-2">
        {/* Texto informativo */}
        <div className="text-muted-foreground text-sm font-medium">
          {getPaginationText()}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            {/* Botão anterior */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(params.page - 1)}
              disabled={!canGoPrevious}
              className={cn(
                "h-8 w-8 p-0 transition-all",
                !canGoPrevious && "cursor-not-allowed opacity-50",
                canGoPrevious && "hover:border-blue-300 hover:bg-blue-50",
              )}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* Botões de página com ellipsis */}
            <div className="mx-2 flex items-center gap-1">
              {pageNumbers.map((pageNum, index) => {
                if (typeof pageNum === "string") {
                  return (
                    <div
                      key={index}
                      className="flex h-8 w-8 items-center justify-center"
                    >
                      <MoreHorizontal className="text-muted-foreground h-4 w-4" />
                    </div>
                  );
                }

                const isActive = params.page === pageNum;

                return (
                  <Button
                    key={pageNum}
                    variant={isActive ? "default" : "outline"}
                    size="sm"
                    onClick={() => goToPage(pageNum)}
                    disabled={isActive}
                    className={cn(
                      "h-8 min-w-8 px-2 font-medium transition-all",
                      isActive
                        ? "cursor-default border-blue-600 bg-blue-600 text-white shadow-sm"
                        : "text-muted-foreground hover:border-blue-300 hover:bg-blue-50",
                    )}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>

            {/* Botão próximo */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(params.page + 1)}
              disabled={!canGoNext}
              className={cn(
                "h-8 w-8 p-0 transition-all",
                !canGoNext && "cursor-not-allowed opacity-50",
                canGoNext && "hover:border-blue-300 hover:bg-blue-50",
              )}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* 🔥 NOVO: Indicador visual de progresso (opcional) */}
      {totalPages > 1 && (
        <div className="mt-2 px-2">
          <div className="h-1 w-full rounded-full bg-gray-200">
            <div
              className="h-1 rounded-full bg-blue-600 transition-all duration-300"
              style={{
                width: `${(params.page / totalPages) * 100}%`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
