"use client";

import { MinusIcon, PlusIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

type Props = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
  label?: string;
};

/** Accessible quantity stepper. Decreasing below the minimum removes the line. */
export function QuantityStepper({ value, onChange, min = 0, max = 9, size = "md", label = "Quantity" }: Props) {
  const buttonSize = size === "sm" ? "h-8 w-8" : "h-11 w-11";
  const valueWidth = size === "sm" ? "w-7" : "w-10";

  return (
    <div className="inline-flex items-center border border-ink-900/20" role="group" aria-label={label}>
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
        className={cn("flex items-center justify-center text-ink-700 transition-colors hover:text-ink-900 disabled:opacity-30", buttonSize)}
      >
        <MinusIcon className="h-3.5 w-3.5" />
      </button>
      <span className={cn("tabular text-center text-sm text-ink-900", valueWidth)} aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
        className={cn("flex items-center justify-center text-ink-700 transition-colors hover:text-ink-900 disabled:opacity-30", buttonSize)}
      >
        <PlusIcon className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
