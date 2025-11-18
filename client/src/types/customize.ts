import { Component } from "./component";
import { Product } from "./product";

export interface Customize {
  readonly id: string;
  name: string;
  note?: string;
  totalPrice: number;

  flowerComponents: Component[];
  wrapperComponent: Component;
  otherProducts: Product[];
  wrapperColor?: string;
  product: Product;
  productId: string;
  bill?: number;
  billQuantity?: number;

  createdAt: Date;
  updatedAt: Date;
}
