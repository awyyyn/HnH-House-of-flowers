import { useState } from "react";
import CartItem from "./components/cart-item";
import { useAtomValue } from "jotai";
import { cartAtom } from "@/states";
import { ShoppingCart } from "lucide-react";
import { EmptyState, Helmet } from "@/components";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

export default function CartPage() {
	const cart = useAtomValue(cartAtom);
	const navigate = useNavigate();
	const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

	// Calculate total only for selected items
	const total = cart.items
		.filter((item) => selectedItems.has(item.id))
		.reduce((total, item) => total + item.price, 0);

	// Check for errors in selected cart items
	const itemErrors = cart.items
		.filter((item) => selectedItems.has(item.id))
		.map((item) => {
			if (item.quantity > item.product.stock) {
				return `${item.product.name} - Quantity exceeds available stock`;
			}
			if (item.product.stock === 0) {
				return `${item.product.name} - Out of stock`;
			}
			return null;
		})
		.filter(Boolean);

	const hasErrors = itemErrors.length > 0;
	const hasSelectedItems = selectedItems.size > 0;

	// Handle select all
	// const handleSelectAll = (checked: boolean) => {
	// 	if (checked) {
	// 		setSelectedItems(new Set(cart.items.map((item) => item.id)));
	// 	} else {
	// 		setSelectedItems(new Set());
	// 	}
	// };

	// Handle individual item selection
	const handleSelectItem = (itemId: string, checked: boolean) => {
		const newSelected = new Set(selectedItems);
		if (checked) {
			newSelected.add(itemId);
		} else {
			newSelected.delete(itemId);
		}
		setSelectedItems(newSelected);
	};

	// Check if all items are selected
	// const isAllSelected =
	// 	cart.items.length > 0 && selectedItems.size === cart.items.length;

	return (
		<>
			<Helmet title="Cart" />
			<div className="max-w-screen-lg mx-auto p-4 mb-6">
				<h2 className="text-2xl font-bold mb-4">Your Cart</h2>
				{cart.items.length === 0 ? (
					<EmptyState
						icon={ShoppingCart}
						title="Your cart is empty"
						description="Looks like you haven't added any items to your cart yet. Start shopping to fill it up!"
						actionLabel="Start Shopping"
						onAction={() => {
							navigate("/flowers");
						}}
					/>
				) : (
					<>
						<div className="border rounded-lg overflow-hidden">
							{/* Select All Header */}
							{/* <div className="bg-muted/50 p-4  ">
								<div className="flex items-center gap-2">
									<Checkbox
										id="select-all"
										checked={isAllSelected}
										onCheckedChange={handleSelectAll}
									/>
									<label
										htmlFor="select-all"
										className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
										Select All Items
									</label>
								</div>
							</div> */}

							{/* Cart Items */}
							<div className="divide-y">
								{cart.items.map((item) => (
									<div key={item.id} className="flex items-center gap-4 p-4">
										<Checkbox
											id={`select-${item.id}`}
											checked={selectedItems.has(item.id)}
											onCheckedChange={(checked) =>
												handleSelectItem(item.id, checked as boolean)
											}
											disabled={
												item.quantity > item.product.stock ||
												item.product.stock === 0
											}
										/>
										<div className="flex-1">
											<CartItem
												isError={
													item.quantity > item.product.stock ||
													item.product.stock === 0
												}
												item={item}
											/>
										</div>
									</div>
								))}
							</div>
						</div>

						<div className="mt-6 border-t pt-4">
							<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
								<div className="space-y-1">
									<div className="text-sm text-muted-foreground">
										Selected Items: {selectedItems.size}
									</div>
									<div className="text-xl font-semibold">
										Total:{" "}
										{Intl.NumberFormat("en-PH", {
											style: "currency",
											currency: "PHP",
										}).format(total)}
									</div>
								</div>

								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger asChild>
											<span>
												<Button
													size="lg"
													disabled={!hasSelectedItems || hasErrors}
													onClick={() => {
														navigate("/checkout", { state: { selectedItems } });
													}}>
													Buy Selected Items
												</Button>
											</span>
										</TooltipTrigger>
										{(hasErrors || !hasSelectedItems) && (
											<TooltipContent className="max-w-[300px]">
												{!hasSelectedItems ? (
													<p>Please select items to purchase</p>
												) : (
													<>
														<p className="font-medium">
															Cannot proceed with purchase:
														</p>
														<ul className="list-disc ml-4 mt-1 text-sm">
															{itemErrors.map((error, index) => (
																<li key={index}>{error}</li>
															))}
														</ul>
													</>
												)}
											</TooltipContent>
										)}
									</Tooltip>
								</TooltipProvider>
							</div>
						</div>
					</>
				)}
			</div>
		</>
	);
}
