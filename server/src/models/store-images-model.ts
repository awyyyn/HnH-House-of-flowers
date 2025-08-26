import {
  CreateStoreImageInput,
  ReadStoreImage,
} from "../types/store-images.js";
import { prisma } from "../services/prisma.js";
import { Prisma } from "@prisma/client";

export const createStoreImage = async (data: CreateStoreImageInput) => {
  const storeImage = await prisma.storeImage.create({
    data,
  });

  if (!storeImage) throw new Error("Failed to create store image");

  return {
    ...storeImage,
    createdAt: storeImage.createdAt.toISOString(),
    updatedAt: storeImage.updatedAt.toISOString(),
  };
};

export const updateStoreImage = async (
  id: string,
  data: Partial<CreateStoreImageInput>,
) => {
  const isExist = await prisma.storeImage.count({
    where: { id },
  });

  if (!isExist || isExist === 0) throw new Error("Store image not found");

  const storeImage = await prisma.storeImage.update({
    data,
    where: { id },
  });

  if (!storeImage) throw new Error("Failed to update store image");

  return {
    ...storeImage,
    createdAt: storeImage.createdAt.toISOString(),
    updatedAt: storeImage.updatedAt.toISOString(),
  };
};

export const readStoreImage = async (id: string) => {
  const storeImage = await prisma.storeImage.findFirst({
    where: { id },
  });

  if (!storeImage) throw new Error("Store image not found");

  return {
    ...storeImage,
    createdAt: storeImage.createdAt.toISOString(),
    updatedAt: storeImage.updatedAt.toISOString(),
  };
};

export const readStoreImages = async ({
  pagination,
  filter,
}: ReadStoreImage) => {
  let where: Prisma.StoreImageWhereInput = {};

  if (filter && filter.trim() === "") {
    where = {
      OR: [
        { event: { contains: filter } },
        { description: { contains: filter } },
      ],
    };
  }

  const storeImages = await prisma.storeImage.findMany({
    skip: pagination ? pagination.limit * pagination?.page : undefined,
    take: pagination ? pagination.limit : undefined,
    where,
  });

  const total = await prisma.storeImage.count({ where });

  return {
    data: storeImages.map((storeImage) => ({
      ...storeImage,
      createdAt: storeImage.createdAt.toISOString(),
      updatedAt: storeImage.updatedAt.toISOString(),
    })),
    hasNextPage: storeImages.length === pagination?.limit,
    total,
  };
};
