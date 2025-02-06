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
	const ref = useRef<any>(null);

	return (
		<motion.div
			className="h-full max-h-[50dvh] overflow-y-auto flex justify-center relative  flex-col-reverse md:flex-row  items-center md:justify-around  rounded-md"
			ref={ref}>
			<div className="div relative flex items-start px-4   w-full max-w-sm">
				{leftContent}
			</div>
			<div
				className={cn(
					"  rounded-md  sticky top-0 md:top-10  overflow-hidden",
					contentClassName
				)}>
				{rightContent}
			</div>
		</motion.div>
	);
};
