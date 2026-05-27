"use client";

import { CheckIcon } from "@phosphor-icons/react";
import { cn } from "@/shared/utils/cn";

export interface Step {
  title: string;
  description?: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export function Stepper({ steps, currentStep, className }: StepperProps) {
  const progress =
    steps.length > 1 ? (currentStep / (steps.length - 1)) * 100 : 0;

  return (
    <div className={cn("w-full", className)}>
      {/* Progress bar (barber-pole inspired) */}
      <div className="relative mb-6 h-1.5 w-full bg-foreground/10">
        <div
          className="bg-cobre-600 absolute inset-y-0 left-0 transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ width: `${progress}%` }}
        />
      </div>

      <ol className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
        {steps.map((step, index) => {
          const stepNumber = String(index + 1).padStart(2, "0");
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;

          return (
            <li
              key={index}
              className={cn(
                "flex flex-col gap-2 border-t-2 pt-3 transition-colors",
                {
                  "border-cobre-600": isActive || isCompleted,
                  "border-foreground/15": !isActive && !isCompleted,
                },
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className={cn(
                    "font-mono text-xs font-bold tracking-widest",
                    {
                      "text-cobre-700": isActive,
                      "text-foreground": isCompleted,
                      "text-foreground/40": !isActive && !isCompleted,
                    },
                  )}
                >
                  {stepNumber}
                </span>
                {isCompleted && (
                  <CheckIcon
                    weight="bold"
                    className="text-cobre-700 h-3.5 w-3.5"
                  />
                )}
              </div>
              <div className="flex flex-col gap-0.5">
                <p
                  className={cn("text-sm font-semibold tracking-tight", {
                    "text-foreground": isActive || isCompleted,
                    "text-foreground/40": !isActive && !isCompleted,
                  })}
                >
                  {step.title}
                </p>
                {step.description && (
                  <p
                    className={cn(
                      "text-xs leading-snug transition-colors",
                      isActive
                        ? "text-foreground/70"
                        : "text-foreground/40",
                    )}
                  >
                    {step.description}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
