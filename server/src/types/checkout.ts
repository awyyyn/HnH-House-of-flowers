export type CheckoutEvent = {
	id: string;
	type: string;
	attributes: {
		type: string;
		livemode: false;
		data: {
			id: string;
			type: string;
			attributes: {
				billing: {
					address: {
						city: string;
						country: string;
						line1: string;
						line2: string;
						postal_code: string;
						state: string;
					};
					email: string;
					name: string;
					phone: string;
				};
				billing_information_fields_editable: string;
				cancel_url: string;
				checkout_url: string;
				client_key: string;
				customer_email: string;
				description: string;
				line_items: [
					{
						amount: number;
						currency: string;
						description: string;
						images: string[];
						name: string;
						quantity: number;
					}
				];
				livemode: boolean;
				merchant: string;
				paid_at: number;
				payments: [
					{
						id: string;
						type: string;
						attributes: {
							access_url: string;
							amount: number;
							balance_transaction_id: string;
							billing: {
								address: {
									city: string;
									country: string;
									line1: string;
									line2: string;
									postal_code: string;
									state: string;
								};
								email: string;
								name: string;
								phone: string;
							};
							currency: string;
							description: string;
							disputed: boolean;
							external_reference_number: number | string;
							fee: 1250;
							instant_settlement: string | null;
							livemode: boolean;
							net_amount: number;
							origin: string;
							payment_intent_id: string;
							payout: string | null;
							source: {
								id: string;
								type: string;
								provider: {
									id: string | null;
								};
								provider_id: string | null;
							};
							statement_descriptor: string;
							status: string;
							tax_amount: number;
							metadata: any;
							promotion: any;
							refunds: any[];
							taxes: any[];
							available_at: number;
							created_at: number;
							credited_at: number;
							paid_at: number;
							updated_at: number;
						};
					}
				];
				payment_intent: {
					id: string;
					type: string;
					attributes: {
						amount: number;
						capture_type: string;
						client_key: string;
						currency: string;
						description: string;
						livemode: false;
						original_amount: number;
						statement_descriptor: string;
						status: string;
						last_payment_error: any;
						payment_method_allowed: string[];
						payments: [
							{
								id: string;
								type: string;
								attributes: {
									access_url: string | null;
									amount: number;
									balance_transaction_id: string;
									billing: {
										address: {
											city: string;
											country: string;
											line1: string;
											line2: string;
											postal_code: string;
											state: string;
										};
										email: string;
										name: string;
										phone: string;
									};
									currency: string;
									description: string;
									disputed: boolean;
									external_reference_number: string | null;
									fee: number;
									instant_settlement: string | null;
									livemode: boolean;
									net_amount: number;
									origin: string;
									payment_intent_id: string;
									payout: string | null;
									source: {
										id: string;
										type: string;
										provider: {
											id: string | null;
										};
										provider_id: string | null;
									};
									statement_descriptor: string;
									status: string;
									tax_amount: string | null;
									metadata: string | null;
									promotion: string | null;
									refunds: any[];
									taxes: any[];
									available_at: number;
									created_at: number;
									credited_at: number;
									paid_at: number;
									updated_at: number;
								};
							}
						];
						next_action: string | null;
						payment_method_options: string | null;
						metadata: string | null;
						setup_future_usage: string | null;
						created_at: number;
						updated_at: number;
					};
				};
				payment_method_types: string[];
				payment_method_used: string;
				reference_number: string | null;
				send_email_receipt: boolean;
				show_description: boolean;
				show_line_items: boolean;
				status: string;
				success_url: string | null;
				created_at: number;
				updated_at: number;
				metadata: string | null;
			};
		};
		previous_data: any;
		created_at: number;
		updated_at: number;
	};
};
/* 

	{
  "id": "evt_WjX5k2AfLmQBvUDfbA6DaD6r",
  "type": "event",
  "attributes": {
    "type": "checkout_session.payment.paid",
    "livemode": false,
    "data": {
      "id": "cs_geLAWLNVngu9t24qErprAhie",
      "type": "checkout_session",
      "attributes": {
        "billing": {
          "address": {
            "city": null,
            "country": null,
            "line1": null,
            "line2": null,
            "postal_code": null,
            "state": null
          },
          "email": null,
          "name": null,
          "phone": null
        },
        "billing_information_fields_editable": "enabled",
        "cancel_url": null,
        "checkout_url": "https://checkout.paymongo.com/cs_geLAWLNVngu9t24qErprAhie_client_xSEB9SRCMm13bVqgY7W9Sqt4#cGtfdGVzdF9xR1JqdmVjOGJ5RDFIUE1yZ0dvVGtuVHc=",
        "client_key": "cs_geLAWLNVngu9t24qErprAhie_client_xSEB9SRCMm13bVqgY7W9Sqt4",
        "customer_email": null,
        "description": "Test NG ROK DESC",
        "line_items": [
          {
            "amount": 50000,
            "currency": "PHP",
            "description": "Test",
            "images": [],
            "name": "NG ROK",
            "quantity": 1
          }
        ],
        "livemode": false,
        "merchant": "H&N House of Flower",
        "paid_at": 1740816568,
        "payments": [
          {
            "id": "pay_G4drjijCJvXUCDJmdGGVuTAX",
            "type": "payment",
            "attributes": {
              "access_url": null,
              "amount": 50000,
              "balance_transaction_id": "bal_txn_ZKs7xUxQWJi3hSSV1xWLsSaC",
              "billing": {
                "address": {
                  "city": "",
                  "country": "",
                  "line1": "",
                  "line2": "",
                  "postal_code": "",
                  "state": ""
                },
                "email": "asd@das.asd",
                "name": "ads",
                "phone": "as"
              },
              "currency": "PHP",
              "description": "Test NG ROK DESC",
              "disputed": false,
              "external_reference_number": null,
              "fee": 1000,
              "instant_settlement": null,
              "livemode": false,
              "net_amount": 49000,
              "origin": "api",
              "payment_intent_id": "pi_agnQPjuuiUsZKZM5M6DvXTEk",
              "payout": null,
              "source": {
                "id": "paymaya_QzvAMN1mi6f6awUX1YQJjEsy",
                "type": "paymaya",
                "provider": {
                  "id": null
                },
                "provider_id": null
              },
              "statement_descriptor": "H&N House of Flower",
              "status": "paid",
              "tax_amount": null,
              "metadata": null,
              "promotion": null,
              "refunds": [],
              "taxes": [],
              "available_at": 1741165200,
              "created_at": 1740816568,
              "credited_at": 1741770000,
              "paid_at": 1740816568,
              "updated_at": 1740816568
            }
          }
        ],
        "payment_intent": {
          "id": "pi_agnQPjuuiUsZKZM5M6DvXTEk",
          "type": "payment_intent",
          "attributes": {
            "amount": 50000,
            "capture_type": "automatic",
            "client_key": "pi_agnQPjuuiUsZKZM5M6DvXTEk_client_ifwadvxwfiRHMKVa8tb2cZym",
            "currency": "PHP",
            "description": "Test NG ROK DESC",
            "livemode": false,
            "original_amount": 50000,
            "statement_descriptor": "H&N House of Flower",
            "status": "succeeded",
            "last_payment_error": null,
            "payment_method_allowed": [
              "paymaya",
              "gcash"
            ],
            "payments": [
              {
                "id": "pay_G4drjijCJvXUCDJmdGGVuTAX",
                "type": "payment",
                "attributes": {
                  "access_url": null,
                  "amount": 50000,
                  "balance_transaction_id": "bal_txn_ZKs7xUxQWJi3hSSV1xWLsSaC",
                  "billing": {
                    "address": {
                      "city": "",
                      "country": "",
                      "line1": "",
                      "line2": "",
                      "postal_code": "",
                      "state": ""
                    },
                    "email": "asd@das.asd",
                    "name": "ads",
                    "phone": "as"
                  },
                  "currency": "PHP",
                  "description": "Test NG ROK DESC",
                  "disputed": false,
                  "external_reference_number": null,
                  "fee": 1000,
                  "instant_settlement": null,
                  "livemode": false,
                  "net_amount": 49000,
                  "origin": "api",
                  "payment_intent_id": "pi_agnQPjuuiUsZKZM5M6DvXTEk",
                  "payout": null,
                  "source": {
                    "id": "paymaya_QzvAMN1mi6f6awUX1YQJjEsy",
                    "type": "paymaya",
                    "provider": {
                      "id": null
                    },
                    "provider_id": null
                  },
                  "statement_descriptor": "H&N House of Flower",
                  "status": "paid",
                  "tax_amount": null,
                  "metadata": null,
                  "promotion": null,
                  "refunds": [],
                  "taxes": [],
                  "available_at": 1741165200,
                  "created_at": 1740816568,
                  "credited_at": 1741770000,
                  "paid_at": 1740816568,
                  "updated_at": 1740816568
                }
              }
            ],
            "next_action": null,
            "payment_method_options": null,
            "metadata": null,
            "setup_future_usage": null,
            "created_at": 1740816551,
            "updated_at": 1740816568
          }
        },
        "payment_method_types": [
          "gcash",
          "paymaya"
        ],
        "payment_method_used": "paymaya",
        "reference_number": null,
        "send_email_receipt": false,
        "show_description": true,
        "show_line_items": true,
        "status": "active",
        "success_url": null,
        "created_at": 1740816551,
        "updated_at": 1740816551,
        "metadata": null
      }
    },
    "previous_data": {},
    "created_at": 1740816568,
    "updated_at": 1740816568
  }
}
*/

export type Checkout = {
	id: string;
	type: string;
	attributes: {
		billing: {
			address: {
				city: string;
				country: string;
				line1: string;
				line2: string;
				postal_code: string;
				state: string;
			};
			email: string;
			name: string;
			phone: string;
		};
		billing_information_fields_editable: string;
		cancel_url: string;
		checkout_url: string;
		client_key: string;
		customer_email: string;
		description: string;
		line_items: [
			{
				amount: number;
				currency: string;
				description: string;
				images: string[];
				name: string;
				quantity: number;
			}
		];
		livemode: boolean;
		merchant: string;
		payments: CheckoutEvent["attributes"]["data"]["attributes"]["payments"];
		payment_intent: CheckoutEvent["attributes"]["data"]["attributes"]["payment_intent"];
		payment_method_types: string[];
		reference_number: number;
		send_email_receipt: boolean;
		show_description: boolean;
		show_line_items: boolean;
		status: string;
		success_url: string;
		created_at: number;
		updated_at: number;
		metadata: any;
	};
};
