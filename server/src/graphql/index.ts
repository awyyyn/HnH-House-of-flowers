export * from "./resolver.js";
export * from "./schema.js";

/* 

    import { PrismaClient } from "@prisma/client";
import { startOfMonth, endOfMonth, subMonths } from "date-fns";

const prisma = new PrismaClient();

const resolvers = {
  Query: {
    // 1. Revenue from last month
    async revenueLastMonth() {
      // Get the first and last date of the previous month
      const lastMonthStart = startOfMonth(subMonths(new Date(), 1)); // Start of last month
      const lastMonthEnd = endOfMonth(subMonths(new Date(), 1)); // End of last month

      const orders = await prisma.order.findMany({
        where: {
          orderDate: {
            gte: lastMonthStart,
            lte: lastMonthEnd,
          },
        },
      });

      // Sum the totalPrice of all orders from last month
      const revenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);
      return revenue;
    },

    // 2. Orders from last month
    async ordersLastMonth() {
      // Get the first and last date of the previous month
      const lastMonthStart = startOfMonth(subMonths(new Date(), 1)); // Start of last month
      const lastMonthEnd = endOfMonth(subMonths(new Date(), 1)); // End of last month

      const orders = await prisma.order.findMany({
        where: {
          orderDate: {
            gte: lastMonthStart,
            lte: lastMonthEnd,
          },
        },
      });

      return orders;
    },

    // 3. New customers from last month
    async newCustomersLastMonth() {
      // Get the first and last date of the previous month
      const lastMonthStart = startOfMonth(subMonths(new Date(), 1)); // Start of last month
      const lastMonthEnd = endOfMonth(subMonths(new Date(), 1)); // End of last month

      const newCustomers = await prisma.user.findMany({
        where: {
          createdAt: {
            gte: lastMonthStart,
            lte: lastMonthEnd,
          },
        },
      });

      return newCustomers;
    },

    // 4. Total products available (in stock)
    async totalProductsAvailable() {
      const products = await prisma.product.findMany({
        where: {
          status: 'IN_STOCK',
        },
      });

      // Sum up the stock of all available products
      const totalStock = products.reduce((acc, product) => acc + product.stock, 0);
      return totalStock;
    },
  },
};

export default resolvers;

*/
