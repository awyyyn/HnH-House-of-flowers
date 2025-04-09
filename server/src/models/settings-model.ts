import { prisma } from "src/services/prisma.js";

export const updateStore = async (
	{
		deliveryFee,
		socialMedia,
		policies,
		storeAddress,
		storeDescription,
		storeEmail,
		storeName,
		storePhone,
	}: {
		policies?: {
			privacyPolicy: string;
			returnPolicy: string;
			shippingPolicy: string;
			termsOfService: string;
		};
		socialMedia?: {
			facebook: string;
			instagram: string;
		};
		storeAddress: string;
		storeDescription: string;
		storeEmail: string;
		storeName: string;
		storePhone: string;
		deliveryFee: number;
	},
	id: string
) => {
	const store = await prisma.storeSettings.upsert({
		create: {
			policies,
			socialMedia,
			storeAddress,
			storeDescription,
			storeEmail,
			storeName,
			storePhone,
			deliveryFee,
		},
		update: {
			policies,
			socialMedia,
			storeAddress,
			storeDescription,
			storeEmail,
			storeName,
			storePhone,
			deliveryFee,
		},
		where: {
			id,
		},
	});

	return store;
};

export const getStore = async () => {
	const store = await prisma.storeSettings.findFirst({
		orderBy: {
			createdAt: "desc",
		},
	});

	return store;
};
