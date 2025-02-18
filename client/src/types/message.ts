import { User } from "./user";

export type Message = {
	readonly id: string;
	senderId: string;
	receiverId: string;
	content: string;
	sender: User;
	receiver: User;

	createdAt: string;
	updatedAt: string;
};
