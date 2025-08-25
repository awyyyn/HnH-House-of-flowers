import {
  CreateStoreImageInput,
  ReadStoreImage,
} from "../types/store-images.js";
import { prisma } from "../services/prisma.js";
import { PaginationResult } from "src/types/index.js";
import { StoreImage } from "@prisma/client";

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

export const readStoreImage = async (id: string) => {
  return await prisma.storeImage.findFirst({
    where: { id },
  });
};

export const readStoreImages = async ({
  pagination,
}: ReadStoreImage): Promise<PaginationResult<StoreImage>> => {
  const storeImages = await prisma.storeImage.findMany({
    skip: pagination ? pagination.limit * pagination?.page : undefined,
    take: pagination ? pagination.limit : undefined,
  });

  const count = await prisma.user.count({});

  return {
    data: storeImages,
    hasMore: storeImages.length === pagination?.limit,
    count,
  };
};
