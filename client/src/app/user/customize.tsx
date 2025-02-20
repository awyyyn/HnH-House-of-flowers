import { Button, Helmet, Stepper } from "@/components";
import PickTheme from "./components/pick-theme";
import { useState } from "react";
import CustomizeFlower from "./components/customize-flower";
import { CustomizationValues } from "@/types";

const steps = [
	{ title: "Step 1", description: "Choose a theme" },
	{ title: "Step 2", description: "Customize your theme" },
	{ title: "Step 3", description: "Review" },
	{ title: "Step 4", description: "Finish" },
];

export default function Customize() {
	const [activeStep, setActiveStep] = useState(0);
	const [values, setValues] = useState<CustomizationValues>({
		wrapper: "",
		color: "",
		mainFlower: "",
		additionalFlower: "",
		tie: "",
	});

	const handleNext = () => {
		setActiveStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
	};

	const handlePrevious = () => {
		setActiveStep((prevStep) => Math.max(prevStep - 1, 0));
	};

	const renderStep = (step: number) => {
		switch (step) {
			case 0:
				return (
					<PickTheme
						selected={values.wrapper}
						handleSelect={(id) => {
							setValues({
								...values,
								wrapper: id,
							});
						}}
					/>
				);
			case 1:
				return (
					<CustomizeFlower
						setValues={setValues}
						values={values}
						selectedWrapper={values.wrapper}
					/>
				);
			default:
				return <div>Step 3</div>;
		}
	};

	return (
		<>
			<Helmet title="Customize" />
			<div className="sm:h-scrseen md:w-scrseen grid place-content-center gap-2 p-5">
				<div className="flex min-w-[95dvw]   sm:min-w-[100dvw] md:min-w-fit   flex-col">
					<Stepper activeStep={activeStep} items={steps}></Stepper>
				</div>
				{renderStep(activeStep)}
				<div className="flex justify-between">
					<Button onClick={handlePrevious} disabled={activeStep === 0}>
						Previous
					</Button>
					<Button
						onClick={handleNext}
						disabled={activeStep === steps.length - 1 || !values.wrapper}>
						{activeStep === steps.length - 1 ? "Finish" : "Next"}
					</Button>
				</div>
			</div>
		</>
	);
}
