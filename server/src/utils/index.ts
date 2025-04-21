import { OrderStatus } from "../types/order.js";
import { NotificationType } from "@prisma/client";

export function generateNotificationContent(
	type: NotificationType,
	orderStatus?: OrderStatus,
	userName?: string,
	placed?: boolean
): { title: string; message: string } {
	let title = "";
	let message = "";

	switch (type) {
		case NotificationType.ORDER:
			title = `Order ${orderStatus?.toLowerCase().split("_").join(" ")}`;
			message = placed
				? "New order placed."
				: `Your order is currently ${orderStatus?.toLowerCase()}.`;
			break;

		case NotificationType.MESSAGE:
			title = "New Message";
			message = "You have received a new message.";
			break;

		case NotificationType.PRE_ORDER:
			title = "Pre-order Confirmation";
			message = "Your pre-order has been successfully placed.";
			break;

		case NotificationType.REVIEW:
			title = "Review Request";
			message = `We'd love to hear your feedback, ${userName}! Please leave a review for your recent purchase.`;
			break;

		default:
			title = "Notification";
			message = "You have a new notification.";
	}

	return { title, message };
}
