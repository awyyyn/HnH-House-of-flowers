"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Product } from "@/types";
import { formatCurrency } from "@/lib";
import { Zap } from "lucide-react";
import { useMutation } from "@apollo/client";
import {
	CHECKOUT_MUTATION,
	GET_PRODUCT_QUERY,
	GET_PRODUCTS_QUERY,
} from "@/queries";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

type PaymentType = "CASH" | "GCASH";
type DeliveryType = "PICKUP" | "DELIVERY";

interface CheckoutModalProps {
	product: Product;
	quantity: number;
}

export function CheckoutModal({ product, quantity }: CheckoutModalProps) {
	const [open, setOpen] = useState(false);
	const [paymentType, setPaymentType] = useState<PaymentType>("CASH");
	const [deliveryType, setDeliveryType] = useState<DeliveryType>("PICKUP");
	const [checkout, { loading }] = useMutation(CHECKOUT_MUTATION);
	const { toast } = useToast();
	const navigate = useNavigate();

	const handleSubmit = async () => {
		try {
			const data = await checkout({
				variables: {
					lineItems: [
						{
							amount: product.price,
							id: product.id,
							name: product.name,
							images: product.images,
							quantity,
						},
					],
					totalPrice: product.price * quantity,
					fromCartItem: false,
					typeOfDelivery: deliveryType,
					typeOfPayment: paymentType,
				},
				refetchQueries: [GET_PRODUCT_QUERY, GET_PRODUCTS_QUERY],
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
			} else {
				navigate("/my-orders");
			}
		} catch (err) {
			toast({
				title: "An error occurred",
				description: (err as Error).message,
				variant: "destructive",
			});
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					size="sm"
					className="h-8"
					disabled={loading || product.stock === 0}>
					<Zap className="mr-2 h-3 w-3" />
					Buy Now
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Complete Your Purchase</DialogTitle>
				</DialogHeader>

				<div className="py-4">
					<div className="mb-4">
						<h3 className="font-medium">{product.name}</h3>
						<p className="font-medium">{formatCurrency(product.price)}</p>
					</div>

					<Separator className="my-4" />

					{/* Payment Selection */}
					<div className="space-y-3 mb-4">
						<Label className="text-base">Payment Method</Label>
						<RadioGroup
							disabled={loading}
							defaultValue={paymentType}
							onValueChange={(value: PaymentType) => setPaymentType(value)}
							className="grid grid-cols-2 gap-4">
							<div>
								<RadioGroupItem
									value="CASH"
									id="modal-cash"
									className="peer sr-only"
								/>
								<Label
									htmlFor="modal-cash"
									className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover py-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
									Cash
								</Label>
							</div>
							<div>
								<RadioGroupItem
									value="GCASH"
									id="modal-gcash"
									className="peer sr-only"
								/>
								<Label
									htmlFor="modal-gcash"
									className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover py-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
									GCash
								</Label>
							</div>
						</RadioGroup>
					</div>

					{/* Delivery Selection */}
					<div className="space-y-3">
						<Label className="text-base">Delivery Method</Label>
						<RadioGroup
							disabled={loading}
							defaultValue={deliveryType}
							onValueChange={(value: DeliveryType) => setDeliveryType(value)}
							className="grid grid-cols-2 gap-4">
							<div>
								<RadioGroupItem
									value="PICKUP"
									id="modal-pickup"
									className="peer sr-only"
								/>
								<Label
									htmlFor="modal-pickup"
									className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover py-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
									Pickup
								</Label>
							</div>
							<div>
								<RadioGroupItem
									value="DELIVERY"
									id="modal-delivery"
									className="peer sr-only"
								/>
								<Label
									htmlFor="modal-delivery"
									className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover py-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
									Delivery
								</Label>
							</div>
						</RadioGroup>
					</div>
				</div>

				<div className="flex justify-end">
					<Button onClick={handleSubmit} disabled={loading}>
						{loading ? "Processing..." : "Order Now"}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
