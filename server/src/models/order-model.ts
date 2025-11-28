import { Customize, FlowerQuantity, Prisma } from "@prisma/client";
import {
  endOfMonth,
  formatDate,
  getUnixTime,
  getYear,
  startOfMonth,
  sub,
  subMonths,
} from "date-fns";
import { prisma } from "../services/prisma.js";
import {
  OrderDeliveryType,
  OrderPaymentType,
  OrderStatus,
  OrderFilter,
} from "../types/index.js";
import { PaymentStatus } from "../types/payment.js";
import { createCustomizeBouquet, getStore } from "./index.js";
import { environment } from ".././environments/environment.js";

export const createOrder = async ({
  userId,
  totalPrice,
  items,
  typeOfPayment,
  status,
  typeOfDelivery,
  preOrder,
  payment,
  fee,
}: {
  fee?: number;
  totalPrice: number;
  userId?: string;
  items: {
    quantity: number;
    price: number;
    productId: string;
  }[];
  typeOfPayment: OrderPaymentType;
  status: OrderStatus;
  typeOfDelivery: OrderDeliveryType;
  preOrder?: boolean;
  payment?: {
    checkoutUrl: string;
    id: string;
    status?: PaymentStatus;
  };
}) => {
  const unixTimestamp = getUnixTime(new Date()); // Get current Unix timestamp
  const orderId = `ORD${unixTimestamp.toString().padStart(10, "0")}`;

  const order = await prisma.order.create({
    data: {
      totalPrice,
      status,
      typeOfDelivery,
      shippingFee: fee,
      typeOfPayment,
      isPreOrder: preOrder,
      formattedId: orderId,
      payment: payment?.id
        ? {
            create: {
              checkoutUrl: payment.checkoutUrl,
              paymentId: payment.id,
              status: payment?.status ? payment.status : "PENDING",
              userId: userId ? String(userId) : undefined,
            },
          }
        : undefined,
      customer: userId ? { connect: { id: userId } } : undefined,
      orderItems: {
        createMany: {
          data: items,
        },
      },
      processedAt:
        payment?.status === "SUCCESS" ? new Date().toISOString() : undefined,
      completedAt:
        payment?.status === "SUCCESS" ? new Date().toISOString() : undefined,
      forPickup:
        payment?.status === "SUCCESS" ? new Date().toISOString() : undefined,
      shippedAt:
        payment?.status === "SUCCESS" ? new Date().toISOString() : undefined,
    },
    include: {
      orderItems: true,
      payment: true,
      customer: !!userId,
    },
  });

  return order;
};

export const updateOrder = async (
  id: string,
  values: {
    status: OrderStatus;
  },
) => {
  const order = await prisma.order.findFirst({
    where: { id },
  });

  if (!order) throw new Error("Order not found!");

  let data: Prisma.OrderUpdateInput = {
    status: values.status,
  };

  if (values.status === "CANCELLED") {
    data.cancelledAt = new Date().toISOString();
  } else if (values.status === "READY_FOR_PICKUP") {
    data.forPickup = new Date().toISOString();
  } else if (values.status === "COMPLETED") {
    data.completedAt = new Date().toISOString();
  } else if (values.status === "SHIPPED") {
    data.shippedAt = new Date().toISOString();
  } else if (values.status === "PROCESSING") {
    data.processedAt = new Date().toISOString();
  }

  const updatedOrder = await prisma.order.update({
    data,
    where: {
      id,
    },
    include: {
      customer: true,
    },
  });

  return updatedOrder;
};

export const readOrder = async ({
  paymentId,
  id,
  formattedId,
}: {
  id?: string;
  paymentId?: string;
  formattedId?: string;
}) => {
  let where: Prisma.OrderWhereInput = {};

  if (id) {
    where = { id };
  }

  if (paymentId) {
    where = {
      payment: {
        id: paymentId,
      },
    };
  }

  if (formattedId) {
    where = {
      formattedId,
    };
  }

  if (!id && !paymentId && !formattedId) {
    throw new Error("No id or paymentId provided");
  }

  const order = await prisma.order.findFirst({
    where,
    include: {
      orderItems: true,
      payment: true,
      customer: true,
    },
  });

  return order;
};

