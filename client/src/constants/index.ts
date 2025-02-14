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
