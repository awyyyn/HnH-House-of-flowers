import { Order } from "./order.js";
import { User } from "./user.js";

export interface Payment {
	readonly id: string;
	checkoutUrl: string;
	status: PaymentStatus;
	paymentId: string;
	orderId: string;
	order: Order;
	userId: string;
	user: User;

	createdAt: Date;
}

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "CANCELLED";
