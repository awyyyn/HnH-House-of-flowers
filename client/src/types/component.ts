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
  flowerVariant?: FlowerVariant;
  handMadeFlowerVariant?: string;

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

export const FlowerVariant = {
  HANDMADE: "HANDMADE",
  FRESH: "FRESH",
  IMPORTED_FLOWERR: "IMPORTED_FLOWER",
  DRIED_FLOWER: "DRIED_FLOWER",
  MONEY_BOUQUET: "MONEY_BOUQUET",
  BOBO_BALLOONS: "BOBO_BALLOONS",
} as const;

export type FlowerVariant = (typeof FlowerVariant)[keyof typeof FlowerVariant];
