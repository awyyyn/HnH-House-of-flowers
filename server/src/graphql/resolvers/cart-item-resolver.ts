import {
	createCartItem,
	removeCartItem,
	updateCartItem,
} from "../../models/cart-item-model.js";
import { AppContext } from "../../types/index.js";
import { GraphQLError } from "graphql";

export const updateCartItemResolver = async (
	_: never,
	{ id, price, quantity }: { id: string; price: number; quantity: number }
) => {
	try {
		const updatedCartItem = await updateCartItem(id, { price, quantity });
		if (!updatedCartItem) throw new GraphQLError("Failed to update cart item!");
		return updatedCartItem;
	} catch {
		throw new GraphQLError("Internal Server Error!");
	}
};

export const addToCartResolver = async (
	_: never,
	{
		cartId,
		price,
		productId,
		quantity,
	}: { price: number; quantity: number; productId: string; cartId: string },
	app: AppContext
) => {
	try {
		const newCartItem = await createCartItem({
			cartId,
			price,
			productId,
			quantity,
			userId: app.id,
		});

		if (!newCartItem) throw new GraphQLError("Failed to add item to cart!");
		return newCartItem;
	} catch (err) {
		console.log(err);
		throw new GraphQLError("Internal Server Error!");
	}
};

export const removeToCartResolver = async (
	_: never,
	{ id }: { id: string }
) => {
	try {
		const deletedItem = await removeCartItem(id);

		return deletedItem;
	} catch (err) {
		console.log(err);
		throw new GraphQLError("Internal Server Error!");
	}
};
