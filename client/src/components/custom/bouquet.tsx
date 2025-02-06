import React from "react";

interface BouquetProps {
	wrapper: string;
	overWrapper: string;
	mainFlower: string;
	additionalFlower: string;
	tie: string;
}

export default function Bouquet({
	additionalFlower,
	mainFlower,
	overWrapper,
	tie,
	wrapper,
}: BouquetProps) {
	return (
		<div className="h-screen w-screen grid place-content-center">
			<div className="relative flex   w-[350px] h-[350px]  border rounded-lg bg-clip-content">
				{/* <div className="relative h-[230px] w-[166px] bg-gray-200"> */}
				<img
					className="absolute left-[100px]  top-[62px] w-[1s66px] h-[23s0px]"
					src={wrapper}
					alt="angular"
				/>

				{additionalFlower && (
					<img
						className="absolute  left-[113px] top-[76px] w-[166psx] h-[23s0px]"
						src={additionalFlower}
						alt="clovers"
					/>
				)}
				{mainFlower && (
					<img
						className="absolute left-[104px]  top-[49px]  w-[157spx] h-[17s3px]"
						src={mainFlower}
						alt="sunflower"
					/>
				)}
				<img
					className="absolute  left-[100px]  top-[82px] w-[16s5px] h-[230spx]"
					src={overWrapper}
					alt="wrapper"
				/>
				{tie && (
					<img
						className="absolute left-[105px]  top-[61px] ] w-[155spx] h-[14s2px] "
						src={tie}
						alt="bigTwine tie"
					/>
				)}
				{/* </div> */}
			</div>
		</div>
	);
}
