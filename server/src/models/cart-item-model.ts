import { prisma } from "@/services/prisma.js";

export const createCartItem = async ({
	price,
	quantity,
	productId,
	cartId,
	userId,
}: {
	price: number;
	userId: string;

	quantity: number;
	productId: string;
	cartId: string;
}) => {
	const cartItem = await prisma.cartItem.create({
		data: {
			price,
			quantity,
			product: {
				connect: {
					id: productId,
				},
			},
			cart: {
				connectOrCreate: {
					create: {
						userId: userId,
					},
					where: {
						id: cartId,
					},
				},
			},
		},
	});

	return cartItem;
};

export const updateCartItem = async (
	id: string,
	data: {
		price?: number;
		quantity?: number;
	}
) => {
	const updatedCartItem = await prisma.cartItem.update({
		where: {
			id,
		},
		data: data,
	});

	return updatedCartItem;
};

export const removeCartItem = async (cartItemId: string, userId: string) => {
	const cartItem = await prisma.cartItem.delete({
		where: {
			id: cartItemId,
		},
	});

	return cartItem;
};
