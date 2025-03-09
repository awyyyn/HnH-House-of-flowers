import {
	deleteNotification,
	readNotifications,
	updateNotification,
} from "@/models/notification-model.js";
import { AppContext, UserPaginationArgs } from "@/types/index.js";
import { GraphQLError } from "graphql";

export const updateNotificationResolver = async (
	_: never,
	{ id }: { id?: string },
	app: AppContext
) => {
	try {
		await updateNotification(app.id, app.role, id);
		return "SUCCESS";
	} catch {
		throw new GraphQLError("Internal Server Error!");
	}
};

export const deleteNotificationResolver = async (
	_: never,
	{ id }: { id?: string },
	app: AppContext
) => {
	try {
		await deleteNotification(app.id, app.role, id);
		return "SUCCESS";
	} catch (err) {
		console.log(err);
		throw new GraphQLError("Internal Server Error!");
	}
};

export const readNotificationsResolver = async (
	_: never,
	{ pagination }: { pagination?: UserPaginationArgs["pagination"] },
	app: AppContext
) => {
	try {
		return await readNotifications({
			role: app.role,
			userId: app.id,
			pagination,
		});
	} catch (er) {
		console.log(er);
		throw new GraphQLError("Internal Server Error!");
	}
};
