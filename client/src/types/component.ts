export interface Component {
  id: string;
  name: string;
  quantity: number;
  description?: string;
  price?: number;
  image?: string;
  type: ComponentType;
  isAvailable: boolean;
  availableColors: string[];

  createdAt: string;
  updatedAt: string;
}

export type ComponentInput = Pick<
  Component,
  | "name"
  | "quantity"
  | "description"
  | "price"
  | "image"
  | "type"
  | "isAvailable"
  | "availableColors"
>;

export const ComponentType = {
  WRAPPER: "WRAPPER",
  FLOWER: "FLOWER",
} as const;

export type ComponentType = (typeof ComponentType)[keyof typeof ComponentType];
