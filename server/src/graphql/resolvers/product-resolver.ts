import {
	createProduct,
	readProduct,
	readProducts,
	updateProduct,
} from "../../models/product-model.js";
import {
	AppContext,
	ProductInput,
	ProductsPaginationArgs,
} from "../../types/index.js";

import { GraphQLError } from "graphql";

export const createProductResolver = async (
	_: never,
	values: ProductInput,
	app: AppContext
) => {
	if (app.role === "USER") {
		throw new Error("You are not authorized to perform this action");
	}

	const product = await createProduct(values);

	if (!product) {
		throw new Error("Failed to create product");
	}

	return product;
};

export const productsResolver = async (
	_: never,
	{ filter, pagination, category, status }: ProductsPaginationArgs
) => {
	try {
		return await readProducts({ filter, pagination, category, status });
	} catch (error) {
		throw new GraphQLError((error as GraphQLError).message);
	}
};

export const updateProductResolver = async (
	_: never,
	{ id, data }: { id: string; data: ProductInput },
	app: AppContext
) => {
	if (app.role === "USER") {
		throw new Error("You are not authorized to perform this action");
	}

	try {
		const updatedProduct = await updateProduct(id, data);

		if (!updatedProduct) {
			throw new Error("Failed to update product");
		}

		return updatedProduct;
	} catch (error) {
		throw new GraphQLError((error as GraphQLError).message);
	}
};

export const productResolver = async (_: never, { id }: { id: string }) => {
	try {
		const product = await readProduct(id);

		if (!product) {
			throw new GraphQLError("Product not found");
		}

		return product;
	} catch (error) {
		throw new GraphQLError((error as GraphQLError).message);
	}
};
