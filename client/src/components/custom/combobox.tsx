"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	Button,
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "../index";

export function Combobox({
	choices,
	readonly = false,
	name = "",
	handleSelect,
	defaultValue,
}: {
	choices: {
		value: string;
		id: string;
		label: string;
	}[];
	defaultValue?: string;
	readonly?: boolean;
	name?: string;
	handleSelect: (value: string) => void;
}) {
	const [open, setOpen] = React.useState(false);
	const [value, setValue] = React.useState(defaultValue);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger
				asChild
				className={`dark:border-primary/50 dark:bg-transparent border-black/20`}>
				<Button
					variant={"outline"}
					role="combobox"
					disabled={readonly}
					aria-expanded={open}
					className={`w-full justify-between    `}>
					{value
						? choices.find((item) => item.id === value)?.label
						: `Select ${name && name}`}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>

			<PopoverContent className="w-full  min-w-[300px] md:min-w-[450px] p-0">
				<Command>
					<CommandInput
						defaultValue={defaultValue}
						placeholder={`Search ${name && name}`}
					/>
					<CommandList>
						<CommandEmpty>No {name ? name : "data"} found.</CommandEmpty>
						<CommandGroup>
							{choices.map((framework) => (
								<CommandItem
									key={framework.value}
									value={framework.value}
									defaultValue={defaultValue}
									defaultChecked={framework.value === defaultValue}
									onSelect={(currentValue) => {
										setValue(currentValue === value ? "" : currentValue);
										setOpen(false);
										handleSelect(currentValue);
									}}>
									<Check
										className={cn(
											"mr-2 h-4 w-4",
											value === framework.value ? "opacity-100" : "opacity-0"
										)}
									/>
									{framework.label}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
