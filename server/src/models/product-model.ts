import { sub } from "date-fns";
import { prisma } from "../services/prisma.js";
import { Component, ProductFilter, ProductInput } from "../types/index.js";
import { Prisma } from "@prisma/client";

export const createProduct = async (values: ProductInput) => {
  return await prisma.$transaction(async (prsma) => {
    let components: Component[] = [];

    if (values?.components && values.components.length > 0) {
      components = (
        await Promise.all(
          values.components.map(async (id) => {
            const cmpnnt = await prsma.component.update({
              where: {
                id,
              },
              data: {
                quantity: {
                  decrement: 1,
                },
              },
            });

            if (!cmpnnt)
              throw new Error("There was an error updating product!");

            return await prsma.component.findUnique({
              where: { id },
            });
          }),
        )
      )
        .filter((c) => c !== null)
        .map((c) => ({
          ...c,
          createdAt: c.createdAt.toISOString(),
          updatedAt: c.updatedAt.toISOString(),
        }));
    }

    const newProduct = await prisma.product.create({
      data: values,
    });

    if (!newProduct) throw new Error("Failed to create product");

    return {
      ...newProduct,
      components,
    };
  });
};

export const updateProduct = async (
  id: string,
  values: Partial<ProductInput>,
) => {
  return await prisma.$transaction(async (prsma) => {
    const updatedProduct = await prsma.product.update({
      where: { id },
      data: values,
    });
    let components: Component[] = [];

    if (updatedProduct?.components.length) {
      components = (
        await Promise.all(
          updatedProduct.components.map(async (id) => {
            const cmpnnt = await prsma.component.update({
              where: {
                id,
              },
              data: {
                quantity: {
                  decrement: 1,
                },
              },
            });

            if (!cmpnnt)
              throw new Error("There was an error updating product!");

            return await prsma.component.findUnique({
              where: { id },
            });
          }),
        )
      )
        .filter((c) => c !== null)
        .map((c) => ({
          ...c,
          createdAt: c.createdAt.toISOString(),
          updatedAt: c.updatedAt.toISOString(),
        }));
    }

    return {
      ...updatedProduct,
      components,
    };
  });
};

export const readProduct = async (filter: string) => {
  const product = await prisma.product.findFirst({
    where: {
      id: filter,
    },
  });

  let components: Component[] = [];

  if (product?.components.length) {
    components = (
      await Promise.all(
        product.components.map(async (id) => {
          return await prisma.component.findUnique({
            where: { id },
          });
        }),
      )
    )
      .filter((c) => c !== null)
      .map((c) => ({
        ...c,
        createdAt: c.createdAt.toISOString(),
        updatedAt: c.updatedAt.toISOString(),
      }));
  }

  return {
    ...product,
    components,
  };
};

export const readProducts = async ({
  filter,
  pagination,
  category,
  status,
  tags,
}: ProductFilter = {}) => {
  const where: Prisma.ProductWhereInput = {};

  if (filter) {
    where.OR = [
      {
        name: { contains: filter },
      },
    ];
  }

  if (tags && tags?.length > 0) {
    where.OR = [
      {
        tags: {
          hasSome: tags,
        },
      },
    ];
  }

  if (category) {
    where.category = category;
  }

  if (status) {
    where.status = {
      in: status,
    };
  }

  const products = await prisma.product.findMany({
    where,
    skip: pagination ? pagination.limit * pagination?.page : undefined,
    take: pagination ? pagination.limit : undefined,
    include: {
      reviews: true,
    },
  });

  const total = await prisma.product.count({ where });

  let productsWithAverageRating = await Promise.all(
    products.map(async (product) => {
      const avg = await prisma.review.aggregate({
        _avg: {
          rating: true,
        },
        where: {
          productId: product.id,
        },
      });

      let components: Component[] = [];

      if (product.components.length) {
        components = (
          await Promise.all(
            product.components.map(async (id) => {
              return await prisma.component.findUnique({
                where: { id },
              });
            }),
          )
        )
          .filter((c) => c !== null)
          .map((c) => ({
            ...c,
            createdAt: c.createdAt.toISOString(),
            updatedAt: c.updatedAt.toISOString(),
          }));
      }

      return {
        ...product,
        components,
        avg: avg._avg?.rating || 0,
      };
    }),
  );

  return {
    data: productsWithAverageRating,
    hasNextPage: products.length === pagination?.limit,
    total,
  };
};

export const getBestSellingProducts = async (take: number = 5) => {
  let products = await prisma.product.findMany({
    where: {
      // createdAt: {
      // 	gte: sub(new Date(), { months: 1 }),
      // },
      orderItem: {
        some: {
          order: {
            completedAt: {
              gte: sub(new Date(), { months: 1 }),
            },
          },
        },
      },
    },
    select: {
      _count: {
        select: {
          orderItem: true,
        },
      },
      id: true,
      name: true,
      images: true,
      price: true,
      category: true,
    },
    orderBy: {
      orderItem: {
        _count: "desc",
      },
    },
    take,
  });

  products = products.filter((product) => product._count.orderItem > 0);

  return products.map((product) => ({
    ...product,
    sold: product._count.orderItem,
  }));
};

export const getProductSummary = async () => {
  const total = await prisma.product.count();

  const bouquetCount = await prisma.product.count({
    where: {
      category: "BOUQUET",
    },
  });

  const flowerCount = await prisma.product.count({
    where: {
      category: "FLOWER",
    },
  });

  const chocolateCount = await prisma.product.count({
    where: {
      category: "CHOCOLATE",
    },
  });

  const giftCount = await prisma.product.count({
    where: {
      category: "GIFT",
    },
  });

  return {
    total,
    bouquetCount,
    bouquetPercentage: total > 0 ? (bouquetCount / total) * 100 : 0,
    flowerCount,
    flowerPercentage: total > 0 ? (flowerCount / total) * 100 : 0,
    chocolateCount,
    chocolatePercentage: total > 0 ? (chocolateCount / total) * 100 : 0,
    giftCount,
    giftPercentage: total > 0 ? (giftCount / total) * 100 : 0,
  };
};
// Function to get products ordered by a user that haven't been reviewed yet
export async function getUnReviewedProductsByUser(userId: string) {
  // Find all completed orders by this user

  const reviews = await prisma.review.findMany({
    where: { userId },
    select: {
      productId: true,
    },
  });

  const completedOrders = await prisma.order.findMany({
    where: {
      customerID: userId,
      status: "COMPLETED",
    },
    include: {
      orderItems: {
        include: {
          product: {
            include: {
              reviews: true,
            },
          },
        },
      },
    },
  });

  const reviewsIds = reviews.map((review) => review.productId);
  const products = completedOrders.flatMap((t) =>
    t.orderItems.map((f) => f.product),
  );

  const filtered = products.filter(
    (product) => !reviewsIds.includes(product?.id!),
  );

  // Remove duplicates by using a Map with product IDs as keys
  const uniqueProducts = Array.from(
    new Map(filtered.map((product) => [product!.id, product])).values(),
  );

  return uniqueProducts;
}
