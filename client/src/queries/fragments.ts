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
    serviceFee
    otherFee
    price
    images
    stock
    status
    tags
    category
    createdAt
    updatedAt
  }
`;
export const bouquetItemFragment = gql`
  fragment BouquetItemFragment on BouquetItem {
    id
    name
    price
    svg
    colors
    type
    isAvailable
    createdAt
    updatedAt
  }
`;

export const componentFragment = gql`
  fragment ComponentFragment on Component {
    id
    name
    quantity
    description
    price
    image
    type
    isAvailable
    availableColors
    createdAt
    updatedAt
  }
`;
