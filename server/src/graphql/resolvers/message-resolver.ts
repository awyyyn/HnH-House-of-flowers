import { createMessage, readMessages } from "@/models/message-model.js";
import { AppContext } from "@/types/index.js";
import { GraphQLError } from "graphql";

export const sendMessageResolver = async (
	_: never,
	{ content, receiverId }: { content: string; receiverId: string },
	app: AppContext
) => {
	try {
		const newMessage = await createMessage({
			content,
			recipientId: receiverId,
			senderId: app.id,
		});

		if (!newMessage) {
			throw new GraphQLError("Message not sent!");
		}

		return newMessage;
	} catch {
		throw new GraphQLError("Internal Server Error!");
	}
};

export const readMessagesResolver = async (
	_: never,
	{ userId }: { userId: string }
) => {
	try {
		const messages = await readMessages(userId);

		return messages;
	} catch {
		throw new GraphQLError("Internal Server Error!");
	}
};
