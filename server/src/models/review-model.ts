import { Review } from "@prisma/client";
import { prisma } from "../services/prisma.js";

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
		include: {
			user: true,
		},
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

export const readReviews = async () => {
	const reviews = await prisma.review.findMany({
		where: {
			rating: {
				gte: 4,
			},
			comment: {
				not: null,
			},
		},
		take: 3,
		include: {
			user: {
				select: {
					firstName: true,
					lastName: true,
					photo: true,
				},
			},
		},
	});

	return reviews;
};
