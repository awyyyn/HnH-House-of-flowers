import { gql } from "@apollo/client";

export const userFragment = gql`
	fragment UserFragment on User {
		id
		email
		role
		status
		firstName
		lastName
		middleName
		birthDate
		photo
		phoneNumber
		verifiedAt
		birthDate
		address {
			city
			street
			zone
		}
		createdAt
		updatedAt
	}
`;

export const productFragment = gql`
	fragment ProductFragment on Product {
		id
		name
		description
		price
		images
		stock
		status
		category
		createdAt
		updatedAt
	}
`;
