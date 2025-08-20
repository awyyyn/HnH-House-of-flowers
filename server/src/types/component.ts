import { Component } from "@prisma/client";

export type ComponentInput = Omit<Component, "id" | "createdAt" | "updatedAt">;
