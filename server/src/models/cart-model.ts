import { AddCustomizeBouquetToCartInput } from "../types/cart.js";
import { prisma } from "../services/prisma.js";
import { readProduct } from "./product-model.js";
import { readComponentsToGQL } from "./order-model.js";
import { Customize } from "@prisma/client";

export const createCart = async ({ userId }: { userId: string }) => {
  const cart = await prisma.cart.create({
    data: {
      user: {
        connect: {
          id: userId,
        },
      },
    },
    include: {
      items: true,
    },
  });

  return cart;
};

export const readCart = async (userId: string) => {
  const cart = await prisma.cart.findFirst({
    where: {
      user: {
        id: userId,
      },
    },
    include: {
      items: {
        include: {
          product: true,
          customize: {
            include: {
              // components: true,
              product: true,
            },
          },
        },
      },
    },
  });

  return cart;
};

export const addCustomizeBouquetToCart = async ({
  cartId,
  price,
  productId,
  quantity,
  note,
  wrapperColor,
  bill,
  flowerComponents,
  wrapperComponent,
  otherProducts,
  billQuantity,
}: AddCustomizeBouquetToCartInput) => {
  const product = await readProduct(productId);

  if (!product) throw new Error("Product not found");
  const count = await prisma.customize.count();

  const cartItem = await prisma.cartItem.create({
    data: {
      price,
      quantity,
      customize: {
        create: {
          name: `CSTM${count.toString().padEnd(4, "0")}`,
          totalPrice: price,
          // components: {
          //   connect: components.map((id) => ({ id })),
          // },
          flowerComponents: {
            set: flowerComponents,
          },
          wrapperComponent,
          otherProducts,
          note,
          wrapperColor,
          bill,
          billQuantity,
          product: {
            connect: {
              id: productId,
            },
          },
        },
      },
      cart: {
        connect: {
          id: cartId,
        },
      },
      product: {
        connect: {
          id: productId,
        },
      },
    },
    include: {
      product: true,
      customize: {
        include: {
          // components: true,
          product: true,
        },
      },
    },
  });

  return {
    ...cartItem,
    customize: await readComponentsToGQL(cartItem.customize as Customize),
  };
};
