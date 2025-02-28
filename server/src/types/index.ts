import { prisma } from "../services/prisma.js";
import { BouquetItemType } from "./bouquet-item.js";
import { ProductCategory, ProductStatus } from "./product.js";
import { UserRole, UserStatus } from "./user.js";
export * from "./user.js";
export * from "./product.js";
export * from "./cart.js";
export * from "./bouquet-item.js";

export interface UserFilter {
	filter?: string;
	pagination?: {
		page: number;
		limit: number;
	};
	status?: UserStatus;
	role?: UserRole;
}

export interface ProductFilter {
	filter?: string;
	pagination?: {
		page: number;
		limit: number;
	};
	status?: ProductStatus[];
	category?: ProductCategory;
}

export interface BouquetItemFilter {
	filter?: string;
	pagination?: {
		page: number;
		limit: number;
	};
	isAvailable?: boolean;
	type?: BouquetItemType[];
}

export interface PaginationResult<T> {
	count: number;
	data: T[];
	hasMore: boolean;
}

export type AppContext = {
	id: string;
	email: string;
	role: UserRole;
	prisma: typeof prisma;
};

export interface UserPaginationArgs {
	filter?: string;
	status?: UserStatus;
	role?: UserRole;
	pagination?: {
		page: number;
		limit: number;
	};
}

export interface ProductsPaginationArgs {
	filter?: string;
	status?: ProductStatus[];
	category?: ProductCategory;
	pagination?: {
		page: number;
		limit: number;
	};
}

export interface RegistrationLink {
	email: string;
	role?: UserRole;
	otp?: string;
}

export interface UpdateUserInput {
	firstName: string | null;
	lastName: string | null;
	middleName: string | null;
	photo?: string;
	phoneNumber: string | null;
	birthDate: string | null;
	address: {
		zone: string;
		city: string;
		street: string;
	} | null;
}
