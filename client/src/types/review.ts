import { Product } from "./product";
import { User } from "./user";

export type Review = {
	readonly id: string;
	rating: number;
	userId: string;
	user: User;
	productId: string;
	product: Product;
	comment: string | null;
	images: string[];

	content: string;
	createdAt: Date;
	updatedAt: Date;
};
