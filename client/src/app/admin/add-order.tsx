"use client";

import type React from "react";

import { useState } from "react";
import { Loader2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import ProductItem from "./components/product-item";
import { Product } from "@/types";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_ORDER_MUTATION, GET_PRODUCTS_QUERY } from "@/queries";
import { formatCurrency } from "@/lib";

// Mock product data - replace with actual data fetching in a real implementation

export default function AddOrderForm() {
	const [items, setItems] = useState<Array<Product & { quantity: number }>>([]);
	const { toast } = useToast();
	const [paymentType, setPaymentType] = useState<"CASH" | "GCASH">("CASH");
	const [placeOrder, { loading }] = useMutation(CREATE_ORDER_MUTATION);
	// const [deliveryType, setDeliveryType] = useState<"PICKUP" | "DELIVERY">(
	// 	"PICKUP"
	// );
	// const [isPreOrder, setIsPreOrder] = useState(false);
	const { data } = useQuery<{
		products: { data: Product[]; hasNextPage: boolean; total: number };
	}>(GET_PRODUCTS_QUERY, {
		variables: {
			status: ["IN_STOCK"],
		},
	});

	// Calculate total price
	const totalPrice = items.reduce(
		(sum, item) => sum + item.price * item.quantity,
		0
	);

	// Add a new order item
	const addOrderItem = () => {
		if (data?.products.data) {
			const randomIndex = Math.floor(Math.random() * data.products.data.length);
			const product = data.products.data[randomIndex];
			setItems((prevItems) => [...prevItems, { ...product, quantity: 1 }]);
		}
	};

	const updateOrderQuantity = (id: string, increment: boolean) => {
		setItems((prevItems) =>
			prevItems.map((item) => {
				if (item.id === id) {
					const newQuantity = increment
						? item.quantity + 1
						: Math.max(item.quantity - 1, 1);
					return { ...item, quantity: newQuantity };
				}
				return item;
			})
		);
	};

	const updateOrderItem = (product: Product, oldId: string) => {
		setItems((prevItems) =>
			prevItems.map((item) => {
				if (item.id === oldId) {
					return { ...product, quantity: item.quantity };
				}
				return item;
			})
		);
	};

	// Remove an order item
	const removeOrderItem = (id: string) => {
		setItems((prev) => prev.filter((item) => item.id !== id));
	};

	// Handle form submission
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (items.length === 0) {
			toast({
				title: "Error",
				description: "Please add at least one product to the order",
				variant: "destructive",
			});
			return;
		}
		try {
			await placeOrder({
				variables: {
					lineItems: items.map((item) => ({
						amount: item.price,
						id: item.id,
						name: item.name,
						images: item.images,
						quantity: item.quantity,
					})),
					totalPrice,
				},
			});
			toast({
				variant: "success",
				title: "Order Created",
				description: "Order has been successfully created",
			});
			setItems([]);
		} catch (err) {
			toast({
				title: "Error",
				description: (err as Error).message,
				variant: "destructive",
			});
		}
	};

	return (
		<div className="container mx-auto py-6 max-w-3xl">
			<Card>
				<CardHeader>
					<CardTitle>Create New Order</CardTitle>
					<CardDescription>
						Add a new personal order without requiring a customer account
					</CardDescription>
				</CardHeader>
				<form onSubmit={handleSubmit}>
					<CardContent className="space-y-6">
						{/* Order Items */}
						<div className="space-y-4">
							<div className="flex justify-between items-center">
								<h3 className="text-lg font-medium">Order Items</h3>
								<Button
									type="button"
									onClick={addOrderItem}
									size="sm"
									variant="outline">
									<Plus className="h-4 w-4 mr-2" />
									Add Item
								</Button>
							</div>

							{items.length === 0 ? (
								<div className="text-center py-4 text-muted-foreground">
									No items added. Click "Add Item" to start your order.
								</div>
							) : (
								<div className="space-y-4">
									{items.map((item) => (
										<ProductItem
											updateOrderItem={updateOrderItem}
											removeOrderItem={removeOrderItem}
											updateOrderQuantity={updateOrderQuantity}
											item={item}
											key={item.id}
											products={data?.products.data || []}
										/>
									))}
								</div>
							)}
						</div>

						<Separator />

						{/* Order Options */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{/* Payment Options */}
							<div className="space-y-4">
								<h3 className="text-lg font-medium">Payment Method</h3>
								<RadioGroup
									value={paymentType}
									onValueChange={(value) =>
										setPaymentType(value as "CASH" | "GCASH")
									}>
									<div className="flex items-center space-x-2">
										<RadioGroupItem value="CASH" id="cash" />
										<Label htmlFor="cash">Cash</Label>
									</div>
									{/* <div className="flex items-center space-x-2">
										<RadioGroupItem value="GCASH" id="gcash" />
										<Label htmlFor="gcash">GCash</Label>
									</div> */}
								</RadioGroup>
							</div>
						</div>

						{/* Pre-order Option */}
						{/* <div className="flex items-center space-x-2">
							<Switch
								id="pre-order"
								checked={isPreOrder}
								onCheckedChange={setIsPreOrder}
							/>
							<Label htmlFor="pre-order">This is a pre-order</Label>
						</div> */}

						{/* Order Summary */}
						<div className="bg-muted p-4 rounded-lg">
							<h3 className="text-lg font-medium mb-2">Order Summary</h3>
							<div className="space-y-1">
								<div className="flex justify-between">
									<span>
										Items ({items.reduce((sum, item) => sum + item.quantity, 0)}
										)
									</span>
									<span> {formatCurrency(totalPrice)}</span>
								</div>
								<Separator className="my-2" />
								<div className="flex justify-between font-medium">
									<span>Total</span>
									<span> {formatCurrency(totalPrice)}</span>
								</div>
							</div>
						</div>
					</CardContent>
					<CardFooter>
						<Button
							disabled={!items.length || loading}
							type="submit"
							className="w-full">
							{loading ? (
								<>
									<Loader2 className="animate-spin" />
									<span> Placing order...</span>
								</>
							) : (
								"Place Order"
							)}
						</Button>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
}
