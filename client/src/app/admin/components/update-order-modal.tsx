import React, { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Order, OrderStatus } from "@/types";
import { formatOrderDate } from "@/lib";
import { useMutation } from "@apollo/client";
import { UPDATE_ORDER_MUTATION } from "@/queries";

interface OrderStatusUpdateModalProps {
	order: Order | null;
	isOpen: boolean;
	onClose: () => void;
}

const OrderStatusUpdateModal: React.FC<OrderStatusUpdateModalProps> = ({
	order,
	isOpen,
	onClose,
}) => {
	const [status, setStatus] = useState<OrderStatus | "">("");
	const { toast } = useToast();
	const [updateStatus, { loading }] = useMutation(UPDATE_ORDER_MUTATION);

	// Reset status when modal opens with new order
	React.useEffect(() => {
		if (order) {
			setStatus(order.status);
		}
	}, [order]);

	if (!order) return null;

	const handleSubmit = async () => {
		if (!status) {
			toast({
				title: "Error",
				description: "Please select a status",
				variant: "destructive",
			});
			return;
		}

		try {
			await updateStatus({
				variables: {
					id: order.id,
					status,
				},
			});

			toast({
				title: "Success",
				description: `Order ${order.formattedId} status updated to ${status}`,
			});
			onClose();
		} catch {
			toast({
				title: "Error",
				description: "Failed to update order status",
				variant: "destructive",
			});
		}
	};

	// Determine which dates are already set
	const hasProcessedDate = !!order.processedAt;
	const hasShippedDate = !!order.shippedAt;
	const hasCancelledDate = !!order.cancelledAt;
	const hasPickUpDate = !!order.forPickup;
	const hasCompletedDate = !!order.completedAt;

	// Get preview of which dates will be updated based on selected status
	const getDateUpdatePreview = () => {
		switch (status) {
			case "PROCESSING":
				return !hasProcessedDate ? "Will set processed date to now" : "";
			case "SHIPPED":
				return !hasShippedDate ? "Will set shipped date to now" : "";
			case "COMPLETED":
				return !hasPickUpDate ? "Will set delivered date to now" : "";
			case "CANCELLED":
				return !hasCancelledDate ? "Will set cancelled date to now" : "";
			case "READY_FOR_PICKUP":
				return !hasCompletedDate ? "Will set completed date to now" : "";
			default:
				return "";
		}
	};

	const datePreview = getDateUpdatePreview();

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Update Order Status</DialogTitle>
					<DialogDescription>
						Update the status for order {order.formattedId}
					</DialogDescription>
				</DialogHeader>

				<div className="grid gap-4 py-4">
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="status" className="text-right">
							Current Status
						</Label>
						<div className="col-span-3 font-medium">{order.status}</div>
					</div>

					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="new-status" className="text-right">
							New Status
						</Label>
						<div className="col-span-3">
							<Select
								value={status}
								onValueChange={(value) => {
									console.log(setStatus(value as OrderStatus));
								}}>
								<SelectTrigger>
									<SelectValue placeholder="Select new status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem
										disabled={true}
										value="PENDING"
										className="capitalize">
										Pending
									</SelectItem>
									<SelectItem
										disabled={hasProcessedDate}
										value="PROCESSING"
										className="capitalize">
										Processing
									</SelectItem>
									{order.typeOfDelivery === "DELIVERY" ? (
										<>
											<SelectItem
												disabled={hasShippedDate || !hasProcessedDate}
												value="SHIPPED"
												className="capitalize">
												Shipped
											</SelectItem>
											<SelectItem
												disabled={hasPickUpDate || !hasShippedDate}
												value="COMPLETED"
												className="capitalize">
												Delivered
											</SelectItem>
										</>
									) : (
										<>
											<SelectItem
												disabled={hasPickUpDate || !hasProcessedDate}
												value="READY_FOR_PICKUP">
												Ready for pickup
											</SelectItem>
											<SelectItem disabled={!hasPickUpDate} value="COMPLETED">
												Completed
											</SelectItem>
										</>
									)}
								</SelectContent>
							</Select>
						</div>
					</div>

					{datePreview && (
						<div className="grid grid-cols-4 items-center gap-4">
							<div className="col-span-1"></div>
							<div className="col-span-3 text-sm text-primary">
								{datePreview}
							</div>
						</div>
					)}

					<div className="grid grid-cols-4 items-center gap-4">
						<div className="col-span-1 text-right font-medium">Order Date:</div>
						<div className="col-span-3">
							{formatOrderDate(Number(order.orderDate))}
						</div>
					</div>

					<div className="grid grid-cols-4 items-center gap-4">
						<div className="col-span-1 text-right font-medium">Processed:</div>
						<div className="col-span-3">
							{order.processedAt
								? formatOrderDate(Number(order.processedAt))
								: "Not processed yet"}
						</div>
					</div>

					{order.typeOfDelivery === "DELIVERY" ? (
						<>
							<div className="grid grid-cols-4 items-center gap-4">
								<div className="col-span-1 text-right font-medium">
									Shipped:
								</div>
								<div className="col-span-3">
									{order.shippedAt
										? formatOrderDate(Number(order.shippedAt))
										: "Not shipped yet"}
								</div>
							</div>
						</>
					) : (
						<>
							<div className="grid grid-cols-4 items-center gap-4">
								<div className="col-span-1 text-right font-medium">
									For pickup:
								</div>
								<div className="col-span-3">
									{order.forPickup
										? order.forPickup.toLocaleString()
										: "Not ready for pickup yet"}
								</div>
							</div>
						</>
					)}

					{order.cancelledAt && (
						<div className="grid grid-cols-4 items-center gap-4">
							<div className="col-span-1 text-right font-medium">
								Cancelled:
							</div>
							<div className="col-span-3">
								{formatOrderDate(Number(order.cancelledAt))}
							</div>
						</div>
					)}

					{order.completedAt && (
						<div className="grid grid-cols-4 items-center gap-4">
							<div className="col-span-1 text-right font-medium">
								Completed:
							</div>
							<div className="col-span-3">
								{formatOrderDate(Number(order.completedAt))}
							</div>
						</div>
					)}
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={onClose}>
						Cancel
					</Button>
					<Button
						onClick={handleSubmit}
						disabled={loading || status === order.status}>
						{loading ? "Updating..." : "Update Status"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default OrderStatusUpdateModal;
