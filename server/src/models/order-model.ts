import { prisma } from "@/services/prisma.js";
import { OrderFilter } from "@/types/index.js";
import {
	OrderDeliveryType,
	OrderPaymentType,
	OrderStatus,
} from "@/types/order.js";
import { PaymentStatus } from "@/types/payment.js";
import { Prisma } from "@prisma/client";
import {
	endOfMonth,
	getUnixTime,
	getYear,
	startOfMonth,
	sub,
	subMonths,
} from "date-fns";

export const createOrder = async ({
	userId,
	totalPrice,
	items,
	typeOfPayment,
	status,
	typeOfDelivery,
	preOrder,
	payment,
}: {
	totalPrice: number;
	userId?: string;
	items: {
		quantity: number;
		price: number;
		productId: string;
	}[];
	typeOfPayment: OrderPaymentType;
	status: OrderStatus;
	typeOfDelivery: OrderDeliveryType;
	preOrder?: boolean;
	payment?: {
		checkoutUrl: string;
		id: string;
		status?: PaymentStatus;
	};
}) => {
	const unixTimestamp = getUnixTime(new Date()); // Get current Unix timestamp
	const orderId = `ORD${unixTimestamp.toString().padStart(10, "0")}`;

	const order = await prisma.order.create({
		data: {
			totalPrice,
			status,
			typeOfDelivery,
			typeOfPayment,
			isPreOrder: preOrder,
			formattedId: orderId,
			payment: payment?.id
				? {
						create: {
							checkoutUrl: payment.checkoutUrl,
							paymentId: payment.id,
							status: payment?.status ? payment.status : "PENDING",
							userId: userId ? String(userId) : undefined,
						},
				  }
				: undefined,
			customer: userId ? { connect: { id: userId } } : undefined,
			orderItems: {
				createMany: {
					data: items,
				},
			},
			processedAt:
				payment?.status === "SUCCESS" ? new Date().toISOString() : undefined,
			completedAt:
				payment?.status === "SUCCESS" ? new Date().toISOString() : undefined,
			forPickup:
				payment?.status === "SUCCESS" ? new Date().toISOString() : undefined,
			shippedAt:
				payment?.status === "SUCCESS" ? new Date().toISOString() : undefined,
		},
		include: {
			orderItems: true,
			payment: true,
			customer: !!userId,
		},
	});

	return order;
};

export const updateOrder = async (
	id: string,
	values: {
		status: OrderStatus;
	}
) => {
	const order = await prisma.order.findFirst({
		where: { id },
	});

	if (!order) throw new Error("Order not found!");

	let data: Prisma.OrderUpdateInput = {
		status: values.status,
	};

	if (values.status === "CANCELLED") {
		data.cancelledAt = new Date().toISOString();
	} else if (values.status === "READY_FOR_PICKUP") {
		data.forPickup = new Date().toISOString();
	} else if (values.status === "COMPLETED") {
		data.completedAt = new Date().toISOString();
	} else if (values.status === "SHIPPED") {
		data.shippedAt = new Date().toISOString();
	} else if (values.status === "PROCESSING") {
		data.processedAt = new Date().toISOString();
	}

	const updatedOrder = await prisma.order.update({
		data,
		where: {
			id,
		},
	});

	return updatedOrder;
};

export const readOrder = async ({
	paymentId,
	id,
	formattedId,
}: {
	id?: string;
	paymentId?: string;
	formattedId?: string;
}) => {
	let where: Prisma.OrderWhereInput = {};

	if (id) {
		where = { id };
	}

	if (paymentId) {
		where = {
			payment: {
				id: paymentId,
			},
		};
	}

	if (formattedId) {
		where = {
			formattedId,
		};
	}

	if (!id && !paymentId && !formattedId) {
		throw new Error("No id or paymentId provided");
	}

	const order = await prisma.order.findFirst({
		where,
		include: {
			orderItems: true,
			payment: true,
			customer: true,
		},
	});

	return order;
};

export const readOrders = async ({
	filter,
	pagination,
	typeOfDelivery,
	typeOfPayment,
	isPreOrder,
	status = [
		"CANCELLED",
		"COMPLETED",
		"PENDING",
		"PROCESSING",
		"READY_FOR_PICKUP",
		"SHIPPED",
	],
}: OrderFilter) => {
	// : Promise<PaginationResult<Order>>

	let where: Prisma.OrderWhereInput = {};

	if (filter) {
		where = {
			OR: [
				{
					formattedId: {
						contains: filter,
						mode: "insensitive",
					},
				},
				{
					customer: {
						email: {
							contains: filter,
							mode: "insensitive",
						},
					},
				},
			],
		};
	}

	if (isPreOrder) {
		where.isPreOrder = isPreOrder;
	}

	if (typeOfDelivery) {
		where.typeOfDelivery = typeOfDelivery;
	}

	if (typeOfPayment) {
		where.typeOfPayment = typeOfPayment;
	}

	if (status) {
		where.status = {
			in: status,
		};
	}

	const orders = await prisma.order.findMany({
		where,
		skip: pagination ? pagination.limit * pagination?.page : undefined,
		take: pagination ? pagination.limit : undefined,
		include: {
			orderItems: {
				include: {
					product: true,
				},
			},
			payment: true,
			customer: true,
		},
	});

	const total = await prisma.order.count({ where });

	return {
		hasNextPage: orders.length === pagination?.limit,
		total,
		data: orders,
	};
};

