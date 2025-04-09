import { Router } from "express";
import { authRoutes } from "./auth-routes.js";
import {
	paymongoWebhook,
	readHomeDataController,
	readStoreController,
} from "../controllers/index.js";

export const routes = Router();

routes.use("/auth", authRoutes);
routes.post("/paymongo-webhook", paymongoWebhook);
routes.get("/", readStoreController);
routes.get("/home", readHomeDataController);
