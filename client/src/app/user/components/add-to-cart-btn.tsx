import { useState } from "react";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Product } from "@/types";
import { useMutation } from "@apollo/client";
import { ADD_TO_CART_MUTATION } from "@/queries";
import { useAuth } from "@/contexts";
import { useToast } from "@/hooks/use-toast";
import { useAtom } from "jotai";
import { cartAtom } from "@/states";
import { CheckoutModal } from "./buy-now-modal";

export default function AddToCartInline(product: Product) {
	const { user } = useAuth();
	const [cart, setCart] = useAtom(cartAtom);
	const [quantity, setQuantity] = useState(1);
	const [addToCart, { loading }] = useMutation(ADD_TO_CART_MUTATION);

	const { toast } = useToast();

	const decrementQuantity = () => {
		setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
	};

	const incrementQuantity = () => {
		if (product.stock > quantity) {
			setQuantity((prev) => prev + 1);
		}
	};

	const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = Number.parseInt(e.target.value, 10);
		setQuantity(isNaN(value) || value < 1 ? 1 : value);
	};

	const handleAddToCart = async () => {
		try {
			const { data } = await addToCart({
				variables: {
					price: product.price * quantity,
					quantity,
					productId: product.id,
					cartId: user?.cart?.id,
				},
			});
			const updatedCartItems = cart.items ? [...cart.items] : [];
			const index = updatedCartItems.findIndex(
				(item) => item.product.id === product.id
			);

			if (index > -1) {
				updatedCartItems[index] = data.cartItem;
			} else {
				updatedCartItems.push(data.cartItem);
			}

			setCart((p) => ({ ...p, items: updatedCartItems }));

			toast({
				title: "Success",
				description: "Item added to cart",
				variant: "success",
			});
		} catch (error) {
			toast({
				title: "Error",
				description: (error as Error).message,
				variant: "destructive",
			});
		}
	};

	return (
		<div className="flex items-center space-x-2">
			{product.status === "IN_STOCK" && (
				<>
					<div className="flex border rounded-md">
						<Button
							variant="ghost"
							size="icon"
							onClick={decrementQuantity}
							disabled={quantity == 1 || loading}
							className="h-8 w-8 rounded-r-none">
							<Minus className="h-3 w-3" />
						</Button>
						<Input
							type="number"
							min="1"
							readOnly
							value={quantity}
							onChange={handleQuantityChange}
							className="h-8 w-12 rounded-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-none"
						/>
						<Button
							variant="ghost"
							size="icon"
							disabled={product.stock <= quantity || loading}
							onClick={incrementQuantity}
							className="h-8 w-8 rounded-l-none">
							<Plus className="h-3 w-3" />
						</Button>
					</div>
					<div className="flex gap-2 ">
						<Button
							variant="secondary"
							onClick={handleAddToCart}
							size="sm"
							className="h-8"
							disabled={loading || product.stock === 0}>
							<ShoppingCart className="mr-2 h-3 w-3" />
							Add to Cart
						</Button>

						<CheckoutModal product={product} quantity={quantity} />
					</div>
				</>
			)}
		</div>
	);
}
