import { prisma } from "@/services/prisma.js";
import { OrderFilter, PaginationResult, User } from "@/types/index.js";
import {
	Order,
	OrderDeliveryType,
	OrderPaymentType,
	OrderStatus,
} from "@/types/order.js";
import { Payment } from "@/types/payment.js";
import { Prisma } from "@prisma/client";
import { getUnixTime } from "date-fns";

export const createOrder = async ({
	userId,
	totalPrice,
	items,
	typeOfPayment,
	status,
	typeOfDelivery,
	preOrder,
	payment,
}: {
	totalPrice: number;
	userId?: string;
	items: {
		quantity: number;
		price: number;
		productId: string;
	}[];
	typeOfPayment: OrderPaymentType;
	status: OrderStatus;
	typeOfDelivery: OrderDeliveryType;
	preOrder?: boolean;
	payment?: {
		checkoutUrl: string;
		id: string;
	};
}) => {
	const unixTimestamp = getUnixTime(new Date()); // Get current Unix timestamp
	const orderId = `ORD${unixTimestamp.toString().padStart(10, "0")}`;

	const order = await prisma.order.create({
		data: {
			totalPrice,
			status,
			typeOfDelivery,
			typeOfPayment,
			isPreOrder: preOrder,
			formattedId: orderId,
			payment: payment?.id
				? {
						create: {
							checkoutUrl: payment.checkoutUrl,
							paymentId: payment.id,
							status: "PENDING",

							userId: String(userId),
						},
				  }
				: undefined,
			customer: userId ? { connect: { id: userId } } : undefined,
			orderItems: {
				createMany: {
					data: items,
				},
			},
		},
		include: {
			orderItems: true,
			payment: true,
			customer: !!userId,
		},
	});

	return order;
};

export const updateOrder = async (
	id: string,
	data: Partial<
		Pick<
			Order,
			| "cancelledAt"
			| "completedAt"
			| "deliveredAt"
			| "processedAt"
			| "shippedAt"
			| "status"
		>
	>
) => {
	// id: data.attributes.data.idå

	const updatedOrder = await prisma.order.update({
		data: {
			processedAt: data.processedAt ? new Date(data.processedAt) : undefined,
			shippedAt: data.shippedAt ? new Date(data.shippedAt) : undefined,
			deliveredAt: data.deliveredAt ? new Date(data.deliveredAt) : undefined,
			cancelledAt: data.cancelledAt ? new Date(data.cancelledAt) : undefined,
			completedAt: data.completedAt ? new Date(data.completedAt) : undefined,
			status: data.status ? data.status : undefined,
		},
		where: {
			id,
		},
	});

	return updatedOrder;
};

export const readOrder = async ({
	paymentId,
	id,
	formattedId,
}: {
	id?: string;
	paymentId?: string;
	formattedId?: string;
}) => {
	let where: Prisma.OrderWhereInput = {};

	if (id) {
		where = { id };
	}

	if (paymentId) {
		where = {
			payment: {
				id: paymentId,
			},
		};
	}

	if (formattedId) {
		where = {
			formattedId,
		};
	}

	if (!id && !paymentId && !formattedId) {
		throw new Error("No id or paymentId provided");
	}

	const order = await prisma.order.findFirst({
		where,
		include: {
			orderItems: true,
			payment: true,
			customer: true,
		},
	});

	return order;
};

export const readOrders = async ({
	filter,
	pagination,
	typeOfDelivery,
	typeOfPayment,
	status = [
		"CANCELLED",
		"DELIVERED",
		"PENDING",
		"PROCESSING",
		"READY_FOR_PICKUP",
		"SHIPPED",
	],
}: OrderFilter) => {
	// : Promise<PaginationResult<Order>>

	let where: Prisma.OrderWhereInput = {};

	if (filter) {
		where = {
			OR: [
				{
					formattedId: {
						contains: filter,
						mode: "insensitive",
					},
				},
				{
					customer: {
						email: {
							contains: filter,
							mode: "insensitive",
						},
					},
				},
			],
		};
	}

	if (typeOfDelivery) {
		where.typeOfDelivery = typeOfDelivery;
	}

	if (typeOfPayment) {
		where.typeOfPayment = typeOfPayment;
	}

	if (status) {
		where.status = {
			in: status,
		};
	}

	const orders = await prisma.order.findMany({
		where,
		skip: pagination ? pagination.limit * pagination?.page : undefined,
		take: pagination ? pagination.limit : undefined,
		include: {
			orderItems: true,
			payment: true,
			customer: true,
		},
	});

	const total = await prisma.order.count({ where });

	console.log(JSON.stringify(orders, null, 2));

	return {
		hasNextPage: orders.length === pagination?.limit,
		total,
		data: orders,
	};
};

export const readOrdersByUser = async (userId: string) => {
	const orders = await prisma.order.findMany({
		where: {
			customer: {
				id: userId,
			},
		},
		include: {
			orderItems: {
				include: {
					product: true,
				},
			},
			payment: true,
			customer: true,
		},
	});

	console.log(JSON.stringify(orders, null, 2));

	return orders;
};
