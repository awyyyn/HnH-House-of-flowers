import { prisma } from "@/services/prisma.js";

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
	});

	return messages;
};
