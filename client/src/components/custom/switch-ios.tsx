"use client";

import type * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

interface IOSSwitchProps
  extends React.ComponentProps<typeof SwitchPrimitive.Root> {
  size?: "sm" | "md" | "lg";
}

function IOSSwitch({ className, size = "md", ...props }: IOSSwitchProps) {
  const sizeClasses = {
    sm: "h-6 w-10",
    md: "h-8 w-14",
    lg: "h-10 w-16",
  };

  const thumbSizeClasses = {
    sm: "size-5",
    md: "size-7",
    lg: "size-9",
  };

  return (
    <SwitchPrimitive.Root
      className={cn(
        // Base styles with iOS-specific design
        "peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50",
        // iOS-style colors and shadows
        "data-[state=checked]:bg-[#f82162] data-[state=unchecked]:bg-gray-300",
        "dark:data-[state=checked]:bg-[#f82162] dark:data-[state=unchecked]:bg-gray-600",
        "shadow-inner",
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          // iOS-style thumb with shadow and smooth animation
          "pointer-events-none block rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 ease-in-out",
          "data-[state=checked]:translate-x-6 data-[state=unchecked]:translate-x-0",
          // Size-specific positioning
          size === "sm" && "data-[state=checked]:translate-x-4",
          size === "md" && "data-[state=checked]:translate-x-6",
          size === "lg" && "data-[state=checked]:translate-x-6",
          thumbSizeClasses[size],
        )}
      />
    </SwitchPrimitive.Root>
  );
}

interface IOSSwitchWithLabelsProps extends IOSSwitchProps {
  leftLabel?: string;
  rightLabel?: string;
}

function IOSSwitchWithLabels({
  leftLabel = "No",
  rightLabel = "Yes",
  className,
  ...props
}: IOSSwitchWithLabelsProps) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={cn(
          "transition-all duration-300 ease-in-out select-none",
          !props.checked
            ? "font-bold text-base scale-110 text-gray-900 dark:text-white"
            : "font-normal text-sm scale-100 opacity-60 text-gray-500 dark:text-gray-400",
        )}
      >
        {leftLabel}
      </span>
      <IOSSwitch
        className={cn(
          "transition-all duration-300 ease-out hover:scale-105 active:scale-95",
          className,
        )}
        {...props}
      />
      <span
        className={cn(
          "transition-all duration-300 ease-in-out select-none",
          props.checked
            ? "font-bold text-base scale-110 text-gray-900 dark:text-white"
            : "font-normal text-sm scale-100 opacity-60 text-gray-500 dark:text-gray-400",
        )}
      >
        {rightLabel}
      </span>
    </div>
  );
}

export { IOSSwitch, IOSSwitchWithLabels };
