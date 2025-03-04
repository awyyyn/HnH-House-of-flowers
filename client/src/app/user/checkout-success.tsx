import {
	Button,
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components";
import { CheckCircle, ChevronLeft, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

export default function CheckoutSuccess() {
	return (
		<div className="container max-w-md mx-auto py-10 px-4">
			<Card className="border-none shadow-lg">
				<CardHeader className="text-center pb-6">
					<div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
						<CheckCircle className="h-10 w-10 text-primary" />
					</div>
					<CardTitle className="text-2xl font-bold">Order Confirmed!</CardTitle>
					<CardDescription>
						Thank you for your purchase. Your order has been received.
					</CardDescription>
				</CardHeader>
				{/* <CardContent className="space-y-6">
					<div className="rounded-lg bg-muted p-4">
						<div className="flex justify-between items-center mb-4">
							<div className="flex items-center gap-2">
								<Package className="h-5 w-5 text-muted-foreground" />
								<span className="font-medium">Order Details</span>
							</div>
							<span className="text-sm text-muted-foreground">
								{orderDetails.date}
							</span>
						</div>

						<div className="space-y-3 text-sm">
							<div className="flex justify-between">
								<span className="text-muted-foreground">Order number</span>
								<span className="font-medium">{orderDetails.orderId}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground">Items</span>
								<span className="font-medium">{orderDetails.items}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground">Total</span>
								<span className="font-medium">{orderDetails.total}</span>
							</div>
							<Separator className="my-2" />
							<div className="flex justify-between">
								<span className="text-muted-foreground">
									Confirmation sent to
								</span>
								<span className="font-medium">{orderDetails.email}</span>
							</div>
						</div>
					</div>

					<div className="text-center text-sm text-muted-foreground">
						<p>
							We'll email you an order confirmation with details and tracking
							info.
						</p>
					</div>
				</CardContent> */}
				<CardFooter className="flex flex-col gap-2">
					{/* <Button className="w-full" asChild>
						<Link to="/orders">
							<Package className="mr-2 h-4 w-4" />
							View Order Status
						</Link>
					</Button> */}
					<Button className="w-full" asChild>
						<Link to="/flowers">
							<ShoppingBag className="mr-2 h-4 w-4" />
							Continue Shopping
						</Link>
					</Button>
					<Button variant="ghost" size="sm" className=" w-full" asChild>
						<Link
							to="/"
							className="flex items-center text-sm text-muted-foreground">
							<ChevronLeft className="mr-1 h-4 w-4" />
							Back to home
						</Link>
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
