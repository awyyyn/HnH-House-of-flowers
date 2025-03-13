import { gql } from "@apollo/client";
import {
	bouquetItemFragment,
	productFragment,
	userFragment,
} from "./fragments";

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

export const CREATE_BOUQUET_ITEM_MUTATION = gql`
	${bouquetItemFragment}
	mutation ($data: BouquetItemInput!) {
		bouquetItem: createBouquetItem(data: $data) {
			...BouquetItemFragment
		}
	}
`;

export const UPDATE_BOUQUET_ITEM_MUTATION = gql`
	${bouquetItemFragment}
	mutation UpdateBouquetItem($id: ID!, $data: BouquetItemInput!) {
		bouquetItem: updateBouquetItem(id: $id, data: $data) {
			...BouquetItemFragment
		}
	}
`;

export const CHECKOUT_MUTATION = gql`
	mutation CreateCheckoutSession(
		$lineItems: [LineItemInput!]!
		$totalPrice: Float!
		$typeOfDelivery: OrderDeliveryType!
		$typeOfPayment: OrderPaymentType!
		$fromCartItem: Boolean
	) {
		createCheckoutSession(
			line_items: $lineItems
			totalPrice: $totalPrice
			typeOfDelivery: $typeOfDelivery
			typeOfPayment: $typeOfPayment
			fromCartItem: $fromCartItem
		) {
			id
			payment {
				checkoutUrl
				id
			}
			status
			totalPrice
			isPreOrder
			orderItems {
				id
				product {
					images
					name
				}
				price
				quantity
				orderId
			}

			orderDate
			processedAt
			shippedAt
			forPickup
			cancelledAt
			completedAt
		}
	}
`;

export const CREATE_ORDER_MUTATION = gql`
	mutation CreateOrder(
		$lineItems: [LineItemInput!]!
		$totalPrice: Float!
		$preOrder: Boolean
	) {
		createOrder(
			line_items: $lineItems
			totalPrice: $totalPrice
			preOrder: $preOrder
		) {
			id
			payment {
				checkoutUrl
				id
			}
			status
			totalPrice
			isPreOrder
			orderItems {
				id
				product {
					images
					name
				}
				price
				quantity
				orderId
			}

			orderDate
			processedAt
			shippedAt
			forPickup
			cancelledAt
			completedAt
		}
	}
`;

export const UPDATE_ORDER_MUTATION = gql`
	mutation Mutation($id: ID!, $status: OrderStatus) {
		updateOrder(id: $id, status: $status) {
			id
			status
			formattedId
			totalPrice
			isPreOrder
			typeOfDelivery
			typeOfPayment
			orderDate
			processedAt
			shippedAt
			forPickup
			cancelledAt
			completedAt
		}
	}
`;

export const UPDATE_NOTIFICATION_MUTATION = gql`
	mutation ($id: ID) {
		notification: updateNotification(id: $id)
	}
`;

export const DELETE_NOTIFICATION_MUTATION = gql`
	mutation ($id: ID) {
		notification: deleteNotification(id: $id)
	}
`;
export const CREATE_REVIEW_MUTATION = gql`
	mutation ($rate: Int!, $productId: String!, $comment: String) {
		review: createReview(
			rate: $rate
			productId: $productId
			comment: $comment
		) {
			id
			userId
			rating
			comment
		}
	}
`;

export const CREATE_CUSTOM_BOUQUET_MUTATION = gql`
	mutation CreateCustomBouquet(
		$mainFlower: String!
		$wrapper: String!
		$tie: String!
		$totalPrice: Float!
		$typeOfDelivery: OrderDeliveryType!
		$subFlowers: [String]
		$note: String
		$wrapperColor: String!
	) {
		createCustomBouquet(
			mainFlower: $mainFlower
			wrapper: $wrapper
			tie: $tie
			totalPrice: $totalPrice
			typeOfDelivery: $typeOfDelivery
			subFlowers: $subFlowers
			note: $note
			wrapperColor: $wrapperColor
		) {
			id
			status
			formattedId
			totalPrice
			isPreOrder
			payment {
				checkoutUrl
			}
			typeOfDelivery
			typeOfPayment
			orderDate
			processedAt
			shippedAt
			forPickup
			cancelledAt
			completedAt
		}
	}
`;
