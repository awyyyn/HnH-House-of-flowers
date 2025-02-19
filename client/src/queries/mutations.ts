import { gql } from "@apollo/client";
import { productFragment, userFragment } from "./fragments";

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
		user: updateUser(data: $data) {
			...UserFragment
		}
	}
`;

export const CREATE_PRODUCT_MUTATION = gql`
	${productFragment}

	mutation (
		$name: String!
		$price: Float!
		$stock: Int!
		$status: ProductStatus!
		$category: ProductCategory!
		$images: [String]
		$description: String
	) {
		product: createProduct(
			name: $name
			price: $price
			stock: $stock
			status: $status
			category: $category
			images: $images
			description: $description
		) {
			...ProductFragment
		}
	}
`;

export const UPDATE_PRODUCT_MUTATION = gql`
	${productFragment}
	mutation ($id: ID!, $data: ProductInput!) {
		product: updateProduct(id: $id, data: $data) {
			...ProductFragment
		}
	}
`;

export const SEND_MESSAGE_MUTATION = gql`
	mutation ($receiverId: String!, $content: String!) {
		sendMessage(receiverId: $receiverId, content: $content) {
			id
			senderId
			receiverId
			sender {
				firstName
				lastName
				email
				photo
			}
			receiver {
				firstName
				lastName
				email
				photo
			}
			content
			createdAt
			updatedAt
		}
	}
`;

export const ADD_TO_CART_MUTATION = gql`
	${productFragment}
	mutation (
		$price: Float!
		$quantity: Int!
		$productId: String!
		$cartId: String
	) {
		cartItem: addToCart(
			price: $price
			quantity: $quantity
			productId: $productId
			cartId: $cartId
		) {
			id
			product {
				...ProductFragment
			}
			productId
			quantity
			cartId
			price
		}
	}
`;

export const REMOVE_TO_CART_MUTATION = gql`
	mutation ($id: ID!) {
		cartItem: removeToCart(id: $id) {
			id
			productId
			quantity
			cartId
			price
		}
	}
`;
