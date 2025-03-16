import { Request, Response } from "express";
import { getBestSellingProducts } from "src/models/product-model.js";
import { readReviews } from "src/models/review-model.js";
import { getStore } from "src/models/settings-model.js";

export const readStoreController = async (req: Request, res: Response) => {
	try {
		const store = await getStore();

		res.status(200).json(store);
	} catch (err) {
		console.error("LOGIN_ERR", err);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const readHomeDataController = async (_: Request, res: Response) => {
	try {
		//
		const topProducts = await getBestSellingProducts(4);
		const reviews = await readReviews();

		res.status(200).json({ topProducts, reviews });
	} catch (err) {
		res.status(500).json({ message: "Internal server error" });
	}
};
