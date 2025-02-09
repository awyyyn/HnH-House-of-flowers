import {
	blockUserResolver,
	createAdminResolver,
	unblockUserResolver,
	userResolver,
	usersResolver,
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
	},
	// Mutation: {},
};
