import {
	blockUserResolver,
	createAdminResolver,
	unblockUserResolver,
	userResolver,
	usersResolver,
	resetPasswordResolver,
	sendChangeEmailOTPResolver,
	updateEmailResolver,
	updateUserResolver,
} from "./resolvers/index.js";

export const resolvers = {
	Query: {
		user: userResolver,
		users: usersResolver,
	},
	Mutation: {
		createAdmin: createAdminResolver,
		blockUser: blockUserResolver,
		unblockUser: unblockUserResolver,
		resetPassword: resetPasswordResolver,
		sendChangeEmailOTP: sendChangeEmailOTPResolver,
		updateEmail: updateEmailResolver,
		updateUser: updateUserResolver,
	},
	// Mutation: {},
};
