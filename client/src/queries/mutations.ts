import { gql } from "@apollo/client";
import { userFragment } from "./fragments";

export const CREATE_ADMIN_MUTATION = gql`
	${userFragment}
	mutation ($email: String!, $password: String!) {
		user: createAdmin(email: $email, password: $password) {
			...UserFragment
		}
	}
`;

export const UNBLOCK_USER_MUTATION = gql`
	${userFragment}
	mutation ($id: ID!, $role: UserRole!) {
		user: unblockUser(id: $id, role: $role) {
			...UserFragment
		}
	}
`;

export const BLOCK_USER_MUTATION = gql`
	${userFragment}
	mutation ($id: ID!, $reason: String!, $role: UserRole!) {
		user: blockUser(id: $id, reason: $reason, role: $role) {
			...UserFragment
		}
	}
`;
