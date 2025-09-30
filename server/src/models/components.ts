import { ComponentType, Prisma } from "@prisma/client";
import { prisma } from "../services/prisma.js";
import { ComponentInput } from "../types/index.js";
import { transformTimestamp } from "../utils/index.js";

export const createComponent = async (data: ComponentInput) => {
  return await prisma.component.create({
    data,
  });
};

export const updateComponent = async (
  id: string,
  data: Partial<ComponentInput>,
) => {
  const isComponentExists = await prisma.component.count({
    where: {
      id,
    },
  });

  if (!isComponentExists || isComponentExists === 0) {
    throw new Error("Component not found");
  }

  const updatedComponent = await prisma.component.update({
    where: {
      id,
    },
    data,
  });

  if (!updatedComponent) throw new Error("Failed to update component");

  return transformTimestamp(updatedComponent);
};

export const readComponent = async (id: string) => {
  const component = await prisma.component.findUnique({
    where: {
      id,
    },
  });
  if (!component) throw new Error("Component not found");

  return transformTimestamp(component);
};

export const readComponents = async ({
  componentType,
  isAvailable,
  pagination,
  filter,
}: {
  componentType?: ComponentType;
  pagination?: { page: number; limit: number };
  filter?: string;
  isAvailable?: boolean;
} = {}) => {
  let where: Prisma.ComponentWhereInput = {};

  if (componentType) {
    where = { type: componentType };
  }

  if (filter) {
    where.OR = [
      {
        name: { contains: filter, mode: "insensitive" },
      },
    ];
  }

  if (typeof isAvailable !== "undefined") {
    where.isAvailable = isAvailable;
  }

  const components = await prisma.component.findMany({
    where: {
      ...where,
    },
    skip: pagination ? pagination.limit * pagination?.page : undefined,
    take: pagination ? pagination.limit : undefined,
  });

  const total = await prisma.component.count({ where });

  return {
    data: components.map((com) => transformTimestamp(com)),
    hasNextPage: components.length === pagination?.limit,
    total,
  };
};
