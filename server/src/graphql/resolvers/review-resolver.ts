import { createReview, readReview } from "../../models/index.js";
import { AppContext, UserPaginationArgs } from "../../types/index.js";
import { GraphQLError } from "graphql";

export const createReviewResolver = async (
	_: never,
	{
		rate,
		images = [],
		comment,
		productId,
	}: { comment?: string; images?: string[]; productId: string; rate: number },
	app: AppContext
) => {
	try {
		//
		const review = await createReview({
			comment: comment || null,
			images,
			productId,
			rating: rate,
			userId: app.id,
		});

		// ADD NOTIFICATIOn

		return review;
	} catch {
		throw new GraphQLError("Internal Server Error!");
	}
};

export const readReviewsResolver = async (
	_: never,
	{
		id,
		pagination,
	}: { id: string; pagination?: UserPaginationArgs["pagination"] }
) => {
	try {
		return await readReview({ productId: id, pagination });
	} catch {
		throw new GraphQLError("Internal Server Error!");
	}
};
