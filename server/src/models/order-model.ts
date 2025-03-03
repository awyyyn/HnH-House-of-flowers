import { prisma } from "@/services/prisma.js";
import {
	OrderDeliveryType,
	OrderPaymentType,
	OrderStatus,
} from "@/types/order.js";

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

export const updateOrder = async () => {
	// id: data.attributes.data.idå
};
