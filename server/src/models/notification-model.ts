import { prisma } from "@/services/prisma.js";
import { UserRole } from "@/types/user.js";
import { Notification, Prisma } from "@prisma/client";

export const createNotification = async ({
	message,
	title,
	toShop,
	type,
	userId,
	idToGo,
}: Pick<
	Notification,
	"message" | "title" | "type" | "toShop" | "userId" | "idToGo"
>) => {
	const newNotification = await prisma.notification.create({
		data: {
			message,
			idToGo,
			title,
			type,
			toShop,
			user: {
				connect: {
					id: userId,
				},
			},
		},
		include: {
			user: true,
		},
	});

	return newNotification;
};

export const updateNotification = async (
	userId: string,
	role: UserRole,
	notificationId?: string
) => {
	let where: Prisma.NotificationWhereInput = {};

	if (notificationId) {
		where.id = notificationId;
	}

	if (role === "USER") {
		where.userId = userId;
	} else {
		where.toShop = true;
	}

	await prisma.notification.updateMany({
		data: {
			read: true,
		},
		where,
	});
};

export const deleteNotification = async (
	userId: string,
	role: UserRole,
	notificationId?: string
) => {
	let where: Prisma.NotificationWhereInput = {};

	if (notificationId) {
		where.id = notificationId;
	}

	if (role === "USER") {
		where.userId = userId;
	} else {
		where.toShop = true;
	}

	await prisma.notification.deleteMany({
		where,
	});
};

export const readNotifications = async ({
	userId,
	pagination,
	role,
}: {
	userId: string;

	pagination?: {
		page: number;
		limit: number;
	};
	role: UserRole;
}) => {
	let where: Prisma.NotificationWhereInput = {};

	if (role === "USER") {
		where.userId = userId;
	} else {
		where.toShop = true;
	}

	const notifications = await prisma.notification.findMany({
		where,
		orderBy: {
			createdAt: "desc",
		},
		skip: pagination ? pagination.limit * pagination?.page : undefined,
		take: pagination ? pagination.limit : undefined,
	});

	console.log(notifications);

	const total = await prisma.notification.count({
		where,
	});

	return {
		data: notifications,
		hasNextPage: notifications.length === pagination?.limit,
		total,
	};
};
