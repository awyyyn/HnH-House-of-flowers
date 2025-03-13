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
			customizeId
			customize {
				id
				name
				note
				bouquetItems {
					subFlowers
					mainFlower
					wrapper
					wrapperColor
					tie
				}
			}
			orderItems {
				id
				orderId
				price
				quantity
				productId
				product {
					id
					images
					reviews {
						id
					}
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
		$isPreOrder: Boolean
	) {
		orders(
			filter: $filter
			pagination: $pagination
			typeOfDelivery: $typeOfDelivery
			typeOfPayment: $typeOfPayment
			status: $status
			isPreOrder: $isPreOrder
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

export const DASHBOARD_QUERY = gql`
	query ($year: Int, $take: Int, $pagination: PaginationInput) {
		revenues: readMonthlyRevenue(year: $year) {
			year
			month
			revenue
		}
		topProducts: readBestSellingProducts(take: $take) {
			id
			images
			price
			name
			sold
		}
		lastMonthData {
			orders {
				lastMonth
				overAll
				percentage
			}
			revenues {
				lastMonth
				overAll
				percentage
			}
			users {
				lastMonth
				overAll
				percentage
			}
		}

		products(pagination: $pagination) {
			data {
				id
				name
				price
				status
				stock
				images
				category
				description
			}
		}

		productsSummary {
			total
			bouquetCount
			chocolateCount
			flowerCount
			giftCount
			bouquetPercentage
			flowerPercentage
			chocolatePercentage
			giftPercentage
		}
		ordersSummary {
			count
			status
			percentage
		}
	}
`;

export const READ_NOTIFICATION_QUERY = gql`
	query ReadNotifications($pagination: PaginationInput) {
		readNotifications(pagination: $pagination) {
			total
			data {
				createdAt
				id
				message
				title
				type
				user {
					id
					firstName
					lastName
				}
				idToGo
			}
			hasNextPage
		}
	}
`;
export const READ_UNREVIEW_PRODUCT_QUERY = gql`
	${productFragment}
	query ($id: ID!) {
		product(id: $id) {
			...ProductFragment
		}
		products: unReviewedProducts {
			...ProductFragment
		}
	}
`;
