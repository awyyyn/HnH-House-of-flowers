import { GraphQLError } from "graphql";
import { getStore, updateStore } from "src/models/settings-model.js";

export const settingsResolver = async (
	_: never,
	args: {
		policies?: {
			privacyPolicy: string;
			returnPolicy: string;
			shippingPolicy: string;
			termsOfService: string;
		};
		socialMedia?: {
			facebook: string;
			instagram: string;
		};
		storeAddress: string;
		storeDescription: string;
		storeEmail: string;
		storeName: string;
		storePhone: string;
		deliveryFee: number;
		id: string;
	}
) => {
	const { id, ...data } = args;
	try {
		return await updateStore(data, id);
	} catch (err) {
		console.log(err);
		throw new GraphQLError("Internal Server Error!");
	}
};

export const readSettingsResolver = async (_: never) => {
	try {
		return await getStore();
	} catch {
		throw new GraphQLError("Internal Server Error!");
	}
};
