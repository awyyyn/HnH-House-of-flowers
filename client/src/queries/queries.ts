import { gql } from "@apollo/client";
import {
  componentFragment,
  customizeFragment,
  productFragment,
  storeImageFragment,
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
  query Products(
    $pagination: PaginationInput
    $category: ProductCategory
    $filter: String
    $status: [ProductStatus]
    $tags: [FlowerTag]
    $flowerVariants: [FlowerVariant]
  ) {
    products(
      category: $category
      pagination: $pagination
      filter: $filter
      status: $status
      tags: $tags
      flowerVariants: $flowerVariants
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
  ${componentFragment}
  query Product($id: ID!) {
    product(id: $id) {
      ...ProductFragment
      flowerComponents {
        ...ComponentFragment
      }
      wrapperComponent {
        ...ComponentFragment
      }
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
      hasNextPage
    }
  }
`;

export const READ_ORDERS_BY_USER_QUERY = gql`
  ${customizeFragment}
  ${productFragment}
  ${componentFragment}
  query {
    orders: readOrdersByUser {
      id
      status
      formattedId
      totalPrice
      isPreOrder
      shippingFee
      typeOfDelivery
      typeOfPayment
      customizeId
      customize {
        ...CustomizeFragment
        flowerComponents {
          ...ComponentFragment
        }
        wrapperComponent {
          ...ComponentFragment
        }
        otherProducts {
          ...ProductFragment
        }
      }
      # customize {
      #   id
      #   name
      #   note
      #   bouquetItems {
      #     subFlowers
      #     mainFlower
      #     wrapper
      #     wrapperColor
      #     tie
      #   }
      # }
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
  ${customizeFragment}
  ${componentFragment}
  ${productFragment}
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
        customizeId
        shippingFee
        customize {
          ...CustomizeFragment
          flowerComponents {
            ...ComponentFragment
          }
          wrapperComponent {
            ...ComponentFragment
          }
          otherProducts {
            ...ProductFragment
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
export const READ_STORE_SETTINGS_QUERY = gql`
  query {
    settings: readSettings {
      id
      storeName
      storeEmail
      storePhone
      storeDescription
      deliveryFee
      socialMedia {
        facebook
        instagram
      }
      policies {
        privacyPolicy
        returnPolicy
        shippingPolicy
        termsOfService
      }
      createdAt
      updatedAt
      storeAddress
    }
  }
`;

export const HOME_QUERY = gql`
  query ($take: Int) {
    topProducts: readBestSellingProducts(take: $take) {
      id
      images
      price
      name
      sold
    }
  }
`;

export const READ_PRODUCT_WITH_REVIEWS = gql`
  ${productFragment}
  ${componentFragment}
  query ReadReviews(
    $id: ID!
    $productId: String!
    $pagination: PaginationInput
  ) {
    reviews: readReviews(productId: $productId, pagination: $pagination) {
      total
      data {
        comment
        rating
        images
        id
        user {
          firstName
          lastName
          email
        }
      }
      hasNextPage
    }

    product(id: $id) {
      ...ProductFragment
      flowerComponents {
        ...ComponentFragment
      }
      wrapperComponent {
        ...ComponentFragment
      }
      otherProducts {
        ...ProductFragment
      }
    }
  }
`;

export const READ_COMPONENTS_QUERY = gql`
  ${componentFragment}
  query Components(
    $componentType: ComponentType
    $filter: String
    $pagination: PaginationInput
    $isAvailable: Boolean
  ) {
    components(
      componentType: $componentType
      filter: $filter
      pagination: $pagination
      isAvailable: $isAvailable
    ) {
      total
      data {
        ...ComponentFragment
      }
      hasNextPage
    }
  }
`;

export const READ_COMPONENT_QUERY = gql`
  ${componentFragment}
  query ($id: ID!) {
    component(id: $id) {
      ...ComponentFragment
    }
  }
`;

export const READ_STORE_IMAGES_QUERY = gql`
  ${storeImageFragment}
  query StoreImages($filter: String, $pagination: PaginationInput) {
    storeImages(filter: $filter, pagination: $pagination) {
      total
      data {
        ...StoreImageFragment
      }
      hasNextPage
    }
  }
`;

export const READ_STORE_IMAGE_QUERY = gql`
  ${storeImageFragment}
  query ($id: ID!) {
    storeImage(id: $id) {
      ...StoreImageFragment
    }
  }
`;

export const GET_CUSTOMIZE_OPTIONS_QUERY = gql`
  ${productFragment}
  ${componentFragment}
  query (
    $id: ID!
    $componentType: ComponentType
    $filter: String
    $pagination: PaginationInput
    $isAvailable: Boolean
    $giftsCategory: ProductCategory
    $chocolatesCategory: ProductCategory
  ) {
    product(id: $id) {
      ...ProductFragment
      flowerComponents {
        ...ComponentFragment
      }
      wrapperComponent {
        ...ComponentFragment
      }
    }
    components(
      componentType: $componentType
      filter: $filter
      pagination: $pagination
      isAvailable: $isAvailable
    ) {
      total
      data {
        ...ComponentFragment
      }
      hasNextPage
    }
    gifts: products(category: $giftsCategory) {
      data {
        ...ProductFragment
      }
      hasNextPage
      total
    }
    chocolates: products(category: $chocolatesCategory) {
      data {
        ...ProductFragment
      }
      hasNextPage
      total
    }
  }
`;
