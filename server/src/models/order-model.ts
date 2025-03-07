import { prisma } from "@/services/prisma.js";
import { OrderFilter } from "@/types/index.js";
import {
	OrderDeliveryType,
	OrderPaymentType,
	OrderStatus,
} from "@/types/order.js";
import { PaymentStatus } from "@/types/payment.js";
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
		status?: PaymentStatus;
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
							status: payment?.status ? payment.status : "PENDING",
							userId: userId ? String(userId) : undefined,
						},
				  }
				: undefined,
			customer: userId ? { connect: { id: userId } } : undefined,
			orderItems: {
				createMany: {
					data: items,
				},
			},
			processedAt:
				payment?.status === "SUCCESS" ? new Date().toISOString() : undefined,
			completedAt:
				payment?.status === "SUCCESS" ? new Date().toISOString() : undefined,
			forPickup:
				payment?.status === "SUCCESS" ? new Date().toISOString() : undefined,
			shippedAt:
				payment?.status === "SUCCESS" ? new Date().toISOString() : undefined,
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
	values: {
		status: OrderStatus;
	}
) => {
	const order = await prisma.order.findFirst({
		where: { id },
	});

	if (!order) throw new Error("Order not found!");

	let data: Prisma.OrderUpdateInput = {
		status: values.status,
	};

	if (values.status === "CANCELLED") {
		data.cancelledAt = new Date().toISOString();
	} else if (values.status === "READY_FOR_PICKUP") {
		data.forPickup = new Date().toISOString();
	} else if (values.status === "COMPLETED") {
		data.completedAt = new Date().toISOString();
	} else if (values.status === "SHIPPED") {
		data.shippedAt = new Date().toISOString();
	} else if (values.status === "PROCESSING") {
		data.processedAt = new Date().toISOString();
	}

	const updatedOrder = await prisma.order.update({
		data,
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
	isPreOrder,
	status = [
		"CANCELLED",
		"COMPLETED",
		"PENDING",
		"PROCESSING",
		"READY_FOR_PICKUP",
		"SHIPPED",
	],
}: OrderFilter) => {
	// : Promise<PaginationResult<Order>>

	let where: Prisma.OrderWhereInput = {};

	console.log(isPreOrder, "qqq");

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

	if (isPreOrder) {
		where.isPreOrder = isPreOrder;
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
			orderItems: {
				include: {
					product: true,
				},
			},
			payment: true,
			customer: true,
		},
	});

	const total = await prisma.order.count({ where });

	console.log({
		hasNextPage: orders.length === pagination?.limit,
		total,
		data: orders,
	});

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