export const readOrders = async ({
  filter,
  pagination,
  typeOfDelivery,
  typeOfPayment,
  isPreOrder,
  status = [
    "CANCELLED",
    "COMPLETED",
    "PENDING",
    "PROCESSING",
    "READY_FOR_PICKUP",
    "SHIPPED",
  ],
}: OrderFilter) => {
  // : Promise<PaginationResult<Order>>

  let where: Prisma.OrderWhereInput = {};

  if (filter) {
    where = {
      OR: [
        {
          formattedId: {
            contains: filter,
            mode: "insensitive",
          },
        },
        {
          customer: {
            email: {
              contains: filter,
              mode: "insensitive",
            },
          },
        },
      ],
    };
  }

  if (isPreOrder) {
    where.isPreOrder = isPreOrder;
  }

  if (typeOfDelivery) {
    where.typeOfDelivery = typeOfDelivery;
  }

  if (typeOfPayment) {
    where.typeOfPayment = typeOfPayment;
  }

  if (status) {
    where.status = {
      in: status,
    };
  }

  const orders = await prisma.order.findMany({
    where,
    skip: pagination ? pagination.limit * pagination?.page : undefined,
    take: pagination ? pagination.limit : undefined,
    include: {
      orderItems: {
        include: {
          product: true,
          customize: {
            include: {
              product: true,
            },
          },
        },
      },
      payment: true,
      customer: true,
      customize: {
        include: {
          product: true,

          // components: true,
        },
      },
    },
  });

  const total = await prisma.order.count({ where });

  const data = await Promise.all(
    orders.map(async (order) => {
      const customize = order.customize
        ? await readComponentsToGQL(order.customize as Customize)
        : null;

      const orderItems = await Promise.all(
        order.orderItems.map(async (item) => {
          return {
            ...item,

            customize: item.customize
              ? await readComponentsToGQL(item.customize as Customize)
              : null,
          };
        }),
      );

      return {
        ...order,
        customize,
        orderItems,
      };
    }),
  );

  return {
    hasNextPage: orders.length === pagination?.limit,
    total,
    data,
  };
};

export const readOrdersByUser = async (userId: string) => {
  const orders = await prisma.order.findMany({
    where: {
      customer: {
        id: userId,
      },
    },
    include: {
      orderItems: {
        include: {
          product: {
            include: {
              reviews: true,
              customize: true, // qqqq
            },
          },
          customize: {
            include: {
              product: true,
            },
          },
        },
      },
      customize: {
        include: {
          product: true,
        },
      },

      payment: true,
      customer: true,
    },
  });

  const data = (
    await Promise.all(
      (orders || []).map(async (order) => {
        console.log(order, "order, customize");

        const t = {
          ...order,
          customize: order.customize
            ? await readComponentsToGQL(order.customize as Customize)
            : null,
        };
        return t;
      }),
    )
  ).filter((c) => c !== null);

  // console.log(data, "qqq data");

  console.log(JSON.stringify(data, null, 2));

  return data;
};

