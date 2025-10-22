import { sub } from "date-fns";
import { prisma } from "../services/prisma.js";
import { Component, ProductFilter, ProductInput } from "../types/index.js";
import { Prisma } from "@prisma/client";

export const createProduct = async (values: ProductInput) => {
  return await prisma.$transaction(async (prsma) => {
    let components: Component[] = [];
    let wrapperComponent: any | null = null;
    let products: any[] = [];

    if (values?.flowerComponents && values.flowerComponents.length > 0) {
      components = (
        await Promise.all(
          values.flowerComponents.map(async (id) => {
            const cmpnnt = await prsma.component.update({
              where: {
                id,
                quantity: {
                  gte: 1,
                },
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

    if (values.wrapperComponent) {
      wrapperComponent = await prisma.component.update({
        where: {
          id: values.wrapperComponent,
          quantity: {
            gte: 1,
          },
        },
        data: {
          quantity: {
            decrement: 1,
          },
        },
      });

      if (!wrapperComponent)
        throw new Error("There was an error updating product!");

      wrapperComponent = await prisma.component.findUnique({
        where: { id: values.wrapperComponent },
      });

      wrapperComponent = {
        ...wrapperComponent,
        createdAt: wrapperComponent.createdAt.toISOString(),
        updatedAt: wrapperComponent.updatedAt.toISOString(),
      };
    }

    if (values.otherProducts && values.otherProducts.length > 0) {
      products = await Promise.all(
        values.otherProducts.map(async (id) => {
          const product = await prisma.product.update({
            where: {
              id,
              stock: {
                gte: 1,
              },
            },
            data: {
              stock: {
                decrement: 1,
              },
            },
          });

          if (!product) throw new Error("There was an error updating product!");

          return {
            ...product,
            createdAt: product.createdAt.toISOString(),
            updatedAt: product.updatedAt.toISOString(),
          };
        }),
      );
    }

    const newProduct = await prisma.product.create({
      data: {
        ...values,
      },
    });

    if (!newProduct) throw new Error("Failed to create product");

    console.log(values, "qqq values");
    console.log(wrapperComponent, "qqq wrapperComponents");
    console.log(components, "qqq flowerComponents");

    return {
      ...newProduct,
      flowerComponents: components,
      wrapperComponent,
      otherProducts: products,
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
    let flowerComponents: Component[] = [];
    let wrapperComponent: Component | null = null;
    let otherProducts: any[] = [];

    if (
      updatedProduct?.flowerComponents &&
      updatedProduct.flowerComponents.length > 0
    ) {
      flowerComponents = (
        await Promise.all(
          updatedProduct.flowerComponents.map(async (id) => {
            const cmpnnt = await prsma.component.update({
              where: {
                id,
                quantity: {
                  gte: 1,
                },
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

    if (updatedProduct?.wrapperComponent) {
      wrapperComponent = await prisma.component
        .update({
          where: {
            id: updatedProduct.wrapperComponent,
            quantity: {
              gte: 1,
            },
          },
          data: {
            quantity: {
              decrement: 1,
            },
          },
        })
        .then((data) => {
          return {
            ...data,
            createdAt: new Date(data.createdAt).toISOString(),
            updatedAt: new Date(data.updatedAt).toISOString(),
          };
        });

      if (!wrapperComponent)
        throw new Error("There was an error updating product!");
    }

    if (
      updatedProduct.otherProducts &&
      updatedProduct.otherProducts.length > 0
    ) {
      otherProducts = await Promise.all(
        updatedProduct.otherProducts.map(async (id) => {
          const otherProductUpdate = await prisma.product.update({
            where: {
              id,
              stock: {
                gte: 1,
              },
            },
            data: {
              stock: {
                decrement: 1,
              },
            },
          });

          if (!otherProductUpdate)
            throw new Error("There was an error updating product!");

          return {
            ...otherProductUpdate,
            createdAt: new Date(otherProductUpdate.createdAt).toISOString(),
            updatedAt: new Date(otherProductUpdate.updatedAt).toISOString(),
          };
        }),
      );
    }

    return {
      ...updatedProduct,
      flowerComponents,
      wrapperComponent,
      otherProducts,
    };
  });
};

export const readProduct = async (filter: string) => {
  const product = await prisma.product.findFirst({
    where: {
      id: filter,
    },
  });

  let flowerComponents: Component[] = [];
  let wrapperComponent: any | null = null;
  let otherProducts: any[] = [];

  if (product?.flowerComponents.length) {
    flowerComponents = (
      await Promise.all(
        product.flowerComponents.map(async (id) => {
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

  if (product?.wrapperComponent) {
    wrapperComponent = await prisma.component.findUnique({
      where: { id: product.wrapperComponent },
    });

    wrapperComponent = {
      ...wrapperComponent,
      createdAt: wrapperComponent.createdAt.toISOString(),
      updatedAt: wrapperComponent.updatedAt.toISOString(),
    };
  }

  if (product?.otherProducts.length) {
    otherProducts = (
      await Promise.all(
        product.otherProducts.map(async (id) => {
          return await prisma.product.findUnique({
            where: { id },
          });
        }),
      )
    )
      .filter((p) => p !== null)
      .map((p) => ({
        ...p,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
      }));
  }

  return {
    ...product,
    flowerComponents,
    wrapperComponent,
    otherProducts,
  };
};

export const readProducts = async ({
  filter,
  pagination,
  category,
  status,
  tags,
  flowerVariants,
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

  if (flowerVariants && flowerVariants.length > 0) {
    where.flowerVariant = {
      in: flowerVariants,
    };
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

      let flowerComponents: Component[] = [];
      let wrapperComponent: any | null = null;
      let otherProducts: any[] = [];

      if (product.flowerComponents.length) {
        flowerComponents = (
          await Promise.all(
            product.flowerComponents.map(async (id) => {
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

      if (product.wrapperComponent) {
        wrapperComponent = await prisma.component.findUnique({
          where: { id: product.wrapperComponent },
        });

        wrapperComponent = {
          ...wrapperComponent,
          createdAt: wrapperComponent.createdAt.toISOString(),
          updatedAt: wrapperComponent.updatedAt.toISOString(),
        };
      }

      if (product.otherProducts.length > 0) {
        otherProducts = (
          await Promise.all(
            product.otherProducts.map(async (id) => {
              return await prisma.product.findUnique({
                where: { id },
              });
            }),
          )
        )
          .filter((p) => p !== null)
          .map((p) => ({
            ...p,
            createdAt: p.createdAt.toISOString(),
            updatedAt: p.updatedAt.toISOString(),
          }));
      }

      return {
        ...product,
        flowerComponents,
        otherProducts,
        wrapperComponent,
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
              gte: sub(new Date(), { days: 30 }),
            },
          },
        },
      },
      //
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
      Customize: true,

      price: true,
      category: true,
      orderItem: true,
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
