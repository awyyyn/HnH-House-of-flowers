import { Order } from "./order.js";

export interface User {
	readonly id: string;
	email: string;
	firstName: string | null;
	lastName: string | null;
	middleName: string | null;
	password: string;
	phoneNumber: string | null;
	birthDate: Date | null;
	role: UserRole;
	status: UserStatus;

	orders: Order[];

	createdAt: Date;
}

export type UserRole = "SUPER_ADMIN" | "ADMIN" | "USER";

export type UserStatus = "VERIFIED" | "UNVERIFIED" | "DELETED";
