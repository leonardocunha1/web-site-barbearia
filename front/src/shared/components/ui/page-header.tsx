import * as React from "react";

import { cn } from "@/shared/utils/utils";

type PageHeaderProps = {
  title: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
};

export function PageHeader({
  title,
  description,
  icon: Icon,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn(className)}>
      {Icon ? (
        <div className="flex items-center gap-2">
          <Icon className="h-8 w-8 text-stone-600" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-stone-900">
              {title}
            </h1>
            {description ? (
              <p className="mt-1 text-sm text-stone-500">{description}</p>
            ) : null}
          </div>
        </div>
      ) : (
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900">
            {title}
          </h1>
          {description ? (
            <p className="mt-1 text-sm text-stone-500">{description}</p>
          ) : null}
        </div>
      )}
    </div>
  );
}
