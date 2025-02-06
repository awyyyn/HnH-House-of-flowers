import React from "react";
import { cn } from "@/lib/utils";
import { Step, type StepProps } from "./step";

export interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
	activeStep: number;
	items: Omit<StepProps, "stepNumber" | "isActive" | "isCompleted">[];
}

export function Stepper({
	activeStep,
	items,
	className,
	...props
}: StepperProps) {
	return (
		<div
			className={cn(
				"flex flesx-col flex-row justify-between items-center overflow-x-auto",
				className
			)}
			{...props}>
			{items.map((item, index) => (
				<React.Fragment key={index}>
					<Step
						{...item}
						stepNumber={index + 1}
						isActive={index === activeStep}
						isCompleted={index < activeStep}
					/>
					{index < items.length - 1 && (
						<div className=" block  min-w-20 h-px bg-muted-foreground/30 mx-4  " />
					)}
				</React.Fragment>
			))}
		</div>
	);
}
