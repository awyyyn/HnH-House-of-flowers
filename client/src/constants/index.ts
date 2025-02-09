export * from "./flowers";

export const statusColorMap: Record<
	string,
	"default" | "destructive" | "secondary"
> = {
	UNVERIFIED: "secondary",
	VERIFIED: "default",
	DELETED: "destructive",
};
