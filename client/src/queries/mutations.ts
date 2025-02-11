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

export const RESET_PASSWORD_MUTATION = gql`
	${userFragment}
	mutation ($oldPassword: String!, $newPassword: String!) {
		user: resetPassword(oldPassword: $oldPassword, newPassword: $newPassword) {
			...UserFragment
		}
	}
`;

export const SEND_CHANGE_EMAIL_OTP_MUTATION = gql`
	mutation ($newEmail: String!) {
		data: sendChangeEmailOTP(newEmail: $newEmail)
	}
`;

export const UPDATE_EMAIL_MUTATION = gql`
	${userFragment}
	mutation ($newEmail: String!, $otp: String!) {
		data: updateEmail(newEmail: $newEmail, otp: $otp) {
			accessToken
			data {
				...UserFragment
			}
		}
	}
`;

export const UPDATE_USER_MUTATION = gql`
	${userFragment}
	mutation ($data: UpdateUserInput) {
		updateUser(data: $data) {
			...UserFragment
		}
	}
`;
