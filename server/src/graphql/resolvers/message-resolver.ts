import {
	createMessage,
	readAdminMessages,
	readMessages,
} from "../../models/message-model.js";
import { pubsub } from "../../services/pubsub.js";
import { AppContext } from "../../types/index.js";
import { GraphQLError } from "graphql";
import { withFilter } from "graphql-subscriptions";

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

		pubsub.publish("MESSAGE_SENT", { messageSent: newMessage });

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

export const adminMessagesResolver = async (
	_: never,
	__: never,
	app: AppContext
) => {
	try {
		if (app.role === "USER") {
			return new GraphQLError("Unauthorized!");
		}
		return await readAdminMessages();
	} catch (error) {
		throw new GraphQLError("Internal Server Error!");
	}
};

export const messageSentSubscription = {
	subscribe: withFilter(
		() => pubsub.asyncIterableIterator(["MESSAGE_SENT"]),
		(payload: any, variables: any) => {
			return (
				payload.messageSent.receiverId === variables.userId ||
				variables.role === "ADMIN" ||
				variables.role === "SUPER_ADMIN"
			);
		}
	),
};

export const notificationSentSubscription = {
	subscribe: withFilter(
		() => pubsub.asyncIterableIterator(["NOTIFICATION_SENT"]),
		(payload: any, variables: any) => {
			return (
				payload.notificationSent.userId === variables.userId ||
				variables.role === "ADMIN" ||
				variables.role === "SUPER_ADMIN"
			);
		}
	),
};
