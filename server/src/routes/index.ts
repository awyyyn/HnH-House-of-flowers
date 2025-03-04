import { Router } from "express";
import { authRoutes } from "./auth-routes.js";
import { paymongoWebhook } from "@/controllers/webhook-controller.js";

export const routes = Router();

routes.use("/auth", authRoutes);
routes.post("/paymongo-webhook", paymongoWebhook);
