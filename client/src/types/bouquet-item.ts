export interface BouquetItem {
	readonly id: string;
	name: string;
	price: number;
	svg: string[];
	colors: string[];
	type: BouquetItemType;
	isAvailable: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export type BouquetItemType = "WRAPPER" | "TIE" | "FLOWER" | "SUB_FLOWER";

export interface BouquetItems {
	subFlowers: string[];
	mainFlower: string;
	wrapper: string;
	tie: string;
	wrapperColor: string;
}
