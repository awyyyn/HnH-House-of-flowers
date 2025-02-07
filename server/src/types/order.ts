import { Customize } from "./customize.js";
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
	customerId: string;
	customer: User;
	status: OrderStatus;
	totalPrice: number;

	orderItems: Order[];

	orderDate: Date;
	preOrderDate?: Date;
	deliveryDate?: Date;
}

export type OrderStatus =
	| "PENDING"
	| "PROCESSING"
	| "SHIPPED"
	| "DELIVERED"
	| "CANCELLED"
	| "READY_FOR_PICKUP";
