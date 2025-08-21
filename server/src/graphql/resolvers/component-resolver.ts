import { ComponentType } from "@prisma/client";
import { GraphQLError } from "graphql";
import {
  createComponent,
  readComponent,
  readComponents,
  updateComponent,
} from "src/models/index.js";
import { ComponentInput } from "src/types/component.js";

export const createComponentResolver = async (
  _: never,
  data: ComponentInput,
) => {
  try {
    const newItem = await createComponent(data);
    if (!newItem) throw new GraphQLError("Failed to create bouquet component!");
    return newItem;
  } catch (error) {
    throw new GraphQLError((error as Error).message);
  }
};

export const updateComponentResolver = async (
  _: never,
  data: { id: string } & ComponentInput,
) => {
  try {
    const { id, ...values } = data;
    return await updateComponent(id, values);
  } catch (error) {
    console.log(error);
    throw new GraphQLError((error as Error).message);
  }
};

export const readComponentResolver = async (
  _: never,
  { id }: { id: string },
) => {
  try {
    return await readComponent(id);
  } catch (error) {
    throw new GraphQLError((error as Error).message);
  }
};

export const readComponentsResolver = async (
  _: never,
  {
    componentType,
    filter,
    pagination,
    isAvailable,
  }: {
    componentType?: ComponentType;
    pagination?: { page: number; limit: number };
    filter?: string;
    isAvailable?: boolean;
  },
) => {
  try {
    return await readComponents({
      componentType,
      filter,
      pagination,
      isAvailable,
    });
  } catch (error) {
    throw new GraphQLError((error as Error).message);
  }
};
