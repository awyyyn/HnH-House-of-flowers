import { prisma } from "@/services/prisma.js";
import { Review } from "@prisma/client";

export const createReview = async ({
	comment,
	images,
	productId,
	rating,
	userId,
}: Pick<Review, "comment" | "userId" | "productId" | "images" | "rating">) => {
	const review = await prisma.review.create({
		data: {
			rating,
			comment,
			product: {
				connect: {
					id: productId,
				},
			},
			user: {
				connect: {
					id: userId,
				},
			},
			images,
		},
	});

	return review;
};

export const readReview = async ({
	productId,
	pagination,
}: {
	productId: string;
	pagination?: {
		page: number;
		limit: number;
	};
}) => {
	const reviews = await prisma.review.findMany({
		where: {
			productId,
		},
		skip: pagination ? pagination.limit * pagination?.page : undefined,
		take: pagination ? pagination.limit : undefined,
	});

	const total = await prisma.review.count({
		where: { productId },
	});

	return {
		data: reviews,
		hasNextPage: reviews.length === pagination?.limit,
		total,
	};
};
