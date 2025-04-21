import { GraphQLError } from "graphql";
import { v4 as uuidv4 } from "uuid";

import { environment } from "../../environments/environment.js";
import {
	readProduct,
	updateProduct,
	createOrder,
	removeCartItem,
	createCustomizeOrder,
	getStore,
	createNotification,
} from "../../models/index.js";
import {
	OrderDeliveryType,
	OrderPaymentType,
	AppContext,
} from "../../types/index.js";
import { generateNotificationContent } from "src/utils/index.js";
import { pubsub } from "../../services/pubsub.js";

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

		await Promise.all(
			line_items.map(async (item) => {
				const product = await readProduct(item.id);
				if (!product) {
					throw new GraphQLError("Product not found");
				}

				if (product.stock < item.quantity) {
					throw new GraphQLError("Product out of stock");
				}

				await updateProduct(product.id, {
					stock: product.stock - item.quantity,
				});
			})
		);

		if (typeOfPayment === "GCASH") {
			const url = "https://api.paymongo.com/v1/checkout_sessions";

			const store = await getStore();

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
							line_items: [
								...line_items.map((item) => ({
									currency: "PHP",
									quantity: item.quantity,
									amount: item.amount * 100,
									name: item.name,
									description: "Information about the product",
									images: item.images,
								})),
								typeOfDelivery === "DELIVERY" && {
									currency: "PHP",
									quantity: 1,
									amount: Number(store?.deliveryFee || 0) * 100,
									name: "Delivery Fee",
									description: "Charge for delivery",
									images: [
										"https://cdn1.iconfinder.com/data/icons/logistics-transportation-vehicles/202/logistic-shipping-vehicles-002-512.png",
									],
								},
							],
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

		const content = generateNotificationContent(
			"ORDER",
			order.status,
			order.customer?.firstName!,
			true
		);

		const notification = await createNotification({
			message: content.message,
			userId: app.id!,
			type: "ORDER",
			idToGo: order.id,
			title: content.title,
			toShop: true,
		});

		pubsub.publish("NOTIFICATION_SENT", { notificationSent: notification });

		return order;
	} catch (err) {
		console.log(err);
		throw new GraphQLError((err as GraphQLError).message);
	}
};

export const checkoutCustomizeBouquetResolver = async (
	_: never,
	{
		mainFlower,
		subFlowers,
		tie,
		totalPrice,
		typeOfDelivery,
		wrapper,
		note,
		wrapperColor,
	}: {
		mainFlower: string;
		subFlowers: string[];
		wrapper: string;
		tie: string;
		totalPrice: number;
		note?: string;
		typeOfDelivery: OrderDeliveryType;
		wrapperColor: string;
	},
	app: AppContext
) => {
	try {
		const name = `CUSTOMIZE_${Date.now()}`;
		return await createCustomizeOrder({
			mainFlower,
			name,
			subFlowers,
			tie,
			totalPrice,
			typeOfDelivery,
			userId: app.id,
			wrapper,
			note,
			wrapperColor,
		});
	} catch (err) {
		console.log(err);
		throw new GraphQLError((err as GraphQLError).message);
	}
};
