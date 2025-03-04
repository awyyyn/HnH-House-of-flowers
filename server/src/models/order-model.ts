import { prisma } from "@/services/prisma.js";
import {
	Order,
	OrderDeliveryType,
	OrderPaymentType,
	OrderStatus,
} from "@/types/order.js";
import { Prisma } from "@prisma/client";

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
	const order = await prisma.order.create({
		data: {
			totalPrice,
			status,
			typeOfDelivery,
			typeOfPayment,
			isPreOrder: preOrder,

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
}: {
	id?: string;
	paymentId?: string;
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

	if (!id && !paymentId) {
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
