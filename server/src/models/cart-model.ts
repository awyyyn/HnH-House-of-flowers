import { prisma } from "../services/prisma.js";

export const createCart = async ({ userId }: { userId: string }) => {
	const cart = await prisma.cart.create({
		data: {
			user: {
				connect: {
					id: userId,
				},
			},
		},
		include: {
			items: true,
		},
	});

	return cart;
};

export const readCart = async (userId: string) => {
	const cart = await prisma.cart.findFirst({
		where: {
			user: {
				id: userId,
			},
		},
		include: {
			items: {
				include: {
					product: true,
				},
			},
		},
	});

	return cart;
};
