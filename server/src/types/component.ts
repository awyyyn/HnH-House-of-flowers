import { Component as PComponent } from "@prisma/client";

export type ComponentInput = Omit<PComponent, "id" | "createdAt" | "updatedAt">;

export type Component = Omit<PComponent, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};
