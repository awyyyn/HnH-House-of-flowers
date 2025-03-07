import { prisma } from "../services/prisma.js";
import { ProductFilter, Product, ProductInput } from "../types/index.js";
import { Prisma } from "@prisma/client";

export const createProduct = async (
	values: Omit<Product, "id" | "createdAt" | "updatedAt">
) => {
	const newProduct = await prisma.product.create({
		data: values,
	});

	return newProduct;
};

export const updateProduct = async (
	id: string,
	values: Partial<ProductInput>
) => {
	const updatedProduct = await prisma.product.update({
		where: { id },
		data: values,
	});

	return updatedProduct;
};

export const readProduct = async (filter: string) => {
	const user = await prisma.product.findFirst({
		where: {
			id: filter,
		},
	});

	return user;
};

export const readProducts = async ({
	filter,
	pagination,
	category,
	status,
}: ProductFilter = {}) => {
	const where: Prisma.ProductWhereInput = {};

	if (filter) {
		where.OR = [
			{
				name: { contains: filter },
			},
		];
	}

	if (category) {
		where.category = category;
	}

	if (status) {
		where.status = {
			in: status,
		};
	}

	const products = await prisma.product.findMany({
		where,
		skip: pagination ? pagination.limit * pagination?.page : undefined,
		take: pagination ? pagination.limit : undefined,
	});

	const total = await prisma.product.count({ where });

	return {
		data: products,
		hasNextPage: products.length === pagination?.limit,
		total,
	};
};

export const getBestSellingProducts = async (take: number = 5) => {
	let products = await prisma.product.findMany({
		select: {
			_count: {
				select: {
					orderItem: true,
				},
			},
			id: true,
			name: true,
			images: true,
			price: true,
		},
		orderBy: {
			orderItem: {
				_count: "desc",
			},
		},
		take,
	});

	products = products.filter((product) => product._count.orderItem > 0);

	return products.map((product) => ({
		...product,
		sold: product._count.orderItem,
	}));
};
