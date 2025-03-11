import { Product } from "./product.js";

export interface Cart {
	readonly id: string;
	userId: string;
	items: CartItem[];
	createdAt: string;
	updatedAt: string;
}

export interface CartItem {
	readonly id: string;
	productId: string;
	product: Product;

	cart: Cart;
	cartId: string;

	quantity: number;
	price: number;

	createdAt: string;
	updatedAt: string;
}
