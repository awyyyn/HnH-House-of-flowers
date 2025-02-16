import { gql } from "graphql-tag";

export const typeDefs = gql`
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
			status: ProductStatus
			pagination: PaginationInput
		): ProductPaginationResult
		product(id: ID!): Product
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
		province: String
	}

	input AddressInput {
		zone: String
		street: String
		city: String
		province: String
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
		order: Order!
		price: Float!
		quantity: Int!
		isCustomize: Boolean!
		customize: Customize
	}

	type Order {
		id: ID!
		customer: User!
		status: OrderStatus!
		totalPrice: Float!

		orderItems: [OrderItem]

		orderDate: String!
		preOrderDate: String
		deliveryDate: String
	}

	enum OrderStatus {
		PENDING
		PROCESSING
		SHIPPED
		DELIVERED
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
		status: ProductStatus!
		category: ProductCategory!

		createdAt: String!
		updatedAt: String!
	}

	input ProductInput {
		name: String!
		description: String
		price: Float!
		images: [String]
		stock: Int!
		status: ProductStatus!
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
		description: String
		price: String
		orderItem: OrderItem
		createdAt: String!
		updatedAt: String!
	}
`;
