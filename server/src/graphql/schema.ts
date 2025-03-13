import { gql } from "graphql-tag";

export const typeDefs = gql`
	type Subscription {
		messageSent(userId: ID!, role: UserRole): Message
		notificationSent(userId: ID!, role: UserRole): Notification
	}

	type Query {
		user(filter: String!): User
		users(
			role: UserRole
			filter: String
			status: UserStatus
			pagination: PaginationInput
		): UsersPaginationResult
		products(
			category: ProductCategory
			filter: String
			status: [ProductStatus]
			pagination: PaginationInput
		): ProductPaginationResult
		product(id: ID!): Product
		readMessages(userId: ID!): [Message]
		adminMessages: UsersPaginationResult
		bouquetItems(
			filter: String
			type: [BouquetItemType]
			pagination: PaginationInput
			isAvailable: Boolean
		): BouquetItemPaginationResult
		orders(
			filter: String
			pagination: PaginationInput
			typeOfDelivery: OrderDeliveryType
			typeOfPayment: OrderPaymentType
			status: [OrderStatus]
			isPreOrder: Boolean
		): OrdersPaginationResult
		bouquetItem(id: ID!): BouquetItem
		readOrdersByUser: [Order]
		readMonthlyRevenue(year: Int): [MonthlyRevenue]
		lastMonthData: LastMonth
		readBestSellingProducts(take: Int): [TopSellingProduct]
		productsSummary: ProductSummary
		ordersSummary: [OrderSummary]
		readReviews(
			id: String!
			pagination: PaginationInput
		): ReviewPaginationResult
		readNotifications(pagination: PaginationInput): NotificationPaginationResult
		unReviewedProducts: [Product]
	}

	type Mutation {
		createAdmin(email: String!, password: String!): User
		blockUser(id: ID!, reason: String!, role: UserRole!): User
		unblockUser(id: ID!, role: UserRole!): User
		resetPassword(oldPassword: String!, newPassword: String!): User
		sendChangeEmailOTP(newEmail: String!): String
		updateEmail(newEmail: String!, otp: String!): UpdateUserResult
		updateUser(data: UpdateUserInput): User
		createProduct(
			name: String!
			description: String
			price: Float!
			images: [String]
			stock: Int!
			status: ProductStatus!
			category: ProductCategory!
		): Product
		updateProduct(id: ID!, data: ProductInput!): Product
		addToCart(
			price: Float!
			quantity: Int!
			productId: String!
			cartId: String
		): CartItem
		updateCartItem(id: ID!, price: Float!, quantity: Int!): CartItem
		removeToCart(id: ID!): CartItem
		sendMessage(receiverId: String!, content: String!): Message
		createBouquetItem(data: BouquetItemInput!): BouquetItem
		updateBouquetItem(id: ID!, data: BouquetItemInput!): BouquetItem
		createCheckoutSession(
			line_items: [LineItemInput!]!
			totalPrice: Float!
			typeOfDelivery: OrderDeliveryType!
			typeOfPayment: OrderPaymentType!
			preOrder: Boolean
			fromCartItem: Boolean
		): Order
		createOrder(
			line_items: [LineItemInput!]!
			totalPrice: Float!
			preOrder: Boolean
		): Order
		updateOrder(id: ID!, status: OrderStatus): Order
		createReview(
			rate: Int!
			images: [String]
			productId: String!
			comment: String
		): Review
		updateNotification(id: ID): String!
		deleteNotification(id: ID): String!
		createCustomBouquet(
			mainFlower: String!
			subFlowers: [String]
			wrapper: String!
			tie: String!
			totalPrice: Float!
			note: String
			typeOfDelivery: OrderDeliveryType!
			wrapperColor: String!
		): Order
	}

	type ProductSummary {
		total: Int!
		bouquetCount: Int!
		chocolateCount: Int!
		flowerCount: Int!
		giftCount: Int!
		bouquetPercentage: Float!
		flowerPercentage: Float!
		chocolatePercentage: Float!
		giftPercentage: Float!
	}

	type OrderSummary {
		count: Int!
		status: OrderStatus!
		percentage: Float!
	}

	enum OrderPaymentType {
		CASH
		GCASH
	}

	enum OrderDeliveryType {
		PICKUP
		DELIVERY
	}

	type MonthlyRevenue {
		year: Int!
		month: String!
		revenue: Float!
	}

	type LastMonth {
		orders: LastMonthItem!
		revenues: LastMonthItem!
		users: LastMonthItem!
	}

	type TopSellingProduct {
		id: ID!
		images: [String]
		price: Float!
		name: String!
		sold: Int!
	}

	type LastMonthItem {
		lastMonth: Int!
		overAll: Int!
		percentage: Float!
	}

	input LineItemInput {
		cartItemId: String
		amount: Float!
		id: String!
		name: String!
		images: [String]!
		quantity: Int!
	}

	input UpdateUserInput {
		firstName: String
		lastName: String
		middleName: String
		photo: String
		phoneNumber: String
		verifiedAt: String
		status: UserStatus
		birthDate: String
		address: AddressInput
	}

	type UpdateUserResult {
		accessToken: String!
		data: User
	}

	input PaginationInput {
		page: Int!
		limit: Int!
	}

	type UsersPaginationResult {
		total: Int!
		data: [User]
		hasNextPage: Boolean!
	}

	type ProductPaginationResult {
		total: Int!
		data: [Product]
		hasNextPage: Boolean!
	}

	type ReviewPaginationResult {
		total: Int!
		data: [Review]
		hasNextPage: Boolean!
	}

	type NotificationPaginationResult {
		total: Int!
		data: [Notification]
		hasNextPage: Boolean!
	}

	type BouquetItemPaginationResult {
		total: Int!
		data: [BouquetItem]
		hasNextPage: Boolean!
	}

	type OrdersPaginationResult {
		total: Int!
		data: [Order]
		hasNextPage: Boolean!
	}

	"""
	User type
	"""
	type User {
		id: ID!
		email: String!
		role: UserRole!
		status: UserStatus!

		firstName: String
		lastName: String
		middleName: String
		password: String
		photo: String
		phoneNumber: String
		birthDate: String
		verifiedAt: String
		address: Address

		orders: [Order]

		createdAt: String!
		updatedAt: String!
	}

	type Address {
		zone: String
		street: String
		city: String
	}

	input AddressInput {
		zone: String
		street: String
		city: String
	}

	enum UserRole {
		SUPER_ADMIN
		ADMIN
		USER
	}

	enum UserStatus {
		VERIFIED
		UNVERIFIED
		DELETED
	}

	type OrderItem {
		id: ID!
		order: Order
		orderId: String
		price: Float!
		quantity: Int!

		productId: String
		product: Product
	}

	type Order {
		id: ID!
		customer: User
		status: OrderStatus!
		formattedId: String!
		totalPrice: Float!
		isPreOrder: Boolean!

		orderItems: [OrderItem]

		payment: Payment
		typeOfDelivery: OrderDeliveryType
		typeOfPayment: OrderPaymentType

		orderDate: String!
		processedAt: String
		shippedAt: String
		forPickup: String
		cancelledAt: String
		completedAt: String
	}

	enum OrderStatus {
		PENDING
		PROCESSING
		SHIPPED
		COMPLETED
		CANCELLED
		READY_FOR_PICKUP
	}

	type Product {
		id: ID!
		name: String!
		description: String
		price: Float!
		images: [String]
		stock: Int!
		avg: Float

		status: ProductStatus!
		category: ProductCategory!
		reviews: [Review]

		createdAt: String!
		updatedAt: String!
	}

	input ProductInput {
		name: String!
		description: String
		price: Float!
		images: [String]
		stock: Int!
		status: [ProductStatus]!
		category: ProductCategory!
	}

	enum ProductStatus {
		PRE_ORDER
		DISCONTINUED
		IN_STOCK
		OUT_OF_STOCK
	}

	enum ProductCategory {
		FLOWER
		BOUQUET
		CHOCOLATE
		GIFT
	}

	type Customize {
		id: ID!
		name: String!
		note: String

		totalPrice: Float
		bouquetItems: BouquetItems

		createdAt: String!
		updatedAt: String!
	}

	type Message {
		id: ID!
		senderId: String!
		receiverId: String!
		sender: User!
		receiver: User!

		content: String
		createdAt: String
		updatedAt: String
	}

	type Cart {
		id: ID!
		userId: String!
		user: User!
		items: [CartItem]

		updatedAt: String
		createdAt: String
	}

	type CartItem {
		id: ID!
		product: Product!
		productId: String!
		quantity: Int!
		cartId: String!
		cart: Cart!

		price: Float!
	}

	type BouquetItem {
		id: ID!
		name: String!
		price: Float!
		svg: [String]
		colors: [String]
		type: BouquetItemType!
		isAvailable: Boolean!
		createdAt: String!
		updatedAt: String!
	}

	enum BouquetItemType {
		WRAPPER
		TIE
		FLOWER
		SUB_FLOWER
	}

	type BouquetItems {
		subFlowers: [String]
		mainFlower: String
		wrapper: String
		wrapperColor: String
		tie: String
	}

	input BouquetItemInput {
		name: String!
		price: Float!
		svg: [String]
		colors: [String]
		type: BouquetItemType!
		isAvailable: Boolean!
	}

	type Payment {
		id: ID!
		checkoutUrl: String!
		status: PaymentStatus!
		paymentId: String!
		orderId: String!
		order: Order!
		userId: String
		user: User

		createdAt: String!
	}

	enum PaymentStatus {
		PENDING
		SUCCESS
		FAILED
		CANCELLED
	}

	type Notification {
		id: ID!
		userId: String!
		user: User!
		title: String!
		message: String!
		type: NotificationType!
		read: Boolean!
		toShop: Boolean!
		idToGo: String!

		createdAt: String!
		updatedAt: String!
	}

	enum NotificationType {
		ORDER
		MESSAGE
		PRE_ORDER
		REVIEW
	}

	type Review {
		id: ID!
		userId: String!
		user: User!
		productId: String!
		product: Product!
		rating: Int!
		comment: String
		images: [String]
		createdAt: String
		updatedAt: String
	}
`;
