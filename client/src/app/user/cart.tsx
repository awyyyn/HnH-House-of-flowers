import CartItem from "./components/cart-item";
import { useAtomValue } from "jotai";
import { cartAtom } from "@/states";
import { ShoppingCart } from "lucide-react";
import { EmptyState, Helmet } from "@/components";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
	const cart = useAtomValue(cartAtom);
	const navigate = useNavigate();
	const total = cart.items.reduce((total, item) => total + item.price, 0);

	const errors = cart.items.map((item) => {
		if (item.quantity > item.product.stock) {
			return true;
		}
		return false;
	});

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
						{cart.items.map((item, index) => (
							<CartItem isError={errors[index]} key={item.id} item={item} />
						))}
						<div className="mt-4  flex justify-between">
							<span></span>
							<p className="text-xl font-semibold">
								Total:{" "}
								{Intl.NumberFormat("en-PH", {
									style: "currency",
									currency: "PHP",
								}).format(total)}
							</p>
							{/* <Button>Buy</Button> */}
						</div>
					</>
				)}
			</div>
		</>
	);
}
