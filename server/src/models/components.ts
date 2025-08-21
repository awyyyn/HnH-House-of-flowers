import { ComponentType, Prisma } from "@prisma/client";
import { prisma } from "src/services/prisma.js";
import { Component, ComponentInput } from "src/types/index.js";

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

  console.log(isComponentExists, "qqq");

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

  return updatedComponent;
};

export const readComponent = async (id: string) => {
  const component = await prisma.component.findUnique({
    where: {
      id,
    },
  });
  if (!component) throw new Error("Component not found");

  return component;
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

  const components = await prisma.component.findMany({
    where: {
      ...where,
      isAvailable: !!isAvailable,
    },
    skip: pagination ? pagination.limit * pagination?.page : undefined,
    take: pagination ? pagination.limit : undefined,
  });

  const total = await prisma.component.count({ where });

  return {
    data: components.map((com) => ({
      ...com,
      createdAt: com.createdAt.toISOString(),
      updatedAt: com.updatedAt.toISOString(),
    })),
    hasNextPage: components.length === pagination?.limit,
    total,
  };
};