export const getMonthlyRevenue = async (year?: number) => {
  // Get the current date (e.g., March 2025)
  const currentDate = new Date();

  // If no year is provided, calculate the last 12 months from the previous month
  if (!year) {
    const monthlyRevenue = [];

    // Start from the previous month (February 2025)
    const startMonthDate = subMonths(currentDate, 1); // February 2025

    // Loop through the last 12 months (from February 2025 to March 2024)
    for (let i = 0; i < 12; i++) {
      // Get the target month date
      const targetMonthDate = subMonths(startMonthDate, i);

      // Get the start and end of the current month
      const startDate = startOfMonth(targetMonthDate); // Start of the month
      const endDate = endOfMonth(targetMonthDate); // End of the month

      // Fetch orders for that specific month
      const orders = await prisma.order.findMany({
        where: {
          status: "COMPLETED",
          orderDate: {
            gte: startDate,
            lte: endDate,
          },
        },
      });

      // Sum the total revenue for that month
      const revenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);

      // Store the result for this month along with the month index (for sorting)
      monthlyRevenue.push({
        year: getYear(targetMonthDate),
        month: startDate.toLocaleString("default", { month: "long" }),
        monthIndex: startDate.getMonth(),
        revenue,
      });
    }

    // Sort by year and month from oldest to most recent
    monthlyRevenue.sort((a, b) =>
      a.year === b.year ? a.monthIndex - b.monthIndex : a.year - b.year,
    );

    // Remove the monthIndex property before returning
    return monthlyRevenue.map(({ year, month, revenue }) => ({
      year,
      month,
      revenue,
    }));
  }

  // If a year is provided, calculate monthly revenue for that year
  const targetYear = year;

  // Array to store revenue for each of the months in the provided year
  const monthlyRevenueForYear = [];

  // Loop through the 12 months of the specified year
  for (let i = 0; i < 12; i++) {
    // Set the target month for the specified year
    const targetMonthDate = new Date(targetYear, i, 1); // e.g., January 2024, February 2024, etc.

    // Get the start and end of the current month
    const startDate = startOfMonth(targetMonthDate); // Start of the month
    const endDate = endOfMonth(targetMonthDate); // End of the month

    // Fetch orders for that specific month
    const orders = await prisma.order.findMany({
      where: {
        orderDate: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    // Sum the total revenue for that month
    const revenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);

    // Store the result for this month along with the month index (for sorting)
    monthlyRevenueForYear.push({
      year: targetYear,
      month: startDate.toLocaleString("default", { month: "long" }),
      monthIndex: startDate.getMonth(),
      revenue,
    });
  }

  // Sort by month from oldest to most recent (year is the same for all)
  monthlyRevenueForYear.sort((a, b) => a.monthIndex - b.monthIndex);

  // Remove the monthIndex property before returning
  return monthlyRevenueForYear.map(({ year, month, revenue }) => ({
    year,
    month,
    revenue,
  }));
};

export const getLastMonthData = async () => {
  const newOrdersCount = await prisma.order.findMany({
    where: {
      orderDate: {
        gte: sub(new Date(), { months: 1 }),
      },
    },
  });

  const totalOrdersCount = await prisma.order.count();

  const orderPercentage =
    totalOrdersCount > 0 ? (newOrdersCount.length / totalOrdersCount) * 100 : 0;

  const newUserCount = await prisma.user.count({
    where: {
      createdAt: {
        gte: sub(new Date(), { months: 1 }),
      },
      role: "USER",
    },
  });

  const totalUserCount = await prisma.order.count();

  const userPercentage =
    totalOrdersCount > 0 ? (newUserCount / totalUserCount) * 100 : 0;

  const orders = await prisma.order.findMany({
    select: {
      totalPrice: true,
    },
  });

  const overallRevenue = orders.reduce((acc, curr) => acc + curr.totalPrice, 0);
  const lastMonthRevenue = newOrdersCount.reduce(
    (acc, curr) => acc + curr.totalPrice,
    0,
  );
  const revenuePercentage =
    overallRevenue > 0 ? (lastMonthRevenue / overallRevenue) * 100 : 0;

  return {
    orders: {
      lastMonth: newOrdersCount.length,
      overAll: totalOrdersCount,
      percentage: orderPercentage.toFixed(2),
    },
    users: {
      lastMonth: newUserCount,
      overAll: totalUserCount,
      percentage: userPercentage.toFixed(2),
    },
    revenues: {
      overAll: overallRevenue,
      lastMonth: lastMonthRevenue,
      percentage: revenuePercentage.toFixed(2),
    },
  };
};

export const getOrderSummary = async () => {
  // Group orders by status and count each
  const ordersGrouped = await prisma.order.groupBy({
    by: ["status"],
    _count: {
      status: true,
    },
  });

  // Total orders count
  const totalOrders = await prisma.order.count();

  // Calculate percentage for each status
  return ordersGrouped.map((group) => {
    const count = group._count.status;
    const percentage = totalOrders > 0 ? (count / totalOrders) * 100 : 0;
    return {
      status: group.status,
      count,
      percentage: Number(percentage.toFixed(2)),
    };
  });
};

export const createCustomizeOrder = async ({
  mainFlower,
  name,
  subFlowers,
  tie,
  totalPrice,
  wrapper,
  note,
  typeOfDelivery,
  userId,
  wrapperColor,
}: {
  name: string;
  mainFlower: string;
  subFlowers: string[];
  wrapper: string;
  tie: string;
  totalPrice: number;
  note?: string;
  typeOfDelivery: OrderDeliveryType;
  userId: string;
  wrapperColor: string;
}) => {
  const unixTimestamp = getUnixTime(new Date()); // Get current Unix timestamp
  const formattedId = `ORD${unixTimestamp.toString().padStart(10, "0")}`;

  const url = "https://api.paymongo.com/v1/checkout_sessions";
  const store = await getStore();

  const options = {
    method: "POST",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      authorization: `Basic ${process.env.PAYMONGO_SECRET}`,
    },
    body: JSON.stringify({
      data: {
        attributes: {
          send_email_receipt: true,
          show_description: true,
          show_line_items: true,
          description: "Payment for custom bouquet",
          line_items: [
            {
              currency: "PHP",
              quantity: 1,
              amount: totalPrice * 100,
              name: name,
              description: "Information about the custom bouquet",
              images: [
                "https://img.freepik.com/premium-vector/giving-flowers-bouquet-present-icon_98396-113210.jpg",
              ],
            },
            {
              currency: "PHP",
              quantity: 1,
              amount: Number(store?.deliveryFee || 0) * 100,
              name: "Delivery Fee",
              description: "Charge for delivery",
              images: [
                "https://cdn1.iconfinder.com/data/icons/logistics-transportation-vehicles/202/logistic-shipping-vehicles-002-512.png",
              ],
            },
          ],
          payment_method_types: ["gcash"],
          success_url: `${environment.CLIENT_URL}/checkout/success`,
          cancel_url: `${environment.CLIENT_URL}/checkout/cancel`,
        },
      },
    }),
  };

  const response = await fetch(url, options);
  const data = await response.json();

  if (response.status !== 200) {
    throw new Error("Failed to order");
  }

  const payment = {
    checkoutUrl: data.data.attributes.checkout_url,
    id: data.data.id,
  };

  const customizeBouquet = await createCustomizeBouquet({
    mainFlower,
    name,
    subFlowers,
    tie,
    totalPrice,
    wrapper,
    note,

    wrapperColor,
  });

  if (!customizeBouquet) {
    throw new Error("Failed to create customize bouquet");
  }

  const order = await prisma.order.create({
    data: {
      formattedId,
      totalPrice,
      typeOfDelivery,
      shippingFee: store?.deliveryFee,
      typeOfPayment: "GCASH",
      payment: {
        create: {
          checkoutUrl: payment.checkoutUrl,
          userId,
          status: "PENDING",
          paymentId: payment.id,
        },
      },
      isPreOrder: true,
      status: "PENDING",
      customer: {
        connect: {
          id: userId,
        },
      },
      customize: {
        connect: {
          id: customizeBouquet.id,
        },
      },
    },
    include: {
      payment: true,
      customize: true,
    },
  });

  if (!order) {
    throw new Error("Failed to create order");
  }

  return order;
};

