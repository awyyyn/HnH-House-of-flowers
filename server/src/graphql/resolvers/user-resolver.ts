import { comparePassword } from "../../services/bcrypt.js";
import {
	createUser,
	readUser,
	readUsers,
	sendAdminLoginCredentials,
	blockUser,
	unBlockUser,
	updateUser,
	readToken,
	createToken,
	sendChangeEmailOTP,
} from "../../models/index.js";
import {
	AppContext,
	UserPaginationArgs,
	UpdateUserInput,
	UserRole,
} from "../../types/index.js";
import { GraphQLError } from "graphql";
import { differenceInMinutes, differenceInSeconds } from "date-fns";
import { generateAccessToken } from "../../services/jwt.js";

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
	{ filter, pagination, role, status }: UserPaginationArgs
) => {
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

export const resetPasswordResolver = async (
	_: never,
	{ newPassword, oldPassword }: { oldPassword: string; newPassword: string },
	app: AppContext
) => {
	try {
		const user = await readUser(app.email);
		if (!user) {
			throw new GraphQLError("User not found");
		}

		const isPasswordMatch = await comparePassword(oldPassword, user.password);

		if (!isPasswordMatch) {
			throw new GraphQLError("Old password is incorrect");
		}

		const updatedUser = await updateUser(app.id, { password: newPassword });

		if (!updatedUser) throw new GraphQLError("Failed to update password");

		return updatedUser;
	} catch (error) {
		throw new GraphQLError((error as GraphQLError).message);
	}
};

export const sendChangeEmailOTPResolver = async (
	_: never,
	{ newEmail }: { newEmail: string },
	app: AppContext
) => {
	try {
		if (newEmail === app.email) {
			throw new GraphQLError("New email must not be the same as the old email");
		}

		const isEmailExists = await readUser(newEmail);

		if (isEmailExists) {
			throw new GraphQLError(
				"Email is already registered with another account"
			);
		}

		const isTokenExists = await readToken(newEmail);

		if (isTokenExists) {
			const min = differenceInMinutes(new Date(), isTokenExists?.time);
			const minutesLeft = 5 - min;
			const seconds = differenceInSeconds(new Date(), isTokenExists?.time);

			throw new GraphQLError(
				`Token already sent. Please wait for ${
					!minutesLeft ? seconds : minutesLeft
				} ${!minutesLeft ? "second(s)" : "minute(s)"}`
			);
		}

		const token = await createToken(newEmail);
		await sendChangeEmailOTP({ email: newEmail, otp: token.token });

		return "OTP sent successfully";
	} catch (error) {
		throw new GraphQLError((error as GraphQLError).message);
	}
};

export const updateEmailResolver = async (
	_: never,
	{ newEmail, otp }: { newEmail: string; otp: string },
	app: AppContext
) => {
	try {
		const isTokenExists = await readToken(newEmail);

		if (!isTokenExists) {
			throw new GraphQLError("Invalid OTP");
		}

		if (isTokenExists.token !== otp) {
			throw new GraphQLError("Invalid OTP");
		}

		const updatedUser = await updateUser(app.id, {
			email: newEmail,
		});

		if (!updatedUser) {
			throw new GraphQLError("Failed to update email");
		}

		const accessToken = await generateAccessToken({
			email: updatedUser.email,
			id: updatedUser.id,
			role: updatedUser.role,
		});

		return {
			accessToken,
			data: updatedUser,
		};
	} catch (err) {
		throw new GraphQLError((err as GraphQLError).message);
	}
};

export const updateUserResolver = async (
	_: never,
	{ data }: { data: UpdateUserInput },
	app: AppContext
) => {
	const user = await updateUser(app.id, {
		...data,
		birthDate: data?.birthDate ? new Date(data.birthDate) : null,
	});

	if (!user) {
		throw new GraphQLError("Failed to update user");
	}

	return {
		...user,
		birthDate: user.birthDate?.toISOString(),
		createdAt: user.createdAt.toISOString(),
		updatedAt: user.updatedAt.toISOString(),
	};
};
