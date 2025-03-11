import {
	AuroraBackground,
	Button,
	Helmet,
	Label,
	Stepper,
	Textarea,
	ToggleGroup,
	ToggleGroupItem,
} from "@/components";
import PickTheme from "./components/pick-theme";
import { useState } from "react";
import CustomizeFlower from "./components/customize-flower";
import {
	BouquetItem,
	CustomizationValues,
	DeliveryMethod,
	PaymentMethod,
} from "@/types";
import { DatePicker } from "@/components/custom/date-picker";
import { add } from "date-fns";
import { useQuery } from "@apollo/client";
import { GET_ALL_BOUQUET_ITEMS_QUERY } from "@/queries";

const steps = [
	{ title: "Step 1", description: "Choose a theme" },
	{ title: "Step 2", description: "Customize your theme" },
	{ title: "Step 3", description: "Review" },
	{ title: "Step 4", description: "Finish" },
];

function prepareSvgForColorization(svg: string): string {
	// Replace fill and stroke attributes with currentColor
	return svg.replace(/fill="[^"]*"/g, 'fill="currentColor"');
	// .replace(/stroke="[^"]*"/g, 'stroke="currentColor"');
}

export default function Customize() {
	const [activeStep, setActiveStep] = useState(0);
	const [values, setValues] = useState<CustomizationValues>({
		wrapper: "",
		wrapperColor: "",
		mainFlower: "",
		additionalFlower: [],
		tie: "",
		tieColor: "",
		note: "",
		paymentMethod: "ONLINE_PAYMENT",
		delivery: "PICKUP",
	});
	const { data } = useQuery<{
		bouquetItems: { data: BouquetItem[]; hasNextPage: boolean; total: number };
	}>(GET_ALL_BOUQUET_ITEMS_QUERY, {
		variables: {
			isAvailable: true,
		},
	});

	const wrappers =
		data?.bouquetItems.data.filter((item) => item.type === "WRAPPER") ?? [];

	const flowers =
		data?.bouquetItems.data.filter((item) => item.type === "FLOWER") ?? [];

	const subFlowers =
		data?.bouquetItems.data.filter((item) => item.type === "SUB_FLOWER") ?? [];

	const ties =
		data?.bouquetItems.data.filter((item) => item.type === "TIE") ?? [];

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
						wrappers={wrappers}
						selected={values.wrapper}
						handleSelect={(id) => {
							setValues({
								...values,
								wrapper: id,
								wrapperColor: wrappers.find((wrppr) => wrppr.id === id)!
									.colors[0],
							});
						}}
					/>
				);
			case 1:
				return (
					<CustomizeFlower
						wrappers={wrappers}
						setValues={setValues}
						values={values}
						selectedWrapper={values.wrapper}
						flowers={flowers}
						subFlowers={subFlowers}
						ties={ties}
					/>
				);
			case 2:
				return (
					<div className="space-y-2">
						<AuroraBackground showRadialGradient={false} className="">
							<div className=" relative flex  w-[350px] h-[350px]   overflow-hidden  rounded-xl bg-clip-content">
								{/* <div className="absolute top-5 left-5">
											<ColourfulText text="Preview" className="text-3xl" />
										</div> */}
								{values.additionalFlower &&
									values.additionalFlower.map((adlFlower) => (
										<div
											className="absolute  left-[113px] z-20 top-[76px] w-[166psx] h-[23s0px]"
											// src={
											// 	flowers.find((flower) => flower.id === adlFlower)!
											// 		.svg[0]
											// }

											dangerouslySetInnerHTML={{
												__html: subFlowers.find(
													(subFlwr) => subFlwr.id === adlFlower
												)!.svg[0],
											}}
										/>
									))}
								{values.mainFlower && (
									<div
										className="absolute left-[104px] z-30  top-[39px]  w-[157spx] h-[17s3px]"
										dangerouslySetInnerHTML={{
											__html: flowers.find(
												(flwr) => flwr.id === values.mainFlower
											)!.svg,
										}}
									/>
								)}
								{values.wrapper && (
									<div className="z-10 absolute left-[100px]  top-[62px]  ]">
										<div
											style={{ color: values.wrapperColor || "currentColor" }}
											dangerouslySetInnerHTML={{
												// __html: prepareSvgForColorization(wrapper.svg[0]),
												__html: prepareSvgForColorization(
													wrappers.find(
														(wrapper) => wrapper.id === values.wrapper
													)!.svg[0]
												),
											}}
										/>
									</div>
								)}
								{values.wrapper && (
									<div className="z-40 absolute  left-[100px]  top-[82px]  ">
										<div
											// style={{ color: selectedColors[item.id] || "currentColor" }}
											style={{ color: values.wrapperColor || "red" }}
											dangerouslySetInnerHTML={{
												// __html: prepareSvgForColorization(wrapper.svg[0]),
												__html: prepareSvgForColorization(
													wrappers.find(
														(wrapper) => wrapper.id === values.wrapper
													)!.svg[1]
												),
											}}
										/>
									</div>
								)}
								{values.tie && (
									<div
										className="absolute left-[105px] z-50 top-[61px] ] w-[155spx] h-[14s2px] "
										// src={
										// 	ties.find((flower) => flower.id === values.tie)!.svg[0]
										// }
										dangerouslySetInnerHTML={{
											__html: ties.find((flower) => flower.id === values.tie)!
												.svg[0],
										}}
									/>
								)}
							</div>
						</AuroraBackground>

						<div className="grid px-5 grid-cols-1 md:grid-cols-9">
							<div className="col-span-1 md:col-span-3">
								<Label>Delivery</Label>
								<div className="flex">
									<ToggleGroup
										onValueChange={(value) =>
											setValues((p) => ({
												...p,
												delivery: value as DeliveryMethod,
												paymentMethod: "ONLINE_PAYMENT",
											}))
										}
										value={values.delivery}
										type="single">
										<ToggleGroupItem value="PICKUP" aria-label="Toggle bold">
											<p>Pick up</p>
										</ToggleGroupItem>
										<ToggleGroupItem value="DELIVER" aria-label="Toggle italic">
											<p>Deliver</p>
										</ToggleGroupItem>
									</ToggleGroup>
								</div>
							</div>
							<div className="col-span-1 md:col-span-3">
								<Label>Payment Method</Label>
								<div className="flex">
									<ToggleGroup
										onValueChange={(value) =>
											setValues((val) => ({
												...val,
												paymentMethod: value as PaymentMethod,
											}))
										}
										value={values.paymentMethod}
										type="single">
										<ToggleGroupItem
											value="ONLINE_PAYMENT"
											aria-label="Toggle italic">
											<p>Online Payment</p>
										</ToggleGroupItem>
									</ToggleGroup>
								</div>
							</div>
							<div className="col-span-1 md:col-span-3">
								<Label className="capitalize">
									{values.delivery.toString().toLowerCase()} Date
								</Label>
								<DatePicker
									fromDate={add(new Date(), { days: 1 })}
									defaultValue={add(new Date(), { days: 1 })}
									handleChangeValue={() => {}}
								/>
							</div>
						</div>

						<div className="space-y-2 px-5 pb-5">
							<Label>Note</Label>
							<Textarea
								placeholder="Type your note here..."
								value={values.note}
								onChange={(e) => {
									setValues({
										...values,
										note: e.target.value,
									});
								}}
								className="dark:bg-zinc-800 border-transparent outline-transparent"
							/>
						</div>
					</div>
				);

			case 3:
				return;
			default:
				return null;
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
					<div className="flex items-center gap-2">
						{activeStep < steps.length - 1 && activeStep > 0 && (
							<Button
								variant="outline"
								onClick={() => {
									setValues({
										wrapper: "",
										wrapperColor: "",
										mainFlower: "",
										additionalFlower: [],
										tie: "",
										tieColor: "",
										note: "",
										paymentMethod: "ONLINE_PAYMENT",
										delivery: "PICKUP",
									});
									setActiveStep(0);
								}}>
								Reset
							</Button>
						)}
						<Button
							onClick={handleNext}
							disabled={
								activeStep === 1
									? !values.mainFlower || !values.tie || !values.wrapper
									: false
							}>
							{activeStep === steps.length - 1 ? "Finish" : "Next"}
						</Button>
					</div>
				</div>
			</div>
		</>
	);
}
