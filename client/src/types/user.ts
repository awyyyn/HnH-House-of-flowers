import { Cart } from "./cart.js";
import { Order } from "./order.js";

export interface User {
	readonly id: string;
	email: string;
	firstName: string | null;
	lastName: string | null;
	middleName: string | null;
	password: string;
	phoneNumber: string | null;
	photo: string;
	birthDate: string | null;
	verifiedAt: Date | null;
	address: UserAddress | null;
	role: UserRole;
	status: UserStatus;

	orders: Order[];
	cart: Cart;

	createdAt: Date;
	updatedAt: Date;
}
export interface UserAddress {
	zone: string;
	street: string;
	city: string;
}

export type UserRole = "SUPER_ADMIN" | "ADMIN" | "USER";

export type UserStatus = "VERIFIED" | "UNVERIFIED" | "DELETED";
