import {
	twoFactorAuthResolver,
	verifyTOTPResolver,
} from "./resolvers/index.js";

export const resolvers = {
	Query: {
		generateTOTPSecret: twoFactorAuthResolver,
	},
	Mutation: {
		verifyTOTP: verifyTOTPResolver,
	},
};
