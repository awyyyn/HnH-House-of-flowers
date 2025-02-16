import { gql } from "@apollo/client";
import { productFragment, userFragment } from "./fragments";

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
		$status: ProductStatus
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
