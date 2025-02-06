import { useState } from "react";
import { Stepper, Button } from "@/components";

export default function StepperExample() {
	const [activeStep, setActiveStep] = useState(0);

	const steps = [
		{ title: "Step 1", description: "Create your account" },
		{ title: "Step 2", description: "Add your details" },
		{ title: "Step 3", description: "Confirm your information" },
	];

	const handleNext = () => {
		setActiveStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
	};

	const handlePrevious = () => {
		setActiveStep((prevStep) => Math.max(prevStep - 1, 0));
	};

	return (
		<div className="container mx-auto p-4 space-y-8">
			<Stepper activeStep={activeStep} items={steps} />
			<div className="flex justify-between">
				<Button onClick={handlePrevious} disabled={activeStep === 0}>
					Previous
				</Button>
				<Button onClick={handleNext} disabled={activeStep === steps.length - 1}>
					{activeStep === steps.length - 1 ? "Finish" : "Next"}
				</Button>
			</div>
		</div>
	);
}
