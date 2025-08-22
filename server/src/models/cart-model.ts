import { AddCustomizeBouquetToCartInput } from "src/types/cart.js";
import { prisma } from "../services/prisma.js";
import { readProduct } from "./product-model.js";

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
              components: true,
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
  components,
  price,
  productId,
  quantity,
  note,
  wrapperColor,
}: AddCustomizeBouquetToCartInput) => {
  const product = await readProduct(productId);

  if (!product) throw new Error("Product not found");
  const count = await prisma.customize.count();

  return await prisma.cartItem.create({
    data: {
      price,
      quantity,
      customize: {
        create: {
          name: `CSTM${count.toString().padEnd(4, "0")}`,
          totalPrice: price,
          components: {
            connect: components.map((id) => ({ id })),
          },
          note,
          wrapperColor,
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
          components: true,
          product: true,
        },
      },
    },
  });
};
