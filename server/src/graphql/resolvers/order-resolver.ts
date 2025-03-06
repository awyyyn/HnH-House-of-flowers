import {
	readOrders,
	readOrdersByUser,
	updateOrder,
} from "@/models/order-model.js";
import { AppContext, OrderFilter, OrderStatus } from "@/types/index.js";
import { GraphQLError } from "graphql";

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
		const { id, ...toBeUpdatedData } = data;
		const updatedOrder = await updateOrder(id, toBeUpdatedData);
		return updatedOrder;
	} catch (error) {
		throw new GraphQLError((error as GraphQLError).message);
	}
};
