import { FlowerVariant } from "@/types";

export * from "./flowers";

export const statusColorMap: Record<
  string,
  "default" | "destructive" | "secondary"
> = {
  UNVERIFIED: "secondary",
  VERIFIED: "default",
  DELETED: "destructive",
};

export const productStatusColorMap: Record<
  string,
  "default" | "destructive" | "secondary" | "outline"
> = {
  PRE_ORDER: "secondary",
  IN_STOCK: "default",
  DISCONTINUED: "outline",
  OUT_OF_STOCK: "destructive",
};

export const productStatus = [
  "PRE_ORDER",
  "DISCONTINUED",
  "IN_STOCK",
  "OUT_OF_STOCK",
];

export const productCategory = ["FLOWER", "BOUQUET", "CHOCOLATE", "GIFT"];

export const flowerVariantOptions = Object.values(FlowerVariant).map(
  (variant) => ({
    label: variant.charAt(0) + variant.slice(1).toLowerCase().replace("_", " "), // "Handmade", "Fresh"
    value: variant,
  }),
);

export const flowerVariantEnumValues = Object.values(FlowerVariant).map((v) =>
  v.toString(),
);

export const defaultRichTextEditorValue =
  '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"2312"}]}]}';
