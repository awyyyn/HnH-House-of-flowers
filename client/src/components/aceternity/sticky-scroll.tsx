"use client";
import React, { useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const StickyScroll = ({
	leftContent,
	rightContent,
	contentClassName,
}: {
	leftContent: React.ReactNode;
	rightContent: React.ReactNode;
	contentClassName?: string;
}) => {
	const ref = useRef<HTMLDivElement>(null);

	return (
		<motion.div
			className="h-fulls max-h-[50dvh] h-[50dvh] overflow-y-auto flex justify-center relative  flex-col-reverse md:flex-row  items-start md:justify-around  rounded-md"
			ref={ref}>
			<div className=" w-full max-w-sm">{leftContent}</div>
			<div
				className={cn(
					"  rounded-md  sticky top-0 md:top-10  overflow-hidden",
					contentClassName
				)}>
				<div
					className="absolute left-5 top-5
				"></div>
				{rightContent}
			</div>
		</motion.div>
	);
};
