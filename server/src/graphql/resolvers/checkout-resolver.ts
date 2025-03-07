import { GraphQLError } from "graphql";
import { v4 as uuidv4 } from "uuid";

import { environment } from "../../environments/environment.js";
import {
	readProduct,
	updateProduct,
	createOrder,
	removeCartItem,
} from "../../models/index.js";
import {
	OrderDeliveryType,
	OrderPaymentType,
	AppContext,
} from "../../types/index.js";

export const createCheckoutSessionResolver = async (
	_: never,
	{
		line_items,
		totalPrice,
		typeOfDelivery,
		typeOfPayment,
		preOrder = false,
		fromCartItem = false,
	}: {
		totalPrice: number;
		line_items: {
			cartItemId: string;
			amount: number;
			id: string;
			name: string;
			images: string[];
			quantity: number;
		}[];
		preOrder?: boolean;
		typeOfPayment: OrderPaymentType;
		typeOfDelivery: OrderDeliveryType;
		fromCartItem?: boolean;
	},
	app: AppContext
) => {
	try {
		let payment = {
			id: uuidv4(),
			checkoutUrl: "no-url",
		};

		if (typeOfPayment === "GCASH") {
			const url = "https://api.paymongo.com/v1/checkout_sessions";

			await Promise.all(
				line_items.map(async (item) => {
					const product = await readProduct(item.id);
					if (!product) {
						throw new GraphQLError("Product not found");
					}
					console.log(product.stock, item.quantity);
					if (product.stock < item.quantity) {
						throw new GraphQLError("Product out of stock");
					}

					await updateProduct(product.id, {
						stock: product.stock - item.quantity,
					});
				})
			);

			const options = {
				method: "POST",
				headers: {
					accept: "application/json",
					"Content-Type": "application/json",
					authorization: `Basic ${process.env.PAYMONGO_SECRET}`,
				},
				body: JSON.stringify({
					data: {
						attributes: {
							send_email_receipt: true,
							show_description: true,
							show_line_items: true,
							description: "Payment for items",
							line_items: line_items.map((item) => ({
								currency: "PHP",
								quantity: item.quantity,
								amount: item.amount * 100,
								name: item.name,
								description: "Information about the product",
								images: item.images,
							})),
							payment_method_types: ["gcash", "paymaya"],
							success_url: `${environment.CLIENT_URL}/checkout/success`,
							cancel_url: `${environment.CLIENT_URL}/checkout/cancel`,
						},
					},
				}),
			};

			const response = await fetch(url, options);
			const data = await response.json();

			if (response.status !== 200) {
				throw new GraphQLError("Failed to checkout");
			}

			payment = {
				checkoutUrl: data.data.attributes.checkout_url,
				id: data.data.id,
			};
		}

		const order = await createOrder({
			items: line_items.map((item) => ({
				price: item.amount,
				productId: item.id,
				quantity: item.quantity,
			})),
			status: "PENDING",
			totalPrice,
			typeOfDelivery,
			userId: app.role !== "USER" ? undefined : app.id,
			typeOfPayment,
			preOrder,
			payment,
		});

		if (fromCartItem) {
			await Promise.all(
				line_items.map(async (item) => await removeCartItem(item.cartItemId))
			);
		}

		return order;
	} catch (err) {
		console.log(err);
		throw new GraphQLError((err as GraphQLError).message);
	}
};
