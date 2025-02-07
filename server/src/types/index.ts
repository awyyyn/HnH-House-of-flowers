import { prisma } from "@/services/prisma.js";
import { UserRole } from "./user.js";

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
