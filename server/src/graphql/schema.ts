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
	}

	type Mutation {
		createAdmin(email: String!, password: String!): User
		blockUser(id: ID!, reason: String!, role: UserRole!): User
		unblockUser(id: ID!, role: UserRole!): User
	}

	input PaginationInput {
		page: Int!
		limit: Int!
	}

	type UsersPaginationResult {
		total: Int!
		users: [User]
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
		birthDate: String

		orders: [Order]

		createdAt: String!
		updatedAt: String!
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
