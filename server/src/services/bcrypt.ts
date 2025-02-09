import { environment } from "../environments/environment.js";
import * as bcrypt from "bcrypt";

export const hashPassword = async (plainPassword: string) => {
	const salt = await bcrypt.genSalt(environment.SALT);
	const hashPassword = await bcrypt.hash(plainPassword, salt);

	return hashPassword;
};

export const comparePassword = async (
	plainPassword: string,
	hashedPassword: string
) => {
	return await bcrypt.compare(plainPassword, hashedPassword);
};
