import {
	createUser,
	readUser,
	updateUser,
	createToken,
	readToken,
} from "../models/index.js";
import {
	comparePassword,
	hashPassword,
	generateAccessToken,
} from "../services/index.js";
import { Request, Response } from "express";
import { differenceInMinutes, differenceInSeconds } from "date-fns";

export const loginController = async (req: Request, res: Response) => {
	const { email, password } = req.body;

	if (!email || !password) {
		res.status(400).json({ message: "Email and password are required" });
		return;
	}
	try {
		// Check if user exists
		const user = await readUser(email);
		if (!user) {
			res
				.status(404)
				.json({ message: "User not registered. Please register first." });
			return;
		}
		// Check if email is verified
		// const isEmailVerified = user.status === "VERIFIED";
		// if (!isEmailVerified) {
		// 	res
		// 		.status(403)
		// 		.json({ message: "Email not verified. Please verify your email." });
		// 	return;
		// }

		// Check if password is correct
		const isPasswordCorrect = await comparePassword(password, user.password);
		if (!isPasswordCorrect) {
			res.status(401).json({ message: "Incorrect password" });
			return;
		}

		// Generate token
		const accessToken = await generateAccessToken({
			email: user.email,
			role: user.role,
			id: user.id,
		});

		res.status(200).json({
			message: "Login successful",
			data: {
				accessToken,
				user,
			},
		});
	} catch (err) {
		console.error("LOGIN_ERR", err);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const registerController = async (req: Request, res: Response) => {
	const { email, password } = req.body;

	if (!email || !password) {
		res.status(400).json({ message: "Email and password are required" });
		return;
	}

	try {
		// Check if user exists
		const user = await readUser(email);
		if (user) {
			res.status(404).json({
				message: "User already registered. Please proceed to log in.",
			});
			return;
		}

		// Create user
		const newUser = await createUser({ email, password, role: "USER" });

		if (!newUser) {
			throw new Error("User creation failed");
		}

		// Generate token
		const accessToken = await generateAccessToken({
			email: newUser.email,
			role: newUser.role,
			id: newUser.id,
		});

		res.status(200).json({
			message: "Register successful",
			data: {
				accessToken,
				user: newUser,
			},
		});
	} catch (err) {
		console.error("REGISTER_ERR", err);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const forgotPasswordController = async (req: Request, res: Response) => {
	try {
		const { email } = req.body;
		if (!email) {
			res.status(400).json({ message: "Email is required" });
			return;
		}

		// Check if user exists
		const user = await readUser(email);
		if (!user) {
			res.status(404).json({ message: "User not registered" });
			return;
		}

		const isTokenExists = await readToken(email);

		if (isTokenExists) {
			const min = differenceInMinutes(new Date(), isTokenExists?.time);
			const minutesLeft = 5 - min;
			const seconds = differenceInSeconds(new Date(), isTokenExists?.time);

			res.status(400).json({
				message: `Token already sent. Please wait for ${
					!minutesLeft ? seconds : minutesLeft
				} ${!minutesLeft ? "second(s)" : "minute(s)"}`,

				// "Please wait for " + minutesLeft < 1
				// ? seconds
				// : minutesLeft + " minutes",
			});
			return;
		}

		await createToken(user.email);

		res.status(200).json({
			message: "OTP sent to email",
		});
	} catch (err) {
		console.error("FORGOT_PASSWORD_ERR", err);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const verifyTokenController = async (req: Request, res: Response) => {
	try {
		const { email, token } = req.body;
		if (!email || !token) {
			res.status(400).json({ message: "Email and token are required" });
			return;
		}

		// Check if user exists
		const user = await readUser(email);
		if (!user) {
			res.status(404).json({ message: "User not registered" });
			return;
		}

		// Check if token exists
		const tokenExists = await readToken(email);

		if (!tokenExists) {
			res.status(404).json({ message: "Token not found" });
			return;
		}

		// Check token if correct
		if (tokenExists.token !== token) {
			res
				.status(401)
				.json({ message: "OTP is not valid. Please verify and try again." });
			return;
		}

		const accessToken = await generateAccessToken({
			email: user.email,
			id: user.id,
			role: user.role,
		});

		res.status(200).json({
			message: "Token verified",
			data: {
				accessToken,
			},
		});
	} catch (err) {
		console.error("VERIFY_TOKEN_ERR", err);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const resetPasswordController = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			res
				.status(400)
				.json({ message: "Email, token, and password are required" });
			return;
		}

		// Check if user exists
		const user = await readUser(email);
		if (!user) {
			res.status(404).json({ message: "User not registered" });
			return;
		}

		const hashedPassword = await hashPassword(password);

		// Update password
		await updateUser(user.id, { password: hashedPassword });

		res.status(200).json({ message: "Password reset successful" });
	} catch (err) {
		console.error("RESET_PASSWORD_ERR", err);
		res.status(500).json({ message: "Internal server error" });
	}
};
