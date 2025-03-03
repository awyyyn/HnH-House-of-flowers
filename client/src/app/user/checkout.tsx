"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useLocation, useNavigate } from "react-router-dom";
import { useAtomValue } from "jotai";
import { cartAtom } from "@/states";
import { useMutation } from "@apollo/client";
import { CHECKOUT_MUTATION } from "@/queries";
import { toast } from "@/hooks/use-toast";

type PaymentType = "CASH" | "GCASH";
type DeliveryType = "PICKUP" | "DELIVERY";

export default function OrderPage() {
	const [paymentType, setPaymentType] = useState<PaymentType>("CASH");
	const [deliveryType, setDeliveryType] = useState<DeliveryType>("PICKUP");
	const [checkout, { loading }] = useMutation(CHECKOUT_MUTATION);
	const { state } = useLocation();
	const navigate = useNavigate();
	const cart = useAtomValue(cartAtom);
	// cart.items.ma

	if (!state.selectedItems.size) return navigate(-1);

	const cartItems = cart.items.filter((item) =>
		state.selectedItems.has(item.id)
	);

	const footerHeight = 320; // Adjust this value based on your footer's actual height

	const handleSubmit = async () => {
		console.log("object");
		try {
			const data = await checkout({
				variables: {
					lineItems: cartItems.map((item) => ({
						amount: item.price,
						id: item.product.id,
						name: item.product.name,
						images: item.product.images,
						quantity: item.quantity,
					})),
					totalPrice: cartItems.reduce(
						(acc, item) => acc + item.price * item.quantity,
						0
					),
					typeOfDelivery: deliveryType,
					typeOfPayment: paymentType,
				},
			});

			const toastTitle =
				paymentType === "GCASH"
					? "Redirecting to payment page"
					: "Order Placed";

			toast({
				title: toastTitle,
				description:
					paymentType === "GCASH"
						? "You are being redirected to complete your GCASH payment."
						: "Your order has been successfully placed!",
				variant: "success",
				duration: 5000,
			});

			if (paymentType === "GCASH") {
				window.location.replace(
					data?.data.createCheckoutSession.payment.checkoutUrl
				);
			}
		} catch (err) {
			console.log(`error qqq`, err);
			toast({
				title: "An error occurred",
				description: (err as Error).message,
				variant: "destructive",
			});
		}
	};

	return (
		<div
			className={`relative    ${
				state.selectedItems.size > 3
					? `min-h-screen pb-[${footerHeight}px]`
					: ""
			}`}>
			{/* Main content area with proper padding for footer */}
			<div className={`space-y-4 `}>
				<h2 className="text-lg font-semibold">Order Items</h2>
				<div className="space-y-4">
					{cartItems.map((item) => (
						<Card key={item.id}>
							<CardContent className="flex items-center justify-between p-4">
								<div>
									<h3 className="font-medium">{item.product.name}</h3>
									<p className="text-sm text-muted-foreground">
										Quantity: {item.quantity}
									</p>
								</div>
								<p className="font-medium">
									{Intl.NumberFormat("en-PH", {
										style: "currency",
										currency: "PHP",
									}).format(item.price)}
								</p>
							</CardContent>
						</Card>
					))}
				</div>
			</div>

			{/* Sticky Footer */}
			<div className="fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
				<div className="container mx-auto px-5 md:px-0 py-4 space-y-4">
					{/* Payment Selection */}
					<div className="space-y-1">
						<Label className="text-base">Payment Method</Label>
						<RadioGroup
							disabled={loading}
							defaultValue={paymentType}
							onValueChange={(value: PaymentType) => setPaymentType(value)}
							className="grid grid-cols-2 gap-4">
							<div>
								<RadioGroupItem
									value="CASH"
									id="cash"
									className="peer sr-only"
								/>
								<Label
									htmlFor="cash"
									className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover py-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
									Cash
								</Label>
							</div>
							<div>
								<RadioGroupItem
									value="GCASH"
									id="gcash"
									className="peer sr-only"
								/>
								<Label
									htmlFor="gcash"
									className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover py-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
									GCash
								</Label>
							</div>
						</RadioGroup>
					</div>

					<Separator />

					{/* Delivery Selection */}
					<div className="space-y-2">
						<Label className="text-base">Delivery Method</Label>
						<RadioGroup
							disabled={loading}
							defaultValue={deliveryType}
							onValueChange={(value: DeliveryType) => setDeliveryType(value)}
							className="grid grid-cols-2 gap-4">
							<div>
								<RadioGroupItem
									value="PICKUP"
									id="pickup"
									className="peer sr-only"
								/>
								<Label
									htmlFor="pickup"
									className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover py-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
									Pickup
								</Label>
							</div>
							<div>
								<RadioGroupItem
									value="DELIVERY"
									id="delivery"
									className="peer sr-only"
								/>
								<Label
									htmlFor="delivery"
									className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover py-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
									Delivery
								</Label>
							</div>
						</RadioGroup>
					</div>

					{/* Total and Continue Button */}
					<div className="flex items-center justify-between pt-2">
						<div>
							<p className="text-sm text-muted-foreground">Total</p>
							<p className="text-lg font-semibold">
								{Intl.NumberFormat("en-PH", {
									style: "currency",
									currency: "PHP",
								}).format(
									cartItems.reduce(
										(acc, item) => acc + item.price * item.quantity,
										0
									)
								)}
							</p>
						</div>
						<Button onClick={handleSubmit} disabled={loading} size="lg">
							{loading ? "Processing..." : "Continue"}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
