import {
  createNotification,
  createOrder,
  createOrderWithCustomization,
  getLastMonthData,
  getMonthlyRevenue,
  getOrderSummary,
  readOrders,
  readOrdersByUser,
  updateOrder,
} from "../../models/index.js";
import { pubsub } from "../../services/pubsub.js";
import {
  AppContext,
  OrderDeliveryType,
  OrderFilter,
  OrderStatus,
} from "../../types/index.js";
import { generateNotificationContent } from "../../utils/index.js";
import { GraphQLError } from "graphql";
import { v4 as uuidv4 } from "uuid";

export const readOrdersResolver = async (
  _: never,
  {
    filter,
    pagination,
    isPreOrder,
    status,
    typeOfDelivery,
    typeOfPayment,
  }: OrderFilter,
) => {
  try {
    const t = await readOrders({
      filter,
      pagination,
      status,
      typeOfDelivery,
      typeOfPayment,
      isPreOrder,
    });
    console.log(JSON.stringify(t, null, 2));

    return t;
  } catch (error) {
    throw new GraphQLError((error as GraphQLError).message);
  }
};

export const readOrdersByUserResolver = async (
  _: never,
  __: never,
  app: AppContext,
) => {
  try {
    return await readOrdersByUser(app.id);
  } catch (error) {
    console.log(error);
    throw new GraphQLError((error as GraphQLError).message);
  }
};

export const updateOrderResolver = async (
  _: never,
  data: {
    id: string;
    status: OrderStatus;
  },
) => {
  try {
    const { id, status } = data;
    const updatedOrder = await updateOrder(id, { status });
    const notification = await createNotification({
      message: `Your order with id ${updatedOrder.formattedId} has been ${status
        .split("_")
        .join(" ")
        .toLowerCase()}`,
      userId: updatedOrder.customer?.id!,
      idToGo: updatedOrder.formattedId,
      type: "ORDER",
      title: "Order Status",
      toShop: true,
    });

    pubsub.publish("NOTIFICATION_SENT", { notificationSent: notification });

    return updatedOrder;
  } catch (error) {
    throw new GraphQLError((error as GraphQLError).message);
  }
};

export const createOrderResolver = async (
  _: never,
  {
    line_items,
    totalPrice,
    preOrder,
  }: {
    totalPrice: number;
    line_items: {
      cartItemId: string;
      amount: number;
      id: string;
      name: string;
      images: string[];
      quantity: number;
    }[];
    preOrder?: boolean;
  },
  app: AppContext,
) => {
  try {
    //
    const order = await createOrder({
      items: line_items.map((item) => ({
        price: item.amount,
        productId: item.id,
        quantity: item.quantity,
      })),
      status: "COMPLETED",
      totalPrice,
      typeOfDelivery: "PICKUP",
      userId: undefined,
      typeOfPayment: "CASH",

      preOrder,
      payment: {
        checkoutUrl: "no-checkout-url",
        id: uuidv4(),
        status: "SUCCESS",
      },
    });

    if (!order) {
      throw new GraphQLError("Failed to create order");
    }

    if (order.customerID) {
      const content = generateNotificationContent(
        "ORDER",
        order.status,
        order.customer?.firstName!,
      );

      const notification = await createNotification({
        message: content.message,
        userId: app.id!,
        type: "ORDER",
        idToGo: order.formattedId,
        title: content.title,
        toShop: true,
      });

      pubsub.publish("NOTIFICATION_SENT", { notificationSent: notification });
    }

    return order;
  } catch (error) {
    throw new GraphQLError((error as GraphQLError).message);
  }
};

export const readMonthlyRevenueResolver = async (
  _: never,
  { year }: { year?: number },
) => {
  try {
    return await getMonthlyRevenue(year);
  } catch (error) {
    throw new GraphQLError((error as GraphQLError).message);
  }
};

export const readLastMonthDataResolver = async () => {
  try {
    return await getLastMonthData();
  } catch (error) {
    throw new GraphQLError((error as GraphQLError).message);
  }
};

export const readOrdersSummaryResolver = async () => {
  try {
    return await getOrderSummary();
  } catch (error) {
    throw new GraphQLError((error as GraphQLError).message);
  }
};

export const createCustomizeOrderResolver = async (
  _: never,
  {
    customData,
    deliveryType,
  }: {
    customData: {
      productId: string;
      note?: string;
      totalPrice: number;
      flowerComponents: string[];
      wrapperComponent: string;
      otherProducts?: string[];
      wrapperColor?: string;
    };
    deliveryType?: OrderDeliveryType;
  },
  { id }: AppContext,
) => {
  try {
    const order = await createOrderWithCustomization({
      customData,
      customerId: id,
      deliveryType,
    });

    if (!order) {
      throw new GraphQLError("Failed to create customized order");
    }

    const content = generateNotificationContent(
      "ORDER",
      order.status,
      order.customer?.firstName!,
      true,
    );

    const notification = await createNotification({
      message: content.message,
      userId: id!,
      type: "ORDER",
      idToGo: order.formattedId,
      title: content.title,
      toShop: true,
    });
    pubsub.publish("NOTIFICATION_SENT", { notificationSent: notification });

    return order;
  } catch (error) {
    console.log(error);
    throw new GraphQLError((error as GraphQLError).message);
  }
};
