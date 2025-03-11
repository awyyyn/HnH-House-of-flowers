import { gql } from "@apollo/client";

export const MESSAGE_SENT_SUBSCRIPTION = gql`
	subscription MessageSent($userId: ID!, $role: UserRole) {
		messageSent(userId: $userId, role: $role) {
			id
			senderId
			receiverId
			sender {
				email
				id
			}
			receiver {
				email
				id
			}
			content
			createdAt
			updatedAt
		}
	}
`;

export const NOTIFICATION_SENT_SUBSCRIPTION = gql`
	subscription NotificationSent($userId: ID!, $role: UserRole) {
		notificationSent(userId: $userId, role: $role) {
			id
			userId
			user {
				lastName
				firstName
				id
			}
			title
			idToGo
			message
			type
			read
			toShop
			createdAt
			updatedAt
		}
	}
`;
