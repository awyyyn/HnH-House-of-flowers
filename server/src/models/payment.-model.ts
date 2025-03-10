import { prisma } from "../services/prisma.js";
import { Payment } from "../types/payment.js";

export const updatePayment = async (
	id: string,
	data: Pick<Payment, "status">
) => {
	const updatedPayment = await prisma.payment.update({
		data: {
			status: data.status,
		},
		where: {
			paymentId: id,
		},
		include: {
			order: true,
		},
	});

	return updatedPayment;
};
