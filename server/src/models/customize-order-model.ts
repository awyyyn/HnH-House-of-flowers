import { prisma } from "../services/prisma.js";

export const createCustomizeBouquet = async ({
  name,
  totalPrice,
  note,
  wrapperColor,
}: {
  name: string;
  mainFlower: string;
  subFlowers: string[];
  wrapper: string;
  tie: string;
  totalPrice: number;

  note?: string;
  wrapperColor: string;
}) => {
  const order = await prisma.customize.create({
    data: {
      name,
      totalPrice,
      note,
      wrapperColor,
      wrapperComponent: "",
      product: {},
    },
  });

  return order;
};
