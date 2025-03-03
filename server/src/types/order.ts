import { Customize } from "./customize.js";
import { Payment } from "./payment.js";
import { User } from "./user.js";

export interface OrderItem {
	readonly id: string;
	orderId: string;
	order: Order;
	price: number;
	quantity: number;
	isCustomize: boolean;
	customizeId?: string;
	customize?: Customize;
}

export interface Order {
	readonly id: string;
	customerId: string | null;
	customer: User | null;
	status: OrderStatus;
	totalPrice: number;

	payment: Payment | null;
	typeOfPayment: OrderPaymentType;
	typeOfDelivery: OrderDeliveryType;
	isPreOrder: boolean;

	orderItems: Order[];

	orderDate: Date;
	processedAt: Date | null;
	shippedAt: Date | null;
	deliveredAt: Date | null;
	cancelledAt: Date | null;
	completedAt: Date | null;
}

export type OrderStatus =
	| "PENDING"
	| "PROCESSING"
	| "SHIPPED"
	| "DELIVERED"
	| "CANCELLED"
	| "READY_FOR_PICKUP";

export type OrderPaymentType = "CASH" | "GCASH";

export type OrderDeliveryType = "PICKUP" | "DELIVERY";
