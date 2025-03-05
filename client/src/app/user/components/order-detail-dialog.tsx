"use client";

import {
	AlertCircle,
	Calendar,
	CheckCircle2,
	Clock,
	MapPin,
	Package,
	Truck,
	X,
} from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import { format, formatDate } from "date-fns";
import { Order } from "@/types";
// import type { OrderWithItems } from "./types";

interface OrderDetailDialogProps {
	// order: OrderWithItems;
	order: Order;
	open: boolean;
	onClose: () => void;
}

export default function OrderDetailDialog({
	order,
	open,
	onClose,
}: OrderDetailDialogProps) {
	const getStatusStep = () => {
		const statuses = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED"];
		if (order.status === "CANCELLED") return -1;
		if (order.status === "READY_FOR_PICKUP") return 2; // Same level as SHIPPED
		return statuses.indexOf(order.status);
	};

	const statusStep = getStatusStep();

	return (
		<Dialog open={open} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<div className="flex items-center justify-between">
						<DialogTitle>Order #{order.id.slice(-6)}</DialogTitle>
						<DialogClose asChild>
							<Button variant="ghost" size="icon">
								<X className="h-4 w-4" />
								<span className="sr-only">Close</span>
							</Button>
						</DialogClose>
					</div>
					<DialogDescription className="flex items-center gap-2">
						<Calendar className="h-3.5 w-3.5" />
						Placed on{" "}
						{formatDate(
							new Date(Number(order.orderDate)),
							"MMMM dd, yyyy"
						)} - {format(new Date(Number(order.orderDate)), "hh:mm a")}
					</DialogDescription>
				</DialogHeader>

				{/* Order Status Timeline */}
				{order.status !== "CANCELLED" && (
					<div className="my-4">
						<h3 className="font-medium mb-4">Order Status</h3>
						<div className="relative flex justify-between">
							{/* Progress Bar */}
							<div className="absolute top-4 left-0 right-0 h-1 bg-muted">
								<div
									className="absolute h-1 bg-primary transition-all"
									style={{
										width:
											statusStep >= 0
												? `${Math.min(100, (statusStep / 3) * 100)}%`
												: "0%",
									}}
								/>
							</div>

							{/* Status Steps */}
							<div className="relative z-10 flex flex-col items-center">
								<div
									className={`rounded-full p-2 ${
										statusStep >= 0 ? "bg-primary text-white" : "bg-muted"
									}`}>
									<Package className="h-4 w-4" />
								</div>
								<span className="text-xs mt-2">Pending</span>
								{order.status === "PENDING" && (
									<span className="text-xs text-muted-foreground mt-1 flex items-center">
										<Clock className="h-3 w-3 mr-1" />
										Awaiting confirmation
									</span>
								)}
							</div>

							<div className="relative z-10 flex flex-col items-center">
								<div
									className={`rounded-full p-2 ${
										statusStep >= 1 ? "bg-primary text-white" : "bg-muted"
									}`}>
									<Package className="h-4 w-4" />
								</div>
								<span className="text-xs mt-2">Processing</span>
								{order.status === "PROCESSING" && (
									<span className="text-xs text-muted-foreground mt-1 flex items-center">
										<Clock className="h-3 w-3 mr-1" />
										Preparing your order
									</span>
								)}
							</div>

							<div className="relative z-10 flex flex-col items-center">
								<div
									className={`rounded-full p-2 ${
										statusStep >= 2 ? "bg-primary text-white" : "bg-muted"
									}`}>
									{order.typeOfDelivery === "DELIVERY" ? (
										<Truck className="h-4 w-4" />
									) : (
										<MapPin className="h-4 w-4" />
									)}
								</div>
								<span className="text-xs mt-2">
									{order.typeOfDelivery === "DELIVERY"
										? "Shipped"
										: "Ready for Pickup"}
								</span>
								{(order.status === "SHIPPED" ||
									order.status === "READY_FOR_PICKUP") && (
									<span className="text-xs text-muted-foreground mt-1 flex items-center">
										<Clock className="h-3 w-3 mr-1" />
										{order.typeOfDelivery === "DELIVERY"
											? "On the way"
											: "Ready at store"}
									</span>
								)}
							</div>

							<div className="relative z-10 flex flex-col items-center">
								<div
									className={`rounded-full p-2 ${
										statusStep >= 3 ? "bg-primary text-white" : "bg-muted"
									}`}>
									<CheckCircle2 className="h-4 w-4" />
								</div>
								<span className="text-xs mt-2">Completed</span>
								{order.status === "DELIVERED" && (
									<span className="text-xs text-muted-foreground mt-1 flex items-center">
										<CheckCircle2 className="h-3 w-3 mr-1" />
										{formatDate(
											new Date(Number(order.deliveredAt || order.orderDate)),
											"MMMM dd, yyyy"
										)}{" "}
										- {format(new Date(Number(order.deliveredAt)), "hh:mm a")}
									</span>
								)}
							</div>
						</div>
					</div>
				)}

				{order.status === "CANCELLED" && (
					<div className="my-4 p-4 bg-red-50 border border-red-200 rounded-md flex items-center gap-3">
						<AlertCircle className="h-5 w-5 text-red-500" />
						<div>
							<h3 className="font-medium text-red-700">Order Cancelled</h3>
							<p className="text-sm text-red-600">
								This order was cancelled on{" "}
								{formatDate(
									new Date(Number(order.cancelledAt)),
									"MMMM dd, yyyy"
								)}{" "}
								- {format(new Date(Number(order.cancelledAt)), "hh:mm a")}
							</p>
						</div>
					</div>
				)}

				{/* Order Details */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4">
					<div>
						<h3 className="font-medium mb-2">Delivery Information</h3>
						<div className="text-sm space-y-1">
							<p className="capitalize">
								<span className="font-medium">Method:</span>{" "}
								{order.typeOfDelivery.toLowerCase()}
							</p>
							{order.customer?.address && (
								<p>
									<span className="font-medium">Address:</span>{" "}
									{order.customer.address.street}, {order.customer.address.city}
									{order.customer.address.zone &&
										`, ${order.customer.address.zone}`}
								</p>
							)}
						</div>
					</div>

					<div>
						<h3 className="font-medium mb-2">Payment Information</h3>
						<div className="text-sm space-y-1">
							<p className="capitalize">
								<span className="font-medium">Method:</span>{" "}
								{order.typeOfPayment.toLowerCase()}
							</p>
							<p>
								<span className="font-medium">Status:</span>{" "}
								<Badge
									variant={
										order.payment?.status === "SUCCESS" ? "default" : "outline"
									}>
									{order.payment?.status || "PENDING"}
								</Badge>
							</p>
						</div>
					</div>
				</div>

				<Separator />

				{/* Order Items */}
				<div className="my-4">
					<h3 className="font-medium mb-4">Order Items</h3>
					<div className="space-y-4">
						{order.orderItems.map((item) => (
							<div key={item.id} className="flex gap-4">
								<div className="h-16 w-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
									{item.product?.images?.[0] ? (
										<img
											src={item.product.images[0] || "/placeholder.svg"}
											alt={item.product.name}
											width={64}
											height={64}
											className="h-full w-full object-cover"
										/>
									) : (
										<div className="h-full w-full flex items-center justify-center bg-muted">
											<Package className="h-8 w-8 text-muted-foreground" />
										</div>
									)}
								</div>
								<div className="flex-1">
									<h4 className="font-medium">
										{item.product?.name || "Product"}
									</h4>
									<div className="flex justify-between mt-1">
										<p className="text-sm text-muted-foreground">
											Qty: {item.quantity}
										</p>
										<p className="font-medium">{formatCurrency(item.price)}</p>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>

				<Separator />

				{/* Order Summary */}
				<div className="mt-4">
					<h3 className="font-medium mb-2">Order Summary</h3>
					<div className="space-y-2">
						<div className="flex justify-between text-sm">
							<span>
								Subtotal (
								{order.orderItems.reduce((acc, item) => acc + item.quantity, 0)}{" "}
								items)
							</span>
							<span>
								{formatCurrency(
									order.orderItems.reduce((acc, item) => acc + item.price, 0)
								)}
							</span>
						</div>
						<div className="flex justify-between text-sm">
							<span>Delivery Fee</span>
							<span>
								{formatCurrency(
									order.totalPrice -
										order.orderItems.reduce((acc, item) => acc + item.price, 0)
								)}
							</span>
						</div>
						<Separator className="my-2" />
						<div className="flex justify-between font-medium">
							<span>Total</span>
							<span>{formatCurrency(order.totalPrice)}</span>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
