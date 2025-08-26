import {
  CreateStoreImageInput,
  ReadStoreImage,
} from "../types/store-images.js";
import { prisma } from "../services/prisma.js";
import { PaginationResult } from "src/types/index.js";
import { Prisma, StoreImage } from "@prisma/client";

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
    data: storeImages,
    hasNextPage: storeImages.length === pagination?.limit,
    total,
  };
};
