import {
	createUser,
	readUser,
	readUsers,
	sendAdminLoginCredentials,
	blockUser,
	unBlockUser,
} from "../../models/index.js";
import { AppContext, PaginationArgs, UserRole } from "../../types/index.js";
import { GraphQLError } from "graphql";

export const userResolver = async (
	_: never,
	{ filter }: { filter: string }
) => {
	try {
		const user = await readUser(filter);
		return user;
	} catch (error) {
		throw new GraphQLError((error as GraphQLError).message);
	}
};

export const usersResolver = async (
	_: never,
	{ filter, pagination, role, status }: PaginationArgs
) => {
	console.log(pagination);
	try {
		return await readUsers({ filter, pagination, role, status });
	} catch (error) {
		throw new GraphQLError((error as GraphQLError).message);
	}
};

export const createAdminResolver = async (
	_: never,
	{ email, password }: { email: string; password: string },
	app: AppContext
) => {
	if (app.role !== "SUPER_ADMIN") {
		throw new GraphQLError("UnAuthorized!");
	}
	try {
		const isUserExist = await readUser(email);
		if (isUserExist) {
			throw new GraphQLError("User already exists");
		}

		const user = await createUser({ email, password, role: "ADMIN" });

		if (!user) throw new GraphQLError("Failed to create user");

		await sendAdminLoginCredentials({ email, password, role: "ADMIN" });

		return user;
	} catch (err) {
		throw new GraphQLError((err as GraphQLError).message);
	}
};

export const blockUserResolver = async (
	_: never,
	{ role, id, reason }: { role: UserRole; id: string; reason: string },
	app: AppContext
) => {
	if (role === "ADMIN" && app.role !== "SUPER_ADMIN") {
		throw new GraphQLError("UnAuthorized!");
	}

	try {
		const user = await blockUser(id, reason);
		return user;
	} catch (error) {
		throw new GraphQLError((error as GraphQLError).message);
	}
};

export const unblockUserResolver = async (
	_: never,
	{ id, role }: { id: string; role: UserRole },
	app: AppContext
) => {
	if (role === "ADMIN" && app.role !== "SUPER_ADMIN") {
		throw new GraphQLError("UnAuthorized!");
	}

	try {
		const user = await unBlockUser(id);
		return user;
	} catch (error) {
		throw new GraphQLError((error as GraphQLError).message);
	}
};
