import { Order } from "./order.js";

export interface User {
	readonly id: string;
	email: string;
	firstName: string | null;
	lastName: string | null;
	middleName: string | null;
	password: string;
	photo: string;
	phoneNumber: string | null;
	birthDate: Date | null;
	verifiedAt: Date | null;
	address: UserAddress | null;
	role: UserRole;
	status: UserStatus;

	orders: Order[];

	createdAt: Date;
}

export interface UserAddress {
	zone: string;
	street: string;
	city: string;
	province: string;
}

export type UserRole = "SUPER_ADMIN" | "ADMIN" | "USER";

export type UserStatus = "VERIFIED" | "UNVERIFIED" | "DELETED";
