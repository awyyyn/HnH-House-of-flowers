import { StoreImage as TStoreImage } from "@prisma/client";

export type CreateStoreImageInput = Omit<
  TStoreImage,
  "id" | "createdAt" | "updatedAt"
>;

export type ReadStoreImage = {
  pagination?: {
    page: number;
    limit: number;
  };
};
