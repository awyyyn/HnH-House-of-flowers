"use client";

import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface TagsInputProps {
  value: string[];
  onChangeValue: (tags: string[]) => void;
  options: string[]; // Added options prop for available tags to select from
  placeholder?: string;
  className?: string;
  maxTags?: number;
}

export function TagsInput({
  value = [],
  onChangeValue,
  options = [], // Added options parameter
  placeholder = "Select a tag...", // Updated placeholder text for select
  className,
  maxTags,
}: TagsInputProps) {
  const [selectedValue, setSelectedValue] = useState<string>(); // Changed from inputValue to selectedValue

  const addTag = () => {
    if (selectedValue && !value.includes(selectedValue)) {
      if (!maxTags || value.length < maxTags) {
        onChangeValue([...value, selectedValue]);
        setSelectedValue("default"); // Reset selection after adding
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChangeValue(value.filter((tag) => tag !== tagToRemove));
  };

  const availableOptions = options.filter((option) => !value.includes(option));

  return (
    <div className={cn("space-y-2", className)}>
      {/* Tags Display */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((tag, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="flex items-center gap-1 px-2 py-1"
            >
              <span>{tag}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => removeTag(tag)}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove {tag} tag</span>
              </Button>
            </Badge>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <Select
          value={selectedValue}
          onValueChange={setSelectedValue}
          disabled={maxTags ? value.length >= maxTags : false}
        >
          <SelectTrigger className="flex-1">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default" disabled key={"default-item"}>
              Select a tag
            </SelectItem>
            {availableOptions.length > 0 ? (
              availableOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))
            ) : (
              <div className="px-2 py-1.5 text-sm text-muted-foreground">
                {maxTags && value.length >= maxTags
                  ? "Maximum tags reached"
                  : "No options available"}
              </div>
            )}
          </SelectContent>
        </Select>
        <Button
          type="button"
          onClick={addTag}
          disabled={
            !selectedValue || (maxTags ? value.length >= maxTags : false)
          } // Updated condition for selectedValue
          size="sm"
        >
          <Plus className="h-4 w-4" />
          <span className="sr-only">Add tag</span>
        </Button>
      </div>

      {/* Helper Text */}
      {maxTags && (
        <p className="text-sm text-muted-foreground">
          {value.length}/{maxTags} tags
        </p>
      )}
    </div>
  );
}
