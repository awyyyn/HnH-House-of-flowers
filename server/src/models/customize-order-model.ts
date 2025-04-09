import { prisma } from "../services/prisma.js";

export const createCustomizeBouquet = async ({
	mainFlower,
	name,
	subFlowers,
	tie,
	totalPrice,
	wrapper,
	note,
	wrapperColor,
}: {
	name: string;
	mainFlower: string;
	subFlowers: string[];
	wrapper: string;
	tie: string;
	totalPrice: number;

	note?: string;
	wrapperColor: string;
}) => {
	const order = await prisma.customize.create({
		data: {
			name,

			bouquetItems: {
				mainFlower,
				subFlowers,
				wrapper,
				tie,
				wrapperColor,
			},
			totalPrice,
			note,
		},
	});

	return order;
};
