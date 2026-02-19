"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

interface StatusFilterProps {
  value?: string;
  onChange: (value?: string) => void;
  className?: string;
}

export function StatusFilter({ value, onChange, className }: StatusFilterProps) {
  // Quando o usuário muda o valor
  const handleChange = (val: string) => {
    onChange(val === "all" ? undefined : val);
  };

  return (
    <Select
      value={value || "all"}
      onValueChange={handleChange}
    >
      <SelectTrigger className={className ?? "w-32"}>
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All</SelectItem>
        <SelectItem value="active">Active</SelectItem>
        <SelectItem value="inactive">Inactive</SelectItem>
      </SelectContent>
    </Select>
  );
}

