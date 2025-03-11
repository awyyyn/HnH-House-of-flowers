import { Prisma } from "@prisma/client";
import { prisma } from "../services/prisma.js";
import { BouquetItem, BouquetItemFilter } from "../types/index.js";

type BouquetItemInput = Omit<BouquetItem, "id" | "createdAt" | "updatedAt">;

export const createBouquetItem = async (data: BouquetItemInput) => {
	return await prisma.bouquetItem.create({ data });
};

export const updateBouquetItem = async (id: string, data: BouquetItemInput) => {
	const bouquetItem = await prisma.bouquetItem.findUnique({ where: { id } });
	if (!bouquetItem) throw new Error("BouquetItem not found");
	return await prisma.bouquetItem.update({ where: { id }, data });
};

export const readBouquetItem = async (id: string) => {
	return await prisma.bouquetItem.findUnique({ where: { id } });
};

export const readBouquetItems = async ({
	filter,
	pagination,
	type = ["FLOWER", "SUB_FLOWER", "TIE", "WRAPPER"],
	isAvailable,
}: BouquetItemFilter = {}) => {
	const where: Prisma.BouquetItemWhereInput = {};

	if (filter) {
		where.OR = [
			{
				name: { contains: filter },
			},
		];
	}

	if (type) {
		where.type = {
			in: type,
		};
	}

	if (isAvailable) {
		where.isAvailable = isAvailable;
	}

	const products = await prisma.bouquetItem.findMany({
		where,
		skip: pagination ? pagination.limit * pagination?.page : undefined,
		take: pagination ? pagination.limit : undefined,
	});

	const total = await prisma.bouquetItem.count({ where });

	return {
		data: products,
		hasNextPage: products.length === pagination?.limit,
		total,
	};
};
