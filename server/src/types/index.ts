import { prisma } from "../services/prisma.js";
import { UserRole, UserStatus } from "./user.js";
export * from "./user.js";

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

export interface PaginationArgs {
	filter?: string;
	status?: UserStatus;
	role?: UserRole;
	pagination?: {
		page: number;
		limit: number;
	};
}

export interface RegistrationLink {
	email: string;
	role: UserRole;
}
