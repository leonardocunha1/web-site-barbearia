"use client";

import { ArrowRight, Check } from "lucide-react";
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
  return (
    <div className={cn("w-full", className)}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;

          return (
            <div key={index} className="flex flex-1 items-center">
              <div className="flex w-full items-center gap-3 sm:flex-col sm:items-center">
                <div
                  className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-full border-2 font-semibold transition-all",
                    {
                      "border-amber-500 bg-amber-500 text-white shadow-lg shadow-amber-200/60":
                        isCompleted,
                      "border-amber-500 bg-white text-amber-600 ring-2 ring-amber-200":
                        isActive && !isCompleted,
                      "border-stone-300 bg-white text-stone-400":
                        !isActive && !isCompleted,
                    },
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span>{stepNumber}</span>
                  )}
                </div>
                <div className="flex flex-col sm:items-center sm:text-center">
                  <p
                    className={cn("text-sm font-semibold", {
                      "text-amber-700": isActive,
                      "text-stone-900": !isActive && isCompleted,
                      "text-stone-400": !isActive && !isCompleted,
                    })}
                  >
                    {step.title}
                  </p>
                  {step.description && (
                    <p className="text-muted-foreground mt-1 text-xs">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>

              {index < steps.length - 1 && (
                <div className="hidden flex-1 items-center px-2 sm:flex">
                  <div
                    className={cn("h-0.5 flex-1 rounded-full transition-all", {
                      "bg-gradient-to-r from-amber-400 to-orange-500":
                        isCompleted,
                      "bg-stone-300": !isCompleted,
                    })}
                  />
                  <ArrowRight
                    className={cn("ml-2 h-4 w-4", {
                      "text-amber-500": isCompleted,
                      "text-stone-300": !isCompleted,
                    })}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
