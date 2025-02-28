import {
	createBouquetItem,
	readBouquetItem,
	readBouquetItems,
	updateBouquetItem,
} from "@/models/bouquet-items-model.js";

import { BouquetItem } from "../../types/index.js";
import { GraphQLError } from "graphql";

type BouquetItemInput = Omit<BouquetItem, "id" | "createdAt" | "updatedAt">;

export const createBouquetItemResolver = async (
	_: never,
	{ data }: { data: BouquetItemInput }
) => {
	const newItem = await createBouquetItem(data);
	if (!newItem) throw new GraphQLError("Failed to create bouquet item");
	return newItem;
};

export const updateBouquetItemResolver = async (
	_: never,
	{
		data,
		id,
	}: {
		id: string;
		data: BouquetItemInput;
	}
) => {
	const updated = await updateBouquetItem(id, data);
	if (!updated) throw new GraphQLError("Failed to update bouquet item");
	return updated;
};

export const readAllBouquetItemsResolver = async () => {
	return await readBouquetItems();
};

export const readBouquetItemResolver = async (
	_: never,
	{ id }: { id: string }
) => {
	const bouquetItem = await readBouquetItem(id);
	if (!bouquetItem) throw new GraphQLError("Failed to find bouquet item");

	return bouquetItem;
};
