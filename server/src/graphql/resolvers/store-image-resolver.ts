import { GraphQLError } from "graphql";
import {
  createStoreImage,
  deleteStoreImage,
  readStoreImage,
  readStoreImages,
  updateStoreImage,
} from "../../models/store-images-model.js";
import {
  CreateStoreImageInput,
  ReadStoreImage,
} from "../../types/store-images.js";

export const createStoreImageResolver = async (
  _: never,
  { createStoreImageInput }: { createStoreImageInput: CreateStoreImageInput },
) => {
  try {
    const newStore = await createStoreImage(createStoreImageInput);
    if (!newStore) throw new GraphQLError("Failed to create store image");
    return newStore;
  } catch (error) {
    throw new GraphQLError((error as GraphQLError).message);
  }
};

export const updateStoreImageResolver = async (
  _: never,
  { id, data }: { id: string; data: Partial<CreateStoreImageInput> },
) => {
  try {
    return await updateStoreImage(id, data);
  } catch (error) {
    throw new GraphQLError("Internal Server Error!");
  }
};

export const readStoreImagesResolver = async (
  _: never,
  args: ReadStoreImage,
) => {
  try {
    return await readStoreImages(args);
  } catch (error) {
    throw new GraphQLError("Internal Server Error!");
  }
};

export const readStoreImageResolver = async (
  _: never,
  { id }: { id: string },
) => {
  try {
    return await readStoreImage(id);
  } catch (error) {
    throw new GraphQLError("Internal Server Error!");
  }
};

export const deleteStoreImageResolver = async (
  _: never,
  { id }: { id: string },
) => {
  try {
    return await deleteStoreImage(id);
  } catch (error) {
    throw new GraphQLError("Internal Server Error!");
  }
};
