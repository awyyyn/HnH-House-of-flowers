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
