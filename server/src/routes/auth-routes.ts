import { Router } from "express";
import {
	forgotPasswordController,
	registerController,
	loginController,
	resetPasswordController,
	verifyTokenController,
	meController,
} from "../controllers/index.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/forgot-password", forgotPasswordController);
router.post("/reset-password", authMiddleware, resetPasswordController);
router.post("/verify-otp", verifyTokenController);
router.post("/me", authMiddleware, meController);

export { router as authRoutes };
