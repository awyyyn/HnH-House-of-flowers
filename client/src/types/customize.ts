import { OrderItem } from "./order.js";

export interface Customize {
	readonly id: string;
	name: string;
	description?: string;
	price?: number;

	orderItem: OrderItem;

	createdAt: Date;
	updatedAt: Date;
}