// LATEST: 2025-08-21
export const createOrderWithCustomization = async ({
  customData,
  deliveryType,
  customerId,
}: {
  customData: {
    productId: string;
    note?: string;
    totalPrice: number;
    flowerComponents: string[];
    wrapperComponent: string;
    otherProducts?: string[];
    wrapperColor?: string;
    flowerComponentsQuantity: FlowerQuantity[];
  };
  deliveryType?: OrderDeliveryType;
  customerId: string;
}) => {
  return await prisma.$transaction(async (prsm) => {
    const product = await readProductWithComponents(customData.productId);
    const name = `${product.name} | Customize #${formatDate(new Date(), "yyyyMMdd")}`;
    const unixTimestamp = getUnixTime(new Date()); // Get current Unix timestamp
    const formattedId = `ORD${unixTimestamp.toString().padStart(10, "0")}`;

    const url = "https://api.paymongo.com/v1/checkout_sessions";
    const store = await getStore();

    const line_items = [
      {
        currency: "PHP",
        quantity: 1,
        amount: customData.totalPrice * 100,
        name,
        description: "Information about the custom bouquet",
        images: [
          "https://img.freepik.com/premium-vector/giving-flowers-bouquet-present-icon_98396-113210.jpg",
        ],
      },
    ];

    if (deliveryType === "DELIVERY") {
      line_items.push({
        currency: "PHP",
        quantity: 1,
        amount: Number(store?.deliveryFee || 0) * 100,
        name: "Delivery Fee",
        description: "Charge for delivery",
        images: [
          "https://cdn1.iconfinder.com/data/icons/logistics-transportation-vehicles/202/logistic-shipping-vehicles-002-512.png",
        ],
      });
    }

    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        authorization: `Basic ${process.env.PAYMONGO_SECRET}`,
      },
      body: JSON.stringify({
        data: {
          attributes: {
            send_email_receipt: true,
            show_description: true,
            show_line_items: true,
            description: "Payment for custom bouquet",
            line_items,
            payment_method_types: ["gcash"],
            success_url: `${environment.CLIENT_URL}/checkout/success`,
            cancel_url: `${environment.CLIENT_URL}/checkout/cancel`,
          },
        },
      }),
    };

    const response = await fetch(url, options);
    const data = await response.json();

    if (response.status !== 200) {
      console.log(data, "response");
      throw new Error("Failed to order");
    }

    const payment = {
      checkoutUrl: data.data.attributes.checkout_url,
      id: data.data.id,
    };

    const count = await prisma.customize.count();

    const customizedBouquet = await prsm.customize.create({
      data: {
        name: `CSTM${count.toString().padEnd(4, "0")}`,
        note: customData.note || "",
        totalPrice: customData.totalPrice,
        wrapperColor: customData.wrapperColor || "",
        wrapperComponent: customData.wrapperComponent,
        otherProducts: customData.otherProducts,
        flowerComponents: {
          set: customData.flowerComponents,
        },
        product: {
          connect: { id: customData.productId },
        },
        order: {
          create: {
            formattedId,
            totalPrice: customData.totalPrice,
            typeOfDelivery: deliveryType || "PICKUP",
            shippingFee: store?.deliveryFee,

            typeOfPayment: "GCASH",
            payment: {
              create: {
                checkoutUrl: payment.checkoutUrl,
                status: "PENDING",
                paymentId: payment.id,
              },
            },
            status: "PENDING",
            customer: {
              connect: {
                id: customerId,
              },
            },
          },
        },
      },
      include: {
        product: true,
        order: {
          include: {
            payment: true,
            customer: true,
          },
        },
      },
    });

    if (!customizedBouquet) {
      throw new Error("Failed to create customize bouquet");
    }

    const flowerComponents = await Promise.all(
      customizedBouquet.flowerComponents.map(async (fl) => {
        return await prisma.component.findFirst({ where: { id: fl } });
      }),
    );

    // const wrapperComponent = await prisma.component.findFirst({
    //   where: { id: customizedBouquet.wrapperComponent },
    // });

    const otherProducts = await Promise.all(
      customizedBouquet.otherProducts.map(async (op) => {
        return await prisma.product.findFirst({ where: { id: op } });
      }),
    );

    flowerComponents
      .filter((fl) => !!fl)
      .map((fl) => ({
        ...fl,
        createdAt: fl?.createdAt.toISOString(),
        updatedAt: fl?.updatedAt.toISOString(),
      }));

    otherProducts
      .filter((fl) => !!fl)
      .map((fl) => ({
        ...fl,
        createdAt: fl?.createdAt.toISOString(),
        updatedAt: fl?.updatedAt.toISOString(),
      }));

    return customizedBouquet.order.pop();
  });
};

