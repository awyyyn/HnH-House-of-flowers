import { Request, Response } from "express";
import { updatePayment } from "../models/index.js";

export const paymongoWebhook = async (req: Request, res: Response) => {
	const event = req.body.data;

	if (event.attributes.type === "checkout_session.payment.paid") {
		const checkoutSessionId = event.attributes.data.id;

		await updatePayment(checkoutSessionId, {
			status: "SUCCESS",
		});
	}

	res.status(200).send("Webhook received");
};
