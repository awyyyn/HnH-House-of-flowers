import { prisma } from "../services/prisma.js";
import otpGenerator from "otp-generator";

export const createToken = async (email: string) => {
	// Generate OTP
	const otp = otpGenerator.generate(6, {
		upperCaseAlphabets: true,
		digits: true,
	});

	const token = await prisma.token.create({
		data: {
			token: otp,
			email,
			time: new Date(),
		},
	});

	return token;
};

export const readToken = async (email: string) =>
	await prisma.token.findUnique({ where: { email } });