const readWrapperComponent = async (id?: string) => {
  const wrapperComponent = await prisma.component.findFirst({
    where: { id },
  });
  return wrapperComponent
    ? {
        ...wrapperComponent,
        createdAt: wrapperComponent?.createdAt.toISOString(),
        updatedAt: wrapperComponent?.updatedAt.toISOString(),
      }
    : null;
};

const readFlowerComponents = async (ids: string[]) => {
  console.log(ids, "ids");
  return (
    await Promise.all(
      ids.map(async (flower) => {
        const flwr = await prisma.component.findFirst({
          where: { id: flower },
        });
        return {
          ...flwr,

          createdAt: flwr?.createdAt.toISOString(),
          updatedAt: flwr?.updatedAt.toISOString(),
        };
      }),
    )
  )
    .filter((fl) => fl !== undefined)
    .filter((fl) => fl !== null);
};

const readProductWithComponents = async (id: string) => {
  const product = await prisma.product.findFirst({
    where: { id },
  });
  return {
    ...product,
    flowerComponents: await readFlowerComponents(
      product?.flowerComponents || [],
    ),
    wrapperComponent: await readWrapperComponent(
      product?.wrapperComponent || undefined,
    ),
    otherProducts: await Promise.all(
      (product?.otherProducts || []).map(async (prd) => {
        const prdct = await prisma.product.findFirst({
          where: { id: prd },
        });
        return {
          ...prdct,
          flowerComponents: await readFlowerComponents(
            prdct?.flowerComponents || [],
          ),
          wrapperComponent: await readWrapperComponent(
            prdct?.wrapperComponent || undefined,
          ),

          createdAt: prdct?.createdAt.toISOString(),
          updatedAt: prdct?.updatedAt.toISOString(),
        };
      }),
    ),
    createdAt: product?.createdAt.toISOString(),
    updatedAt: product?.updatedAt.toISOString(),
  };
};

export const readComponentsToGQL = async (customize: any) => {
  console.log(customize, "customize qqq");

  const flowerComponents = await readFlowerComponents(
    customize.flowerComponents || [],
  );
  console.log(flowerComponents, "qqqqq");

  const wrapperComponent = await prisma.component.findFirst({
    where: { id: customize.wrapperComponent },
  });

  const otherProducts = (
    await Promise.all(
      (customize.otherProducts || []).map(async (prdct: string) => {
        return await readProductWithComponents(prdct);
      }),
    )
  )
    .filter((product) => product !== undefined)
    .filter((product) => product !== null);

  const product = await readProductWithComponents(customize.productId);

  const t = {
    ...customize,
    flowerComponents,
    wrapperComponent,
    otherProducts,
    product,
    createdAt: customize.createdAt.toISOString(),
    updatedAt: customize.updatedAt.toISOString(),
  };

  console.log(t, "qtqqwews");
  return t;
};
