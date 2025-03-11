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
			className="  md:max-h-[50dvh] h-[80dvh]    justify-evenly overflow-y-auto md:flex   relative   md:flex-row flex flex-col-reverse rounded-md"
			ref={ref}>
			<div className=" w-full    max-w-sm">{leftContent}</div>
			<div
				className={cn(
					"  rounded-md  bg-white dark:bg-zinc-800  sticky pb-10 min-h-[400px] md:min-h-fit top-0 md:top-10  overflow-hidden  ",
					contentClassName
				)}>
				<div className="scale-75 sm:scale-80 md:scale-100">{rightContent}</div>
			</div>
		</motion.div>
	);
};
