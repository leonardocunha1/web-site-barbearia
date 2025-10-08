"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/utils/cn";
import { ReactNode, useCallback } from "react";
import { TableControls } from "@/components/table/table-controls";
import { TablePagination } from "@/components/table/table-pagination";
import { ChevronUp, ChevronDown, ArrowUpDown } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

export type Column<T, K extends keyof T = keyof T> = {
  header: string;
  accessor: K;
  render?: (value: T[K], row: T) => ReactNode;
  align?: "left" | "center" | "right";
  width?: string | number;
  className?: string;
};

export type SortDirection = "asc" | "desc" | null;

type GenericTableProps<T> = {
  data: T[];
  columns: Column<T>[];
  totalItems?: number;
  isLoading?: boolean;
  emptyMessage?: string | ReactNode;
  rowKey?: keyof T | ((row: T) => string | number);
  onRowClick?: (row: T) => void;
  className?: string;
  headerClassName?: string;
  rowClassName?: string | ((row: T) => string);
  cellClassName?: string | ((row: T, col: Column<T>) => string);
  actions?: (row: T) => ReactNode;
  actionsHeader?: string;
  actionsWidth?: string | number;
  showControls?: boolean;
  showPagination?: boolean;
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  controlsChildren?: ReactNode;
  onSort?: (column: keyof T | null, direction: SortDirection) => void;
  currentSort?: keyof T | null;
  currentSortDirection?: SortDirection;
};

export function GenericTable<T>({
  data,
  columns,
  totalItems,
  isLoading = false,
  emptyMessage = "Nenhum dado encontrado",
  rowKey,
  onRowClick,
  className,
  headerClassName,
  rowClassName,
  cellClassName,
  actions,
  actionsHeader = "Ações",
  actionsWidth = "120px",
  showControls = false,
  showPagination = false,
  searchPlaceholder = "Pesquisar...",
  onSearch,
  controlsChildren,
  onSort,
  currentSort = null,
  currentSortDirection = null,
}: GenericTableProps<T>) {
  const getRowKey = useCallback(
    (row: T, index: number) =>
      typeof rowKey === "function"
        ? rowKey(row).toString()
        : rowKey
          ? (row[rowKey] as unknown as string)
          : index.toString(),
    [rowKey],
  );

  const handleHeaderClick = (col: Column<T>) => {
    if (!onSort) return;

    let newDirection: SortDirection = "asc";

    if (currentSort === col.accessor) {
      if (currentSortDirection === "asc") newDirection = "desc";
      else if (currentSortDirection === "desc") newDirection = null;
    }

    onSort(newDirection ? col.accessor : null, newDirection);
  };

  const getSortIcon = (col: Column<T>) => {
    if (!onSort) return null;
    if (currentSort !== col.accessor || !currentSortDirection)
      return <ArrowUpDown className="text-muted-foreground h-4 w-4" />;
    return currentSortDirection === "asc" ? (
      <ChevronUp className="text-muted-foreground h-4 w-4" />
    ) : (
      <ChevronDown className="text-muted-foreground h-4 w-4" />
    );
  };

  const renderCell = (row: T, col: Column<T>) =>
    col.render
      ? col.render(row[col.accessor], row)
      : (row[col.accessor] as ReactNode);

  return (
    <div className={cn("space-y-4", className)}>
      {showControls && (
        <TableControls
          searchPlaceholder={searchPlaceholder}
          onSearch={onSearch}
        >
          {controlsChildren}
        </TableControls>
      )}

      <div className="overflow-auto rounded-lg border">
        <Table>
          <TableHeader className={headerClassName}>
            <TableRow>
              {columns.map((col, i) => (
                <TableHead
                  key={col.accessor.toString() || i}
                  className={cn(
                    col.className,
                    onSort && "hover:bg-muted/50 cursor-pointer",
                  )}
                  style={{ width: col.width, textAlign: col.align }}
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className={cn(
                          "flex items-center gap-1",
                          col.align === "center" && "justify-center",
                          col.align === "right" && "justify-end",
                        )}
                        onClick={() => handleHeaderClick(col)}
                        role={onSort ? "button" : undefined}
                      >
                        {col.header}
                        {getSortIcon(col)}
                      </div>
                    </TooltipTrigger>
                    {onSort && (
                      <TooltipContent>Clique para ordenar</TooltipContent>
                    )}
                  </Tooltip>
                </TableHead>
              ))}
              {actions && (
                <TableHead
                  className="text-center"
                  style={{ width: actionsWidth, textAlign: "center" }}
                >
                  {actionsHeader}
                </TableHead>
              )}
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              Array(5)
                .fill(0)
                .map((_, i) => (
                  <TableRow key={`skeleton-${i}`}>
                    {columns.map((col, j) => (
                      <TableCell key={`skeleton-cell-${i}-${j}`}>
                        <Skeleton className="h-6 w-full" />
                      </TableCell>
                    ))}
                    {actions && (
                      <TableCell>
                        <Skeleton className="h-6 w-full" />
                      </TableCell>
                    )}
                  </TableRow>
                ))
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="py-8 text-center"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, rowIndex) => (
                <TableRow
                  key={getRowKey(row, rowIndex)}
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    rowClassName,
                    onRowClick && "hover:bg-muted/50 cursor-pointer",
                  )}
                >
                  {columns.map((col, colIndex) => (
                    <TableCell
                      key={col.accessor.toString() || colIndex}
                      className={cn(
                        typeof cellClassName === "function"
                          ? cellClassName(row, col)
                          : cellClassName,
                        col.align === "center" && "text-center",
                        col.align === "right" && "text-right",
                      )}
                      style={{ width: col.width }}
                    >
                      {renderCell(row, col)}
                    </TableCell>
                  ))}
                  {actions && (
                    <TableCell
                      className="text-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex justify-center">{actions(row)}</div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {showPagination && totalItems! > 0 ? (
        <TablePagination totalItems={totalItems ?? 0} />
      ) : null}
    </div>
  );
}
