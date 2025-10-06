"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTableParams } from "@/hooks/useTableParams";
import { Search } from "lucide-react";
import { ReactNode } from "react";

interface TableControlsProps {
  searchPlaceholder?: string;
  searchKey?: string;
  limitOptions?: number[];
  onSearch?: (value: string) => void;
  children?: ReactNode;
}

export function TableControls({
  searchPlaceholder = "Pesquisar...",
  searchKey = "search",
  limitOptions = [10, 25, 50, 100],
  onSearch,
  children,
}: TableControlsProps) {
  const { params, updateParams } = useTableParams();

  const handleSearch = (value: string) => {
    updateParams({
      page: 1,
      filters: {
        ...params.filters,
        [searchKey]: value,
      },
    });
    onSearch?.(value);
  };

  return (
    <div className="mb-4 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
      <div className="flex w-full flex-1 gap-2 sm:w-auto">
        <div className="relative max-w-sm flex-1">
          <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
          <Input
            placeholder={searchPlaceholder}
            value={params.filters[searchKey] || ""}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        {children}
      </div>

      <div className="flex items-center gap-2">
        <span className="text-muted-foreground text-sm">Por página:</span>
        <Select
          value={params.limit.toString()}
          onValueChange={(value) =>
            updateParams({ limit: parseInt(value), page: 1 })
          }
        >
          <SelectTrigger className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {limitOptions.map((option) => (
              <SelectItem key={option} value={option.toString()}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
