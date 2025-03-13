import { BouquetItems } from "./bouquet-item";

export interface Customize {
	readonly id: string;
	name: string;
	note?: string;
	totalPrice: number;

	bouquetItems: BouquetItems;

	createdAt: Date;
	updatedAt: Date;
}
