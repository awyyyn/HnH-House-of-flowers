import { Router } from "express";
import {
	forgotPasswordController,
	registerController,
	loginController,
	resetPasswordController,
	verifyTokenController,
} from "../controllers/index.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/forgot-password", forgotPasswordController);
router.post("/reset-password", authMiddleware, resetPasswordController);
router.post("/verify-otp", verifyTokenController);

export { router as authRoutes };
