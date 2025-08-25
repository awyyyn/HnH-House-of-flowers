import { CreateStoreImageInput } from "../types/store-images.js";
import { prisma } from "../services/prisma.js";

export const createStoreImage = async (data: CreateStoreImageInput) => {
  return await prisma.storeImage.create({
    data,
  });
};

export const updateStoreImage = async (
  id: string,
  data: Partial<CreateStoreImageInput>,
) => {
  const isExist = await prisma.storeImage.count({
    where: { id },
  });

  if (!isExist || isExist === 0) throw new Error("Store image not found");

  return await prisma.storeImage.update({
    data,
    where: { id },
  });
};
