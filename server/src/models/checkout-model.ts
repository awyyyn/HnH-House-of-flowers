import { environment } from "@/environments/environment.js";

export const createCheckoutSession = async () => {
	const response = "Session created";

	const url = "https://api.paymongo.com/v1/checkout_sessions";
	const options = {
		method: "POST",
		headers: {
			accept: "application/json",
			"Content-Type": "application/json",
			authorization: `Basic ${environment.PAYMONGO_SECRET}`,
		},
		body: JSON.stringify({
			data: {
				attributes: {
					send_email_receipt: false,
					show_description: true,
					show_line_items: true,
					description: "Test NG ROK DESC",
					line_items: [
						{
							currency: "PHP",
							amount: 50000,
							description: "Test",
							name: "NG ROK",
							quantity: 1,
						},
					],
					payment_method_types: ["gcash", "paymaya"],
				},
			},
		}),
	};

	fetch(url, options)
		.then((res) => res.json())
		.then((json) => console.log(json))
		.catch((err) => console.error(err));
};
