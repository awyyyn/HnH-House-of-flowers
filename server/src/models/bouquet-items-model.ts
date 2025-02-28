import { prisma } from "../services/prisma.js";
import { BouquetItem } from "../types/index.js";

type BouquetItemInput = Omit<BouquetItem, "id" | "createdAt" | "updatedAt">;

export const createBouquetItem = async (data: BouquetItemInput) => {
	return await prisma.bouquetItem.create({ data });
};

export const updateBouquetItem = async (id: string, data: BouquetItemInput) => {
	const bouquetItem = await prisma.bouquetItem.findUnique({ where: { id } });
	if (!bouquetItem) throw new Error("BouquetItem not found");
	return await prisma.bouquetItem.update({ where: { id }, data });
};

export const readAllBouquetItems = async () => {
	return await prisma.bouquetItem.findMany();
};

export const readBouquetItem = async (id: string) => {
	return await prisma.bouquetItem.findUnique({ where: { id } });
};
