import { Product } from "./product.js";

export interface Cart {
  readonly id: string;
  userId: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  readonly id: string;
  productId: string;
  product: Product;

  cart: Cart;
  cartId: string;

  quantity: number;
  price: number;

  createdAt: string;
  updatedAt: string;
}

export interface AddCustomizeBouquetToCartInput {
  quantity: number;
  price: number;
  productId: string;
  cartId: string;
  components: string[];
  note?: string;
  wrapperColor?: string;
  bill?: number;
  billQuantity?: number;
}
