export interface Customize {
	readonly id: string;
	name: string;
	note?: string;
	totalPrice: number;

	bouquetItems: BouquetItems;

	createdAt: Date;
	updatedAt: Date;
}

export interface BouquetItems {
	subFlowers: string[];
	mainFlower: string;
	wrapper: string;
	wrapperColor: string;
	tie: string;
}
