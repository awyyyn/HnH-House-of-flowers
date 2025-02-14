export interface Product {
	readonly id: string;
	name: string;
	description: string;
	price: number;
	images: string[];
	stock: number;

	status: ProductStatus;
	category: ProductCategory;

	createdAt: Date;
	updatedAt: Date;
}

export type ProductStatus =
	| "PRE_ORDER"
	| "DISCONTINUED"
	| "IN_STOCK"
	| "OUT_OF_STOCK";

export type ProductCategory = "FLOWER" | "BOUQUET" | "CHOCOLATE" | "GIFT";

export type ProductInput = Omit<Product, "id" | "createdAt" | "updatedAt">;
