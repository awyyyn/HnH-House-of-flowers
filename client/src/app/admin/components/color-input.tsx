"use client";

import type React from "react";
import { useState, useCallback } from "react";
import { X, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TextArrayInputProps {
  value: string[];
  onChangeValue: (values: string[]) => void;
  placeholder?: string;
  className?: string;
  maxItems?: number;
  showAbove?: boolean;
}

export function TextArrayInput({
  value = [],
  onChangeValue,
  placeholder = "Enter text and press Enter or click +",
  className,
  maxItems,
  showAbove = true,
}: TextArrayInputProps) {
  const [inputValue, setInputValue] = useState("");

  const addValue = useCallback(() => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !value.includes(trimmedValue)) {
      if (!maxItems || value.length < maxItems) {
        onChangeValue([...value, trimmedValue]);
        setInputValue("");
      }
    }
  }, [inputValue, value, maxItems, onChangeValue]);

  const removeValue = useCallback(
    (valueToRemove: string) => {
      onChangeValue(value.filter((item) => item !== valueToRemove));
    },
    [value, onChangeValue],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        addValue();
      }
    },
    [addValue],
  );

  const renderValuesDisplay = () =>
    value.length > 0 && (
      <div className="flex flex-wrap gap-2">
        {value.map((item) => (
          <Badge
            key={item} // Use item as key instead of index to prevent re-render glitches
            variant="secondary"
            className="flex items-center gap-1 px-2 py-1"
          >
            <span>{item}</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground transition-colors"
              onClick={() => removeValue(item)}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove {item}</span>
            </Button>
          </Badge>
        ))}
      </div>
    );

  return (
    <div className={cn("space-y-3", className)}>
      {showAbove && renderValuesDisplay()}

      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={maxItems ? value.length >= maxItems : false}
          className="flex-1"
        />
        <Button
          type="button"
          onClick={addValue}
          disabled={
            !inputValue.trim() || (maxItems ? value.length >= maxItems : false)
          }
          size="sm"
          className="px-3"
        >
          <Plus className="h-4 w-4" />
          <span className="sr-only">Add item</span>
        </Button>
      </div>

      {!showAbove && renderValuesDisplay()}

      {maxItems && (
        <p className="text-sm text-muted-foreground">
          {value.length}/{maxItems} items
        </p>
      )}
    </div>
  );
}
