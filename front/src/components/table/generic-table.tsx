import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { ReactNode } from "react";
import { cn } from "@/utils/cn";

export type Column<T, K extends keyof T = keyof T> = {
  header: string;
  accessor: K;
  render?: (value: T[K], row: T) => ReactNode;
  align?: "left" | "center" | "right";
  width?: string | number;
  className?: string;
};

type GenericTableProps<T> = {
  data: T[];
  columns: Array<Column<T, keyof T>>;
  isLoading?: boolean;
  emptyMessage?: string | ReactNode;
  rowKey?: keyof T | ((row: T) => string | number);
  onRowClick?: (row: T) => void;
  className?: string;
  headerClassName?: string;
  rowClassName?: string | ((row: T) => string);
  cellClassName?: string | ((row: T, column: Column<T, keyof T>) => string);
};

export function GenericTable<T>({
  data,
  columns,
  isLoading = false,
  emptyMessage = "Nenhum dado encontrado",
  rowKey,
  onRowClick,
  className,
  headerClassName,
  rowClassName,
  cellClassName,
}: GenericTableProps<T>) {
  const getRowKey = (row: T, index: number): string => {
    if (rowKey) {
      return typeof rowKey === "function" 
        ? rowKey(row).toString() 
        : row[rowKey]?.toString() ?? index.toString();
    }
    return index.toString();
  };

  const getRowClass = (row: T): string => {
    if (typeof rowClassName === "function") {
      return rowClassName(row);
    }
    return rowClassName || "";
  };

  const getCellClass = (row: T, column: Column<T, keyof T>): string => {
    if (typeof cellClassName === "function") {
      return cellClassName(row, column);
    }
    return cellClassName || "";
  };

  return (
    <div className={cn("overflow-auto", className)}>
      <Table>
        <TableHeader className={headerClassName}>
          <TableRow>
            {columns.map((col, i) => (
              <TableHead 
                key={col.accessor.toString() || i.toString()}
                className={col.className}
                style={{ 
                  width: col.width,
                  textAlign: col.align,
                }}
              >
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array(5).fill(0).map((_, i) => (
              <TableRow key={`skeleton-${i}`}>
                {columns.map((col, j) => (
                  <TableCell key={`skeleton-cell-${i}-${j}`}>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center py-8">
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, rowIndex) => (
              <TableRow
                key={getRowKey(row, rowIndex)}
                onClick={() => onRowClick?.(row)}
                className={cn(
                  getRowClass(row),
                  onRowClick && "cursor-pointer hover:bg-muted/50"
                )}
              >
                {columns.map((col, colIndex) => (
                  <TableCell
                    key={col.accessor.toString() || colIndex.toString()}
                    className={cn(
                      getCellClass(row, col),
                      col.align === "center" && "text-center",
                      col.align === "right" && "text-right"
                    )}
                    style={{ width: col.width }}
                  >
                    {col.render
                      ? col.render(row[col.accessor], row)
                      : (row[col.accessor] as ReactNode)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}