export const readOrdersByUser = async (userId: string) => {
	const orders = await prisma.order.findMany({
		where: {
			customer: {
				id: userId,
			},
		},
		include: {
			orderItems: {
				include: {
					product: true,
				},
			},
			payment: true,
			customer: true,
		},
	});

	return orders;
};

export const getMonthlyRevenue = async (year?: number) => {
	// Get the current date (e.g., March 2025)
	const currentDate = new Date();

	// If no year is provided, calculate the last 12 months from the previous month
	if (!year) {
		const monthlyRevenue = [];

		// Start from the previous month (February 2025)
		const startMonthDate = subMonths(currentDate, 1); // February 2025

		// Loop through the last 12 months (from February 2025 to March 2024)
		for (let i = 0; i < 12; i++) {
			// Get the target month date
			const targetMonthDate = subMonths(startMonthDate, i);

			// Get the start and end of the current month
			const startDate = startOfMonth(targetMonthDate); // Start of the month
			const endDate = endOfMonth(targetMonthDate); // End of the month

			// Fetch orders for that specific month
			const orders = await prisma.order.findMany({
				where: {
					orderDate: {
						gte: startDate,
						lte: endDate,
					},
				},
			});

			// Sum the total revenue for that month
			const revenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);

			// Store the result for this month along with the month index (for sorting)
			monthlyRevenue.push({
				year: getYear(targetMonthDate),
				month: startDate.toLocaleString("default", { month: "long" }),
				monthIndex: startDate.getMonth(),
				revenue,
			});
		}

		// Sort by year and month from oldest to most recent
		monthlyRevenue.sort((a, b) =>
			a.year === b.year ? a.monthIndex - b.monthIndex : a.year - b.year
		);

		// Remove the monthIndex property before returning
		return monthlyRevenue.map(({ year, month, revenue }) => ({
			year,
			month,
			revenue,
		}));
	}

	// If a year is provided, calculate monthly revenue for that year
	const targetYear = year;

	// Array to store revenue for each of the months in the provided year
	const monthlyRevenueForYear = [];

	// Loop through the 12 months of the specified year
	for (let i = 0; i < 12; i++) {
		// Set the target month for the specified year
		const targetMonthDate = new Date(targetYear, i, 1); // e.g., January 2024, February 2024, etc.

		// Get the start and end of the current month
		const startDate = startOfMonth(targetMonthDate); // Start of the month
		const endDate = endOfMonth(targetMonthDate); // End of the month

		// Fetch orders for that specific month
		const orders = await prisma.order.findMany({
			where: {
				orderDate: {
					gte: startDate,
					lte: endDate,
				},
			},
		});

		// Sum the total revenue for that month
		const revenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);

		// Store the result for this month along with the month index (for sorting)
		monthlyRevenueForYear.push({
			year: targetYear,
			month: startDate.toLocaleString("default", { month: "long" }),
			monthIndex: startDate.getMonth(),
			revenue,
		});
	}

	// Sort by month from oldest to most recent (year is the same for all)
	monthlyRevenueForYear.sort((a, b) => a.monthIndex - b.monthIndex);

	// Remove the monthIndex property before returning
	return monthlyRevenueForYear.map(({ year, month, revenue }) => ({
		year,
		month,
		revenue,
	}));
};

export const getLastMonthData = async () => {
	const newOrdersCount = await prisma.order.findMany({
		where: {
			orderDate: {
				gte: sub(new Date(), { months: 1 }),
			},
		},
	});

	const totalOrdersCount = await prisma.order.count();

	const orderPercentage =
		totalOrdersCount > 0 ? (newOrdersCount.length / totalOrdersCount) * 100 : 0;

	const newUserCount = await prisma.user.count({
		where: {
			createdAt: {
				gte: sub(new Date(), { months: 1 }),
			},
		},
	});

	const totalUserCount = await prisma.order.count();

	const userPercentage =
		totalOrdersCount > 0 ? (newUserCount / totalUserCount) * 100 : 0;

	const orders = await prisma.order.findMany({
		select: {
			totalPrice: true,
		},
	});

	const overallRevenue = orders.reduce((acc, curr) => acc + curr.totalPrice, 0);
	const lastMonthRevenue = newOrdersCount.reduce(
		(acc, curr) => acc + curr.totalPrice,
		0
	);
	const revenuePercentage =
		overallRevenue > 0 ? (lastMonthRevenue / overallRevenue) * 100 : 0;

	return {
		orders: {
			lastMonth: newOrdersCount.length,
			overAll: totalOrdersCount,
			percentage: orderPercentage,
		},
		users: {
			lastMonth: newUserCount,
			overAll: totalUserCount,
			percentage: userPercentage,
		},
		revenues: {
			overAll: overallRevenue,
			lastMonth: lastMonthRevenue,
			percentage: revenuePercentage,
		},
	};
};

export const getOrderSummary = async () => {
	// Group orders by status and count each
	const ordersGrouped = await prisma.order.groupBy({
		by: ["status"],
		_count: {
			status: true,
		},
	});

	// Total orders count
	const totalOrders = await prisma.order.count();

	// Calculate percentage for each status
	return ordersGrouped.map((group) => {
		const count = group._count.status;
		const percentage = totalOrders > 0 ? (count / totalOrders) * 100 : 0;
		return {
			status: group.status,
			count,
			percentage: Number(percentage.toFixed(2)),
		};
	});
};
