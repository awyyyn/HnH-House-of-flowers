import { hashPassword } from "@/services/bcrypt.js";
import { prisma } from "@/services/prisma.js";
import { User, UserRole, UserStatus } from "@/types/user.js";
import { Prisma } from "@prisma/client";

export const createUser = async (values: {
	email: string;
	password: string;
	role: UserRole;
}): Promise<Omit<User, "orders">> => {
	const hashedPassword = await hashPassword(values.password);

	const newUser = await prisma.user.create({
		data: {
			email: values.email,
			password: hashedPassword,
			role: values.role,
		},
	});

	return newUser;
};

export const readUser = async (filter: string) => {
	let where: Prisma.UserWhereUniqueInput = { id: filter };

	if (filter.includes("@")) {
		where = { email: filter };
	}

	const user = await prisma.user.findUnique({
		where,
	});

	return user;
};

interface Filter {
	filter?: string;
	pagination?: {
		page: number;
		limit: number;
	};
	status?: UserStatus;
	role?: UserRole;
}

export const readUsers = async ({
	filter,
	pagination,
	role,
	status,
}: Filter = {}) => {
	const where: Prisma.UserWhereInput = {};

	if (filter) {
		where.OR = [
			{ email: filter },
			{ firstName: { contains: filter } },
			{ lastName: { contains: filter } },
		];
	}

	if (role) {
		where.role = role;
	}

	if (status) {
		where.status = status;
	}

	const users = await prisma.user.findMany({
		where,
		skip: pagination ? pagination.limit * (pagination?.page - 1) : undefined,
		take: pagination ? pagination.limit : undefined,
	});

	const count = await prisma.user.count({ where });

	return {
		data: users,
		hasMore: users.length === pagination?.limit,
		count,
	};
};

export const updateUser = async (id: string, values: Partial<User>) => {
	const user = await prisma.user.update({
		where: { id },
		data: {
			birthDate: values?.birthDate,
			email: values?.email,
			firstName: values?.firstName,
			lastName: values?.lastName,
			password: values?.password,
			middleName: values?.middleName,
			phoneNumber: values?.phoneNumber,
			status: values?.status,
			role: values?.role,
		},
	});

	return user;
};
