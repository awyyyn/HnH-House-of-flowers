"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib";

interface DatePickerProps {
  onChange?: (date: Date | undefined) => void;
  value?: Date | undefined;
  className?: string;
  isEditing?: boolean;
}

export function DatePicker({
  onChange,
  value,
  className,
  isEditing,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(value);

  React.useEffect(() => {
    if (date && onChange) {
      onChange(date);
    }
  }, [date]);

  console.log(date, "qqqqqq", value, "qew");

  return (
    <div className="flex flex-col gap-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            disabled={!isEditing}
            variant="outline"
            id="date"
            className={cn("w-full justify-between font-normal ", className)}
          >
            {date ? date.toLocaleDateString() : "Select date"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            endMonth={new Date(new Date().getFullYear() - 16, 0)}
            captionLayout="dropdown"
            onSelect={(date) => {
              setDate(date);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
