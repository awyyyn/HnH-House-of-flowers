import {
	StickyScroll,
	AuroraBackground,
	ToggleGroup,
	ToggleGroupItem,
} from "@/components";
import { BouquetItem, CustomizationValues } from "@/types";
import { Dispatch, SetStateAction } from "react";

interface CustomizeFlowerProps {
	selectedWrapper: string;
	values: CustomizationValues;
	setValues: Dispatch<SetStateAction<CustomizationValues>>;
	wrappers: BouquetItem[];
	ties: BouquetItem[];
	flowers: BouquetItem[];
	subFlowers: BouquetItem[];
}

function prepareSvgForColorization(svg: string): string {
	// Replace fill and stroke attributes with currentColor
	return svg.replace(/fill="[^"]*"/g, 'fill="currentColor"');
	// .replace(/stroke="[^"]*"/g, 'stroke="currentColor"');
}

export default function CustomizeFlower({
	setValues,
	selectedWrapper,
	values,
	flowers,
	subFlowers,
	ties,
	wrappers,
}: CustomizeFlowerProps) {
	const handleSetValue = (
		name: keyof typeof values,
		value: string | string[]
	) => {
		setValues((vals) => ({
			...vals,
			[name]: value,
		}));
	};

	const LeftContent = () => {
		return (
			<>
				<div className="w-[80%] sm:w-full mx-auto space-y-3 justify-self-start">
					<div className="space-y-1">
						<h1>Wrappers</h1>
						<ToggleGroup
							className="justify-start"
							type="single"
							unselectable="on"
							value={values.wrapper}
							onValueChange={(value) => {
								if (value) {
									handleSetValue("wrapper", value);
									handleSetValue(
										"wrapperColor",
										wrappers.find((wrppr) => wrppr.id === selectedWrapper)!
											.colors[0]
									);
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

					{wrappers.find((wrppr) => wrppr.id === selectedWrapper)?.colors && (
						<div className="space-y-1">
							<h1>Wrapper Color</h1>
							<ToggleGroup
								className="justify-start flex-wrap"
								type="single"
								unselectable="on"
								value={values.wrapperColor}
								onValueChange={(value) => {
									if (value) {
										handleSetValue("wrapperColor", value);
									}
								}}>
								{wrappers
									.find((wrppr) => wrppr.id === selectedWrapper)
									?.colors.map((color) => (
										<ToggleGroupItem
											key={color}
											value={color}
											className={`${
												color === values.wrapperColor
													? "text-gray-900"
													: " text-gray-500"
											}  font-normal capitalize`}>
											{color}
										</ToggleGroupItem>
									))}
							</ToggleGroup>
						</div>
					)}

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
							{flowers.map((flower) => (
								<ToggleGroupItem
									key={flower.id}
									value={flower.id}
									className={`${
										flower.id === values.mainFlower
											? "text-gray-900"
											: " text-gray-500"
									}  font-normal`}>
									{flower.name}
								</ToggleGroupItem>
							))}
						</ToggleGroup>
					</div>

					<hr />

					<div className="space-y-1">
						<h1>Additional Flower</h1>
						<ToggleGroup
							className="justify-start"
							type="multiple"
							value={values.additionalFlower}
							onValueChange={(value) => {
								if (value) {
									handleSetValue(
										"additionalFlower",
										values.additionalFlower.concat(value)
									);
								}
							}}>
							{subFlowers.map((flower) => (
								<ToggleGroupItem
									key={flower.id}
									value={flower.id}
									className={`${
										values.additionalFlower.includes(flower.id)
											? "text-gray-900"
											: " text-gray-500"
									}  font-normal`}>
									{flower.name}
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
									{tie.name}
								</ToggleGroupItem>
							))}
						</ToggleGroup>
					</div>
					{/* {ties.find((tie) => tie.id === values.tie)?.colors && (
						<div className="space-y-1">
							<h1>Tie Colors</h1>
							<ToggleGroup
								className="justify-start flex-wrap"
								type="single"
								unselectable="on"
								value={values.tieColor}
								onValueChange={(value) => {
									if (value) {
										handleSetValue("tieColor", value);
									}
								}}>
								{ties
									.find((ti) => ti.id === values.tie)
									?.colors.map((color) => (
										<ToggleGroupItem
											key={color}
											value={color}
											className={`${
												color === values.tieColor
													? "text-gray-900"
													: " text-gray-500"
											}  font-normal capitalize`}>
											{color}
										</ToggleGroupItem>
									))}
							</ToggleGroup>
						</div>
					)} */}

					<hr />
				</div>
			</>
		);
	};

	const wrapper = wrappers.find((wrapper) => wrapper.id === values.wrapper);

	const RightContent = () => {
		return (
			<AuroraBackground showRadialGradient={false} className="">
				<div className=" relative flex  w-[350px] h-[350px]   overflow-hidden  rounded-xl bg-clip-content">
					{/* <div className="absolute top-5 left-5">
					<ColourfulText text="Preview" className="text-3xl" />
				</div> */}
					{values.additionalFlower &&
						values.additionalFlower.map((addlFlower) => (
							<div
								className="absolute  left-[113px] z-20 top-[76px] w-[166psx] h-[23s0px]"
								dangerouslySetInnerHTML={{
									__html: subFlowers.find((flower) => flower.id === addlFlower)!
										.svg[0],
								}}
							/>
						))}
					{values.mainFlower && (
						<div
							className="absolute left-[104px] z-30  top-[39px]  w-[157spx] h-[17s3px]"
							dangerouslySetInnerHTML={{
								__html: flowers.find(
									(flower) => flower.id === values.mainFlower
								)!.svg[0],
							}}
						/>
					)}
					{/* <Wrapper id={selectedWrapper} color={values.color} /> */}

					{wrapper && (
						<div className="z-10 absolute left-[100px]  top-[62px]  ]">
							<div
								style={{
									color: values.wrapperColor,
								}}
								dangerouslySetInnerHTML={{
									// __html: prepareSvgForColorization(wrapper.svg[0]),
									__html: prepareSvgForColorization(wrapper.svg[0]),
								}}
							/>
						</div>
					)}
					{wrapper && (
						<div className="z-40 absolute  left-[100px]  top-[82px]  ">
							<div
								// style={{ color: selectedColors[item.id] || "currentColor" }}
								style={{
									color: values.wrapperColor,
								}}
								dangerouslySetInnerHTML={{
									// __html: prepareSvgForColorization(wrapper.svg[0]),
									__html: prepareSvgForColorization(wrapper.svg[1]),
								}}
							/>
						</div>
					)}
					{values.tie && (
						<div
							className="absolute left-[105px] z-50 top-[61px] ] w-[155spx] h-[14s2px] "
							style={{ color: values.tieColor || "red" }}
							dangerouslySetInnerHTML={{
								__html: ties.find((flower) => flower.id === values.tie)!.svg[0],
							}}
						/>
					)}
				</div>
			</AuroraBackground>
		);
	};

	return (
		<div className="min-h-[8s0dvh]">
			<StickyScroll
				leftContent={<LeftContent />}
				rightContent={<RightContent />}
			/>
		</div>
	);
}
