import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

export function DatePicker({
	defaultValue,
	handleChangeValue,
	readonly = false,
	fromDate,
}: {
	defaultValue?: Date;
	readonly?: boolean;
	handleChangeValue: (value: Date) => void;
	fromDate?: Date;
}) {
	const [date, setDate] = React.useState<Date | undefined>(
		defaultValue ?? undefined
	);

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					disabled={readonly}
					variant={"outline"}
					className={cn(
						"w-full dark:border-nsone justify-start text-left font-normal bg-transparent  ",
						!date && "text-muted-foreground",
						readonly
							? "border-none border-black/20 shadow-sm   shadow-black/10    "
							: "border-black/20 dark:border-primary/50   "
					)}>
					<CalendarIcon className="mr-2 h-4 w-4" />
					{date ? format(date, "PPP") : <span>Pick a date</span>}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0">
				<Calendar
					mode="single"
					selected={date}
					onSelect={(date) => {
						if (date) {
							setDate(date);
							handleChangeValue(date);
						}
					}}
					fromDate={fromDate}
				/>
			</PopoverContent>
		</Popover>
	);
}
