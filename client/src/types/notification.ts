export interface Notification {
	readonly id: string;
	userId: string;
	user: {
		firstName: string;

		id: string;
		lastName: string;
	};
	message: string;
	title: string;
	type: NotificationType;
	idToGo: string;
	read: boolean;
	toShop: boolean;
	createdAt: string;
	updatedAt: string;
}

export type NotificationType = "ORDER" | "MESSAGE" | "PRE_ORDER" | "REVIEW";
