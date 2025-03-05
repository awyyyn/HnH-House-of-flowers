import { Payment } from "./payment.js";
import { Product } from "./product.js";
import { User } from "./user.js";

export interface OrderItem {
	readonly id: string;
	orderId: string;
	order: Order;
	price: number;
	quantity: number;

	product: Product | null;
	productId: string | null;
}

export interface Order {
	readonly id: string;
	formattedId: string;
	customerID: string | null;
	customer: User | null;
	status: OrderStatus;
	totalPrice: number;

	payment: Payment | null;
	typeOfPayment: OrderPaymentType;
	typeOfDelivery: OrderDeliveryType;
	isPreOrder: boolean;

	orderItems: OrderItem[];

	orderDate: string;
	processedAt: string | null;
	shippedAt: string | null;
	deliveredAt: string | null;
	cancelledAt: string | null;
	completedAt: string | null;
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
