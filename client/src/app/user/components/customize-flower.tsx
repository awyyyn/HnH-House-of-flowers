import {
	Wrapper,
	StickyScroll,
	AuroraBackground,
	ToggleGroup,
	ToggleGroupItem,
} from "@/components";
import { additionalFlowers, mainFlowers, ties, wrappers } from "@/constants";
import { CustomizationValues } from "@/types";
import { Dispatch, SetStateAction } from "react";

interface CustomizeFlowerProps {
	selectedWrapper: string;
	values: CustomizationValues;
	setValues: Dispatch<SetStateAction<CustomizationValues>>;
}

export default function CustomizeFlower({
	selectedWrapper,
	setValues,
	values,
}: CustomizeFlowerProps) {
	const handleSetValue = (name: keyof typeof values, value: string) => {
		setValues((vals) => ({
			...vals,
			[name]: value,
		}));
	};

	const LeftContent = () => {
		return (
			<div className=" space-y-3 justify-self-start">
				<div className="space-y-1">
					<h1>Wrapper</h1>
					<ToggleGroup
						className="justify-start"
						type="single"
						unselectable="on"
						value={values.wrapper}
						onValueChange={(value) => {
							if (value) {
								handleSetValue("wrapper", value);
							}
						}}>
						{wrappers.map((wrapper) => (
							<ToggleGroupItem
								key={wrapper.id}
								value={wrapper.id}
								className={`${
									wrapper.id === values.wrapper
										? "text-gray-900"
										: " text-gray-500"
								}  font-normal`}>
								{wrapper.name}
							</ToggleGroupItem>
						))}
					</ToggleGroup>
				</div>

				<div className="space-y-1">
					<h1>Main Flower</h1>
					<ToggleGroup
						className="justify-start"
						type="single"
						unselectable="on"
						value={values.mainFlower}
						onValueChange={(value) => {
							if (value) {
								handleSetValue("mainFlower", value);
							}
						}}>
						{mainFlowers.map((flower) => (
							<ToggleGroupItem
								key={flower.id}
								value={flower.id}
								className={`${
									flower.id === values.mainFlower
										? "text-gray-900"
										: " text-gray-500"
								}  font-normal`}>
								{flower.title}
							</ToggleGroupItem>
						))}
					</ToggleGroup>
				</div>

				<hr />

				<div className="space-y-1">
					<h1>Additional Flower</h1>
					<ToggleGroup
						className="justify-start"
						type="single"
						unselectable="on"
						value={values.additionalFlower}
						onValueChange={(value) => {
							if (value) {
								handleSetValue("additionalFlower", value);
							}
						}}>
						{additionalFlowers.map((flower) => (
							<ToggleGroupItem
								key={flower.id}
								value={flower.id}
								className={`${
									flower.id === values.additionalFlower
										? "text-gray-900"
										: " text-gray-500"
								}  font-normal`}>
								{flower.title}
							</ToggleGroupItem>
						))}
					</ToggleGroup>
				</div>

				<hr />

				<div className="space-y-1">
					<h1>Tie</h1>
					<ToggleGroup
						className="justify-start flex-wrap"
						type="single"
						unselectable="on"
						value={values.tie}
						onValueChange={(value) => {
							if (value) {
								handleSetValue("tie", value);
							}
						}}>
						{ties.map((tie) => (
							<ToggleGroupItem
								key={tie.id}
								value={tie.id}
								className={`${
									tie.id === values.tie ? "text-gray-900" : " text-gray-500"
								}  font-normal`}>
								{tie.title}
							</ToggleGroupItem>
						))}
					</ToggleGroup>
				</div>

				<hr />

				<div className="space-y-1">
					<h1>Wrapper Color</h1>
					<ToggleGroup
						className="justify-start flex-wrap"
						type="single"
						unselectable="on"
						value={values.color}
						onValueChange={(value) => {
							if (value) {
								handleSetValue("color", value);
							}
						}}>
						{["white", "cyan", "blue"].map((color) => (
							<ToggleGroupItem
								key={color}
								value={color}
								className={`${
									color === values.color ? "text-gray-900" : " text-gray-500"
								}  font-normal capitalize`}>
								{color}
							</ToggleGroupItem>
						))}
					</ToggleGroup>
				</div>
			</div>
		);
	};

	const RightContent = () => {
		return (
			<AuroraBackground
				showRadialGradient={false}
				className=" relative flex  scale-90 sm:scale-100 w-[350px] h-[350px] m-5 overflow-hidden  rounded-xl bg-clip-content">
				{/* <div className="absolute top-5 left-5">
					<ColourfulText text="Preview" className="text-3xl" />
				</div> */}
				{values.additionalFlower && (
					<img
						className="absolute  left-[113px] z-20 top-[76px] w-[166psx] h-[23s0px]"
						src={
							additionalFlowers.find(
								(flower) => flower.id === values.additionalFlower
							)!.svg
						}
						alt="clovers"
					/>
				)}
				{values.mainFlower && (
					<img
						className="absolute left-[104px] z-30  top-[39px]  w-[157spx] h-[17s3px]"
						src={
							mainFlowers.find((flower) => flower.id === values.mainFlower)!.svg
						}
						alt="sunflower"
					/>
				)}
				<Wrapper id={selectedWrapper} color={values.color} />
				{values.tie && (
					<img
						className="absolute left-[105px] z-50 top-[61px] ] w-[155spx] h-[14s2px] "
						src={ties.find((flower) => flower.id === values.tie)!.svg}
						alt="bigTwine tie"
					/>
				)}
			</AuroraBackground>
		);
	};

	return (
		<StickyScroll
			leftContent={<LeftContent />}
			rightContent={<RightContent />}
		/>
	);
}
