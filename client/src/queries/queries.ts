import { gql } from "@apollo/client";
import {
	bouquetItemFragment,
	productFragment,
	userFragment,
} from "./fragments";

export const getUserQuery = gql`
	${userFragment}
	query ($filter: String!) {
		user(filter: $filter) {
			...UserFragment
		}
	}
`;

export const getUsersQuery = gql`
	${userFragment}
	query (
		$pagination: PaginationInput
		$status: UserStatus
		$role: UserRole
		$filter: String
	) {
		users(
			pagination: $pagination
			status: $status
			role: $role
			filter: $filter
		) {
			total
			hasNextPage
			data {
				...UserFragment
			}
		}
	}
`;

export const GET_PRODUCTS_QUERY = gql`
	${productFragment}
	query (
		$pagination: PaginationInput
		$category: ProductCategory
		$filter: String
		$status: [ProductStatus]
	) {
		products(
			pagination: $pagination
			category: $category
			filter: $filter
			status: $status
		) {
			data {
				...ProductFragment
			}
			hasNextPage
			total
		}
	}
`;

export const GET_PRODUCT_QUERY = gql`
	${productFragment}
	query ($id: ID!) {
		product(id: $id) {
			...ProductFragment
		}
	}
`;

export const GET_USERS_BY_MESSAGE_QUERY = gql`
	query Query {
		adminMessages {
			total
			hasNextPage
			data {
				id
				firstName
				lastName
				email
				photo
			}
		}
	}
`;

export const GET_MESSAGES_QUERY = gql`
	query ReadMessages($userId: ID!) {
		readMessages(userId: $userId) {
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

export const GET_ALL_BOUQUET_ITEMS_QUERY = gql`
	${bouquetItemFragment}
	query (
		$isAvailable: Boolean
		$filter: String
		$type: [BouquetItemType]
		$pagination: PaginationInput
	) {
		bouquetItems(
			isAvailable: $isAvailable
			filter: $filter
			type: $type
			pagination: $pagination
		) {
			total
			data {
				...BouquetItemFragment
			}
			hasNextPage
		}
	}
`;

export const READ_ORDERS_BY_USER_QUERY = gql`
	query {
		orders: readOrdersByUser {
			id
			status
			formattedId
			totalPrice
			isPreOrder
			typeOfDelivery
			typeOfPayment
			orderItems {
				id
				orderId
				price
				quantity
				productId
				product {
					images
				}
			}
			payment {
				id
				checkoutUrl
				status
				paymentId
				orderId
				userId
				createdAt
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

export const READ_ORDERS_QUERY = gql`
	query Orders(
		$filter: String
		$pagination: PaginationInput
		$typeOfDelivery: OrderDeliveryType
		$typeOfPayment: OrderPaymentType
		$status: [OrderStatus]
	) {
		orders(
			filter: $filter
			pagination: $pagination
			typeOfDelivery: $typeOfDelivery
			typeOfPayment: $typeOfPayment
			status: $status
		) {
			total
			hasNextPage
			data {
				id
				customer {
					id
					firstName
					lastName
					address {
						zone
						city
						street
					}
				}
				status
				formattedId
				totalPrice
				isPreOrder
				orderItems {
					id
					product {
						name
						images
						id
					}
					price
					quantity
				}
				payment {
					checkoutUrl
					id
					checkoutUrl
					paymentId
					status
					userId
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
	}
`;
