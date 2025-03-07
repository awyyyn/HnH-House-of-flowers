import {
	createOrder,
	readOrders,
	readOrdersByUser,
	updateOrder,
} from "@/models/order-model.js";
import { AppContext, OrderFilter, OrderStatus } from "@/types/index.js";
import { GraphQLError } from "graphql";
import { v4 as uuidv4 } from "uuid";

export const readOrdersResolver = async (
	_: never,
	{ filter, pagination, status, typeOfDelivery, typeOfPayment }: OrderFilter
) => {
	try {
		return await readOrders({
			filter,
			pagination,
			status,
			typeOfDelivery,
			typeOfPayment,
		});
	} catch (error) {
		throw new GraphQLError((error as GraphQLError).message);
	}
};

export const readOrdersByUserResolver = async (
	_: never,
	__: never,
	app: AppContext
) => {
	try {
		return await readOrdersByUser(app.id);
	} catch (error) {
		throw new GraphQLError((error as GraphQLError).message);
	}
};

export const updateOrderResolver = async (
	_: never,
	data: {
		id: string;
		status: OrderStatus;
	}
) => {
	try {
		const { id, status } = data;
		const updatedOrder = await updateOrder(id, { status });
		return updatedOrder;
	} catch (error) {
		throw new GraphQLError((error as GraphQLError).message);
	}
};

export const createOrderResolver = async (
	_: never,
	{
		line_items,
		totalPrice,
		preOrder,
	}: {
		totalPrice: number;
		line_items: {
			cartItemId: string;
			amount: number;
			id: string;
			name: string;
			images: string[];
			quantity: number;
		}[];
		preOrder?: boolean;
	}
) => {
	try {
		//
		const order = await createOrder({
			items: line_items.map((item) => ({
				price: item.amount,
				productId: item.id,
				quantity: item.quantity,
			})),
			status: "COMPLETED",
			totalPrice,
			typeOfDelivery: "PICKUP",
			userId: undefined,
			typeOfPayment: "CASH",
			preOrder,
			payment: {
				checkoutUrl: "no-checkout-url",
				id: uuidv4(),
				status: "SUCCESS",
			},
		});

		if (!order) {
			throw new GraphQLError("Failed to create order");
		}

		console.log(order);

		return order;
	} catch (error) {
		throw new GraphQLError((error as GraphQLError).message);
	}
};
