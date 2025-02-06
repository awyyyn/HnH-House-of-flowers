import type React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface StepProps extends React.HTMLAttributes<HTMLDivElement> {
	title: string;
	description?: string;
	stepNumber?: number;
	isActive?: boolean;
	isCompleted?: boolean;
}

export function Step({
	title,
	description,
	stepNumber,
	isActive,
	isCompleted,
	className,
	...props
}: StepProps) {
	return (
		<div className="flex flex-col items-center sm:items-start">
			<div
				className={cn(
					"flex items-center   text-center md:text-start min-h-[100px] bg-red-4s00  flex-col sm:flex-row  sm:space-x-4 ",
					isActive && "text-primary",
					isCompleted && "text-primary",
					className
				)}
				{...props}>
				<div
					className={cn(
						"flex items-center justify-center w-8 h-8 rounded-full border-2 min-w-8 min-h-8",
						isActive && "border-primary bg-primary text-primary-foreground",
						isCompleted && "border-primary bg-primary text-primary-foreground",
						!isActive && !isCompleted && "border-primary/30 text-primary/40 "
					)}>
					{isCompleted ? (
						<Check className="w-5 h-5" />
					) : (
						<span className="text-sm font-medium">{stepNumber}</span>
					)}
				</div>
				<div className="space-y-1">
					<p
						className={cn(
							"text-sm font-medium leading-none min-w-[100px]  sm:min-w-0",
							isActive && "text-foreground",
							isCompleted && "text-foreground",
							!isActive && !isCompleted && "text-gray-400"
						)}>
						{title}
					</p>
					{description && (
						<p
							className={cn(
								"text-sm text-muted-foreground",
								isActive && "text-foreground",
								isCompleted && "text-foreground",
								!isActive && !isCompleted && "text-gray-400"
							)}>
							{description}
						</p>
					)}
				</div>
			</div>
		</div>
	);
}
