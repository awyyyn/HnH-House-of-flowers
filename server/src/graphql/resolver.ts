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
	productsResolver,
	updateProductResolver,
	createProductResolver,
	productResolver,
} from "./resolvers/index.js";

export const resolvers = {
	Query: {
		user: userResolver,
		users: usersResolver,
		product: productResolver,
		products: productsResolver,
	},
	Mutation: {
		createAdmin: createAdminResolver,
		blockUser: blockUserResolver,
		unblockUser: unblockUserResolver,
		resetPassword: resetPasswordResolver,
		sendChangeEmailOTP: sendChangeEmailOTPResolver,
		updateEmail: updateEmailResolver,
		updateUser: updateUserResolver,
		createProduct: createProductResolver,
		updateProduct: updateProductResolver,
	},
	// Mutation: {},
};
