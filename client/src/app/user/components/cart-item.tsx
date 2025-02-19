import { useState } from "react";
import { Minus, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CartItem } from "@/types/cart";
import { useMutation } from "@apollo/client";
import { REMOVE_TO_CART_MUTATION } from "@/queries";
import { useSetAtom } from "jotai";
import { cartAtom } from "@/states";
import { Badge } from "@/components";

interface CartItemProps {
	item: CartItem;
	isError?: boolean;
}

export default function CartItemPage({ item, isError = false }: CartItemProps) {
	const [quantity, setQuantity] = useState(item.quantity);
	const [removeToCart] = useMutation(REMOVE_TO_CART_MUTATION);
	const handleQuantityChange = (newQuantity: number) => {
		setQuantity(newQuantity);
		setCart((cart) => {
			const items = cart.items.map((itm) => {
				if (itm.id === item.id) {
					return {
						...itm,
						quantity: newQuantity,
						price: newQuantity * itm.product.price,
					};
				} else {
					return itm;
				}
			});

			return { ...cart, items: items };
		});
	};
	const setCart = useSetAtom(cartAtom);

	return (
		<div
			className={`flex items-start justify-between space-x-4 py-4 ${
				isError ? "border-red-500 border" : "border-b "
			}`}>
			<div className="flex gap-2 ">
				<img
					src={item.product.images[0] || "/placeholder.svg"}
					alt={`Product-${item.product.name}`}
					className="w-32 h-32 object-contain dark:bg-zinc-800  border-primary/5 p-2 border"
				/>
				<div className="flex flex-col justify-between">
					<div className="flex-grow">
						<h3 className="font-semibold text-xl lg:text-3xl">
							{item.product.name}
						</h3>
						<p className="text-sm text-gray-500 dark:text-gray-300">
							x{item.quantity}
						</p>
						<p className="text-sm text-gray-500 dark:text-gray-300">
							{Intl.NumberFormat("en-PH", {
								style: "currency",
								currency: "PHP",
							}).format(item.price)}
						</p>
					</div>
					<div className="flex items-center space-x-2">
						<Button
							disabled={quantity == 1}
							variant="outline"
							size="icon"
							className="border-zinc dark:border-none"
							onClick={() => handleQuantityChange(quantity - 1)}
							aria-label="Decrease quantity">
							<Minus className="h-4 w-4" />
						</Button>
						<Input
							type="number"
							value={quantity}
							readOnly
							onChange={(e) =>
								handleQuantityChange(Number.parseInt(e.target.value, 10))
							}
							className="w-14 text-center dark:bg-background"
							min="1"
						/>
						<Button
							disabled={quantity >= item.product.stock}
							variant="outline"
							size="icon"
							className="border-zinc dark:border-none"
							onClick={() => handleQuantityChange(quantity + 1)}
							aria-label="Increase quantity">
							<Plus className="h-4 w-4" />
						</Button>
					</div>
				</div>
			</div>

			<div className="flex min-h-28  items-end flex-col justify-between">
				<Button
					variant="ghost"
					size="icon"
					className="dark:bg-primary/5 dark:hover:bg-primary/15"
					// onClick={() => onRemove(id)}
					onClick={async () => {
						try {
							removeToCart({
								variables: {
									id: item.id,
								},
							});

							setCart((p) => ({
								...p,
								items: p.items.filter((i) => i.id !== item.id),
							}));
						} catch (err) {
							//
							console.error(err);

							setCart((cart) => ({
								...cart,
								items: cart.items.filter((i) => i.id !== item.id),
							}));
						}
					}}
					aria-label="Remove item">
					<X className="h-4 w-4" />
				</Button>
				{item.product.stock > 0 && item.product.status === "IN_STOCK" && (
					<p className="text-sm">Available Stock: {item.product.stock}</p>
				)}
				<Badge className="capitalize">
					{item.product.status.toLowerCase().split("_").join(" ")}
				</Badge>
			</div>
		</div>
	);
}
