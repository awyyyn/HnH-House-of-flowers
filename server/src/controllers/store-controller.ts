import { Request, Response } from "express";
import {
  getBestSellingProducts,
  readReviews,
  getStore,
  readCurrentStoreImage,
} from "../models/index.js";

export const readStoreController = async (_: Request, res: Response) => {
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
    const storeImage = await readCurrentStoreImage();

    const data: any = { topProducts, reviews };

    if (storeImage) {
      data.storeImage = storeImage;
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};
