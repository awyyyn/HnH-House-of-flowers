import { Component, FlowerVariant } from "./component";
import { Review } from "./review";

export const FlowerTags = {
  FUNERAL: "FUNERAL",
  VALENTINE: "VALENTINE",
  BIRTHDAY: "BIRTHDAY",
  GRADUATION: "GRADUATION",
  WEDDING: "WEDDING",
} as const;

export type FlowerTags = (typeof FlowerTags)[keyof typeof FlowerTags];

export interface Product {
  readonly id: string;
  name: string;
  description: string;
  images: string[];
  stock: number;
  avg: number;
  // Fees
  otherFee?: number;
  serviceFee?: number;
  price: number;
  flowerComponents?: Component[];
  wrapperComponent?: Component;

  flowerVariant?: FlowerVariant;
  handMadeFlowerVariant?: string;

  status: ProductStatus;
  category: ProductCategory;
  reviews: Review[];
  tags: FlowerTags[];

  createdAt: Date;
  updatedAt: Date;
}

export type ProductStatus =
  | "PRE_ORDER"
  | "DISCONTINUED"
  | "IN_STOCK"
  | "OUT_OF_STOCK";

export type ProductCategory = "FLOWER" | "BOUQUET" | "CHOCOLATE" | "GIFT";
