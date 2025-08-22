import { Component } from "./component";
import { Product } from "./product";

export interface Customize {
  readonly id: string;
  name: string;
  note?: string;
  totalPrice: number;

  components: Component[];
  wrapperColor?: string;
  product: Product;
  productId: string;

  createdAt: Date;
  updatedAt: Date;
}
