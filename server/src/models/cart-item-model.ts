import { prisma } from "../services/prisma.js";

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
	const cartI = await prisma.cartItem.findFirst({
		where: {
			productId: productId,
			cartId: cartId,
		},
		include: { product: true },
	});

	const cartItem = await prisma.cartItem.upsert({
		update: {
			quantity: {
				increment: quantity,
			},
			price: cartI
				? Number(cartI?.product.price) * (Number(cartI?.quantity) + quantity)
				: price,
		},
		create: {
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
						userId: userId,
					},
				},
			},
		},
		where: {
			id: String(cartI?.id ?? "67a9dcc94a3fe402bd3c79b9"),
		},
		include: {
			product: true,
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

export const removeCartItem = async (cartItemId: string) => {
	const cartItem = await prisma.cartItem.delete({
		where: {
			id: cartItemId,
		},
	});

	return cartItem;
};
