import { prisma } from "../services/prisma.js";
import { Prisma } from "@prisma/client";

export const createMessage = async ({
	content,
	recipientId,
	senderId,
}: {
	content: string;
	senderId: string;
	recipientId: string;
}) => {
	const newMessage = await prisma.message.create({
		data: {
			content,
			sender: {
				connect: {
					id: senderId,
				},
			},
			receiver: {
				connect: {
					id: recipientId,
				},
			},
		},
		include: {
			receiver: true,
			sender: true,
		},
	});

	return newMessage;
};

export const readMessages = async (userId: string) => {
	const messages = await prisma.message.findMany({
		where: {
			OR: [
				{
					senderId: userId,
				},
				{
					receiverId: userId,
				},
			],
		},
		include: {
			sender: true,
			receiver: true,
		},
	});

	return messages;
};

export const readAdminMessages = async (pagination?: {
	page: number;
	limit: number;
}) => {
	const where: Prisma.MessageWhereInput = {
		receiver: {
			role: {
				in: ["ADMIN", "SUPER_ADMIN"],
			},
		},
		sender: {
			role: "USER",
		},
	};

	const messages = await prisma.message.findMany({
		where,
		include: {
			sender: true,
		},
		distinct: "senderId",
		orderBy: {
			createdAt: "asc",
		},
		skip: pagination ? pagination.limit * pagination?.page : undefined,
		take: pagination ? pagination.limit : undefined,
	});

	let users = messages.map((message) => message.sender);

	const total = await prisma.message.count({ where });

	return {
		data: users,
		hasNextPage: users.length === pagination?.limit,
		total,
	};
};
