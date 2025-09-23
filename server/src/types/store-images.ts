import { StoreImage as TStoreImage } from "@prisma/client";

export type CreateStoreImageInput = Omit<
  TStoreImage,
  "id" | "createdAt" | "updatedAt"
>;

export type ReadStoreImage = {
  filter?: string;
  pagination?: {
    page: number;
    limit: number;
  };
};
