import {
	Alert,
	AlertDescription,
	AlertTitle,
	Button,
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components";
import { AlertCircle, ChevronLeft, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function CheckoutError() {
	// This would typically come from your payment processor
	const errorDetails = {
		errorCode: "PAYMENT_FAILED",
		errorMessage:
			"Your payment could not be processed. Please try again or use a different payment method.",
		orderId: "ORD-12345-ABCDE",
		timestamp: new Date().toLocaleString(),
	};

	return (
		<div className="container max-w-md mx-auto py-10 px-4">
			<Card className="border-none shadow-lg">
				<CardHeader className="text-center pb-6">
					<div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
						<AlertCircle className="h-10 w-10 text-destructive" />
					</div>
					<CardTitle className="text-2xl font-bold">Payment Failed</CardTitle>
					<CardDescription>
						We encountered an issue while processing your payment.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<Alert variant="destructive">
						<AlertCircle className="h-4 w-4" />
						<AlertTitle>Error</AlertTitle>
						<AlertDescription>{errorDetails.errorMessage}</AlertDescription>
					</Alert>

					{/* <div className="rounded-lg bg-muted p-4">
						<div className="flex items-center gap-2 mb-4">
							<HelpCircle className="h-5 w-5 text-muted-foreground" />
							<span className="font-medium">Error Details</span>
						</div>

						<div className="space-y-3 text-sm">
							<div className="flex justify-between">
								<span className="text-muted-foreground">Error code</span>
								<span className="font-medium">{errorDetails.errorCode}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground">Order reference</span>
								<span className="font-medium">{errorDetails.orderId}</span>
							</div>
							<Separator className="my-2" />
							<div className="flex justify-between">
								<span className="text-muted-foreground">Timestamp</span>
								<span className="font-medium">{errorDetails.timestamp}</span>
							</div>
						</div>
					</div> */}

					<div className="text-center text-sm text-muted-foreground">
						<p>
							If this problem persists, please contact our customer support team
							for assistance.
						</p>
					</div>
				</CardContent>
				<CardFooter className="flex flex-col gap-2">
					{/* <Button className="w-full">
						<RefreshCw className="mr-2 h-4 w-4" />
						Try Again
					</Button>
					<Button variant="outline" className="w-full" asChild>
						<Link to="/checkout">
							<ShoppingBag className="mr-2 h-4 w-4" />
							Return to Checkout
						</Link>
					</Button> */}
					<Button variant="secondary" className="w-full" asChild>
						<Link to="/contact">
							<HelpCircle className="mr-2 h-4 w-4" />
							Contact Support
						</Link>
					</Button>
					<Button variant="ghost" size="sm" className="mt-2" asChild>
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
