import { GraphQLError } from "graphql";
import { createStoreImage } from "src/models/store-images-model.js";
import { CreateStoreImageInput } from "src/types/store-images.js";

export const createStoreImageResolver = async (
  _: never,
  { createstoreImageInput }: { createstoreImageInput: CreateStoreImageInput },
) => {
  try {
    return await createStoreImage(createstoreImageInput);
  } catch (error) {
    throw new GraphQLError("Internal Server Error!");
  }
};
