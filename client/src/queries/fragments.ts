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
		createdAt
		updatedAt
	}
`;
