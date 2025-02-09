import { prisma } from "../services/prisma.js";
import { readUser, updateUser } from "./users-model.js";

export const blockUser = async (id: string, reason: string) => {
	const user = await readUser(id);

	const updatedUser = await updateUser(id, { status: "DELETED" });

	if (!updatedUser || !user) throw new Error("Failed to block user");

	const blockedUser = await prisma.blockedUser.create({
		data: {
			userId: updatedUser.id,
			email: updatedUser.email,
			reason,
		},
	});

	if (!blockedUser) {
		await updateUser(id, { status: user.status });
		throw new Error("Failed to block user");
	}

	return updatedUser;
};

export const unBlockUser = async (id: string) => {
	const user = await readUser(id);

	const updatedUser = await updateUser(id, {
		status: user?.phoneNumber ? "VERIFIED" : "UNVERIFIED",
	});

	if (!updatedUser || !user) throw new Error("Failed to unblock user");

	const blockedUser = await prisma.blockedUser.delete({
		where: {
			userId: updatedUser.id,
		},
	});

	if (!blockedUser) {
		await updateUser(id, { status: "DELETED" });
		throw new Error("Failed to unblock user");
	}

	return updatedUser;
};
