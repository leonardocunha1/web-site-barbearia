"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { cn } from "@/shared/utils/cn";
import { ReactNode, useCallback, useMemo } from "react";
import { TableControls } from "@/shared/components/table/table-controls";
import { TablePagination } from "@/shared/components/table/table-pagination";
import { ChevronUp, ChevronDown, ArrowUpDown } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/shared/components/ui/tooltip";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

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

  const tableColumns = useMemo<ColumnDef<T>[]>(() => {
    const baseColumns = columns.map((col) => {
      const def: ColumnDef<T> = {
        accessorKey: col.accessor as string,
        header: col.header,
        cell: ({ row, getValue }) =>
          col.render
            ? col.render(getValue() as never, row.original)
            : (getValue() as ReactNode),
        meta: {
          align: col.align,
          width: col.width,
          className: col.className,
        },
      };

      return def;
    });

    if (!actions) return baseColumns;

    const actionsColumn: ColumnDef<T> = {
      id: "actions",
      header: actionsHeader,
      cell: ({ row }) => (
        <div className="flex justify-center">{actions(row.original)}</div>
      ),
      meta: {
        align: "center",
        width: actionsWidth,
        className: "text-center",
      },
    };

    return [...baseColumns, actionsColumn];
  }, [columns, actions, actionsHeader, actionsWidth]);

  const columnById = useMemo(() => {
    const map = new Map<string, Column<T>>();
    columns.forEach((col) => {
      map.set(col.accessor.toString(), col);
    });
    return map;
  }, [columns]);

  const sortingState = useMemo(() => {
    if (!currentSort || !currentSortDirection) return [];
    return [
      { id: currentSort.toString(), desc: currentSortDirection === "desc" },
    ];
  }, [currentSort, currentSortDirection]);

  const table = useReactTable({
    data,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row, index) => getRowKey(row, index),
    state: { sorting: sortingState },
    manualSorting: true,
  });

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
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const meta = header.column.columnDef.meta as
                    | {
                        align?: "left" | "center" | "right";
                        width?: string | number;
                        className?: string;
                      }
                    | undefined;
                  const isSortable = onSort && header.column.id !== "actions";
                  const columnDef = columnById.get(header.column.id);

                  return (
                    <TableHead
                      key={header.id}
                      className={cn(
                        meta?.className,
                        isSortable && "hover:bg-muted/50 cursor-pointer",
                      )}
                      style={{ width: meta?.width, textAlign: meta?.align }}
                    >
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className={cn(
                              "flex items-center gap-1",
                              meta?.align === "center" && "justify-center",
                              meta?.align === "right" && "justify-end",
                            )}
                            onClick={() => {
                              if (!isSortable || !columnDef) return;
                              handleHeaderClick(columnDef);
                            }}
                            role={isSortable ? "button" : undefined}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                            {columnDef && getSortIcon(columnDef)}
                          </div>
                        </TooltipTrigger>
                        {isSortable && (
                          <TooltipContent>Clique para ordenar</TooltipContent>
                        )}
                      </Tooltip>
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isLoading ? (
              Array(5)
                .fill(0)
                .map((_, i) => (
                  <TableRow key={`skeleton-${i}`}>
                    {table.getAllColumns().map((col, j) => (
                      <TableCell key={`skeleton-cell-${i}-${j}`}>
                        <Skeleton className="h-6 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
            ) : table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="py-8 text-center"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={() => onRowClick?.(row.original)}
                  className={cn(
                    typeof rowClassName === "function"
                      ? rowClassName(row.original)
                      : rowClassName,
                    onRowClick && "hover:bg-muted/50 cursor-pointer",
                  )}
                >
                  {row.getVisibleCells().map((cell) => {
                    const meta = cell.column.columnDef.meta as
                      | {
                          align?: "left" | "center" | "right";
                          width?: string | number;
                        }
                      | undefined;

                    return (
                      <TableCell
                        key={cell.id}
                        className={cn(
                          typeof cellClassName === "function"
                            ? cellClassName(
                                row.original,
                                columnById.get(cell.column.id) ??
                                  ({
                                    accessor: cell.column.id,
                                    header: "",
                                  } as Column<T>),
                              )
                            : cellClassName,
                          meta?.align === "center" && "text-center",
                          meta?.align === "right" && "text-right",
                          "text-sm",
                        )}
                        style={{ width: meta?.width }}
                        onClick={(event) => {
                          if (cell.column.id === "actions") {
                            event.stopPropagation();
                          }
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    );
                  })}
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
