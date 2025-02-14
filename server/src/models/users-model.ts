import { prisma, hashPassword } from "../services/index.js";
import { UserFilter, User, UserRole } from "../types/index.js";
import { Prisma } from "@prisma/client";

export const createUser = async (values: {
	email: string;
	password: string;
	role: UserRole;
}): Promise<Omit<User, "orders"> | null> => {
	const hashedPassword = await hashPassword(values.password);

	const newUser = await prisma.user.create({
		data: {
			email: values.email,
			password: hashedPassword,
			role: values.role,
		},
	});

	if (!newUser) return null;

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

export const readUsers = async ({
	filter,
	pagination,
	role,
	status,
}: UserFilter = {}) => {
	const where: Prisma.UserWhereInput = {};

	if (filter) {
		where.OR = [
			{ email: { contains: filter } },
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
		skip: pagination ? pagination.limit * pagination?.page : undefined,
		take: pagination ? pagination.limit : undefined,
	});

	const total = await prisma.user.count({ where });

	return {
		users,
		hasNextPage: users.length === pagination?.limit,
		total,
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
			verifiedAt: values?.verifiedAt,
			phoneNumber: values?.phoneNumber,
			address: values?.address,
			status: values?.status,
			photo: values?.photo,
			role: values?.role,
		},
	});

	return user;
};
