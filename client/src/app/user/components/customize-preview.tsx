import { AuroraBackground } from "@/components";
import { BouquetItem } from "@/types";

function prepareSvgForColorization(svg: string): string {
	// Replace fill and stroke attributes with currentColor
	return svg.replace(/fill="[^"]*"/g, 'fill="currentColor"');
	// .replace(/stroke="[^"]*"/g, 'stroke="currentColor"');
}

export default function CustomizePreview({
	additionalFlowers,
	mainFlower,
	tie,
	wrapper,
	wrapperColor,
	flowers,
	subFlowers,
	ties,
	wrappers,
}: {
	mainFlower: string;
	additionalFlowers: string[];
	wrapper: string;
	wrapperColor: string;
	tie: string;
	ties: BouquetItem[];
	wrappers: BouquetItem[];
	flowers: BouquetItem[];
	subFlowers: BouquetItem[];
}) {
	return (
		<AuroraBackground showRadialGradient={false} className="">
			<div className=" relative flex  w-[350px] h-[350px]   overflow-hidden  rounded-xl bg-clip-content">
				{/* <div className="absolute top-5 left-5">
                        <ColourfulText text="Preview" className="text-3xl" />
                    </div> */}
				{additionalFlowers &&
					additionalFlowers.map((addlFlower) => (
						<div
							className="absolute  left-[113px] z-20 top-[76px] w-[166psx] h-[23s0px]"
							dangerouslySetInnerHTML={{
								__html: subFlowers.find((flower) => flower.id === addlFlower)!
									.svg[0],
							}}
						/>
					))}
				{mainFlower && (
					<div
						className="absolute left-[104px] z-30  top-[39px]  w-[157spx] h-[17s3px]"
						dangerouslySetInnerHTML={{
							__html: flowers.find((flower) => flower.id === mainFlower)!
								.svg[0],
						}}
					/>
				)}
				{/* <Wrapper id={selectedWrapper} color={values.color} /> */}

				{wrapper && (
					<div className="z-10 absolute left-[100px]  top-[62px]  ]">
						<div
							style={{
								color: wrapperColor,
							}}
							dangerouslySetInnerHTML={{
								// __html: prepareSvgForColorization(wrapper?.svg[0]),
								__html: prepareSvgForColorization(
									wrappers.find((wrpper) => wrpper.id === wrapper)?.svg[0] || ""
								),
							}}
						/>
					</div>
				)}
				{wrapper && (
					<div className="z-40 absolute  left-[100px]  top-[82px]  ">
						<div
							// style={{ color: selectedColors[item.id] || "currentColor" }}
							style={{
								color: wrapperColor,
							}}
							dangerouslySetInnerHTML={{
								// __html: prepareSvgForColorization(wrapper?.svg[0]),
								__html: prepareSvgForColorization(
									wrappers.find((wrpper) => wrpper.id === wrapper)?.svg[1] || ""
								),
							}}
						/>
					</div>
				)}
				{tie && (
					<div
						className="absolute left-[105px] z-50 top-[61px] ] w-[155spx] h-[14s2px] "
						// style={{ color:  tieColor || "red" }}
						dangerouslySetInnerHTML={{
							__html: ties.find((flower) => flower.id === tie)?.svg[0] || "",
						}}
					/>
				)}
			</div>
		</AuroraBackground>
	);
}
