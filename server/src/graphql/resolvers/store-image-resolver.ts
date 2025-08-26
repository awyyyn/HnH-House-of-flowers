import { GraphQLError } from "graphql";
import {
  createStoreImage,
  updateStoreImage,
} from "../../models/store-images-model.js";
import { CreateStoreImageInput } from "../../types/store-images.js";

export const createStoreImageResolver = async (
  _: never,
  { createstoreImageInput }: { createstoreImageInput: CreateStoreImageInput },
) => {
  try {
    const newStore = await createStoreImage(createstoreImageInput);
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
