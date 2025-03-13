import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
	Calendar,
	ChevronDown,
	Filter,
	Package,
	Search,
	ShoppingBag,
	Truck,
	X,
} from "lucide-react";
import {
	Button,
	Input,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	Badge,
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
	Separator,
	AlertDialog,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogCancel,
	AlertDialogAction,
} from "@/components";
// import type { OrderStatus } from "./types";
import { formatCurrency } from "@/lib/utils";
import OrderDetailDialog from "./components/order-detail-dialog";
import { useMutation, useQuery } from "@apollo/client";
import { READ_ORDERS_BY_USER_QUERY, UPDATE_ORDER_MUTATION } from "@/queries";
import { Order, OrderStatus } from "@/types";
import { format, formatDate } from "date-fns";
import { OrdersSkeleton } from "./components/order-skeleton";

export default function Orders() {
	const router = useNavigate();
	const [params] = useSearchParams();
	const [searchQuery, setSearchQuery] = useState(params.get("orderId") || "");
	const [statusFilter, setStatusFilter] = useState<string>("all");
	const [sortBy, setSortBy] = useState<string>("newest");
	const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
	const { loading, data } = useQuery<{ orders: Order[] }>(
		READ_ORDERS_BY_USER_QUERY,
		{
			fetchPolicy: "no-cache",
		}
	);
	const [cancelOrder, { loading: updatingOrder }] = useMutation(
		UPDATE_ORDER_MUTATION
	);
	const [orderToCancel, setOrderToCancel] = useState<string | null>(null);

	// Filter orders based on search query and status
	const filteredOrders = useMemo(() => {
		if (!data?.orders) return [];

		return data.orders.filter((order: Order) => {
			const matchesSearch = order.formattedId
				.toLowerCase()
				.includes(searchQuery.toLowerCase());

			const matchesStatus =
				statusFilter === "all" || order.status === statusFilter;

			return matchesSearch && matchesStatus;
		});
	}, [searchQuery, statusFilter, data?.orders]);

	// Sort orders based on selected sort option
	const sortedOrders = useMemo(() => {
		return [...filteredOrders].sort((a, b) => {
			if (sortBy === "newest") {
				return Number(b.orderDate) - Number(a.orderDate); // assuming orderDate is already a timestamp in milliseconds
			} else if (sortBy === "oldest") {
				return Number(a.orderDate) - Number(b.orderDate);
			} else if (sortBy === "price-high") {
				return b.totalPrice - a.totalPrice;
			} else if (sortBy === "price-low") {
				// You may want to handle the 'price-low' case explicitly
				return a.totalPrice - b.totalPrice;
			}
			return 0; // Fallback case if no valid sort criteria is passed
		});
	}, [filteredOrders, sortBy]);

	// Group orders by status for tabs
	const pendingOrders = sortedOrders.filter((order) =>
		["PENDING", "PROCESSING"].includes(order.status)
	);
	const shippedOrders = sortedOrders.filter((order) =>
		["SHIPPED", "READY_FOR_PICKUP"].includes(order.status)
	);
	const completedOrders = sortedOrders.filter(
		(order) => order.status === "COMPLETED"
	);
	const cancelledOrders = sortedOrders.filter(
		(order) => order.status === "CANCELLED"
	);

	const getStatusBadge = (status: OrderStatus) => {
		const statusConfig = {
			PENDING: {
				color: "bg-yellow-100 text-yellow-800",
				icon: <Package className="h-3 w-3 mr-1" />,
			},
			PROCESSING: {
				color: "bg-blue-100 text-blue-800",
				icon: <Package className="h-3 w-3 mr-1" />,
			},
			SHIPPED: {
				color: "bg-indigo-100 text-indigo-800",
				icon: <Truck className="h-3 w-3 mr-1" />,
			},
			COMPLETED: {
				color: "bg-green-100 text-green-800",
				icon: <ShoppingBag className="h-3 w-3 mr-1" />,
			},
			CANCELLED: { color: "bg-red-100 text-red-800", icon: null },
			READY_FOR_PICKUP: {
				color: "bg-purple-100 text-purple-800",
				icon: <Package className="h-3 w-3 mr-1" />,
			},
		};

		const config = statusConfig[status];

		return (
			<Badge
				className={`${config.color} capitalize flex items-center`}
				variant="outline">
				{config.icon}
				{status.split("_").join(" ").toLowerCase()}
			</Badge>
		);
	};

	const handleViewDetails = (orderId: string) => {
		setSelectedOrder(orderId);
	};

	const confirmCancelOrder = async () => {
		try {
			//
			await cancelOrder({
				variables: {
					id: orderToCancel,
					status: "CANCELLED",
				},
				refetchQueries: [READ_ORDERS_BY_USER_QUERY],
			});
		} catch (err) {
			console.log(err);
		}
	};

	const selectedOrderData = selectedOrder
		? filteredOrders.find((order: Order) => order.id === selectedOrder)
		: null;

	if (loading) {
		return <OrdersSkeleton />;
	}

	return (
		<div className="space-y-6 relative pb-8">
			{updatingOrder && (
				<div className="fixed top-0 left-0 w-screen h-screen bg-black/50 z-50 flex items-center justify-center">
					<div className="bg-white p-6 rounded-lg shadow-lg text-center">
						<div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
						<p className="font-medium">Cancelling your order...</p>
					</div>
				</div>
			)}
			<div className="flex flex-col sm:flex-row gap-4 justify-between">
				<div className="relative w-full sm:w-72">
					<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="Search orders..."
						className="pl-8"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
					{searchQuery && (
						<X
							className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground cursor-pointer"
							onClick={() => setSearchQuery("")}
						/>
					)}
				</div>
				<div className="flex gap-2">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" className="flex items-center gap-1">
								<Filter className="h-4 w-4 mr-1" />
								Filter
								<ChevronDown className="h-4 w-4 ml-1" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem onClick={() => setStatusFilter("all")}>
								All Orders
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setStatusFilter("PENDING")}>
								Pending
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setStatusFilter("PROCESSING")}>
								Processing
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setStatusFilter("SHIPPED")}>
								Shipped
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setStatusFilter("COMPLETED")}>
								Delivered
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setStatusFilter("CANCELLED")}>
								Cancelled
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>

					<Select value={sortBy} onValueChange={setSortBy}>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="Sort by" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="newest">Newest First</SelectItem>
							<SelectItem value="oldest">Oldest First</SelectItem>
							<SelectItem value="price-high">Price: High to Low</SelectItem>
							<SelectItem value="price-low">Price: Low to High</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			<Tabs defaultValue="all" className="w-full">
				<TabsList className="grid grid-cols-5 mb-4">
					<TabsTrigger value="all" className="data-[state=active]:text-white">
						All ({sortedOrders.length})
					</TabsTrigger>
					<TabsTrigger
						className="data-[state=active]:text-white"
						value="pending">
						Pending ({pendingOrders.length})
					</TabsTrigger>
					<TabsTrigger
						className="data-[state=active]:text-white"
						value="shipped">
						Shipped ({shippedOrders.length})
					</TabsTrigger>
					<TabsTrigger
						className="data-[state=active]:text-white"
						value="completed">
						Completed ({completedOrders.length})
					</TabsTrigger>
					<TabsTrigger
						className="data-[state=active]:text-white"
						value="cancelled">
						Cancelled ({cancelledOrders.length})
					</TabsTrigger>
				</TabsList>

				<TabsContent value="all" className="space-y-4">
					{renderOrdersList(sortedOrders)}
				</TabsContent>

				<TabsContent value="pending" className="space-y-4">
					{renderOrdersList(pendingOrders)}
				</TabsContent>

				<TabsContent value="shipped" className="space-y-4">
					{renderOrdersList(shippedOrders)}
				</TabsContent>

				<TabsContent value="completed" className="space-y-4">
					{renderOrdersList(completedOrders)}
				</TabsContent>

				<TabsContent value="cancelled" className="space-y-4">
					{renderOrdersList(cancelledOrders)}
				</TabsContent>
			</Tabs>

			{selectedOrderData && (
				<OrderDetailDialog
					showReviewButton={selectedOrderData.status === "COMPLETED"}
					order={selectedOrderData}
					open={!!selectedOrder}
					onClose={() => setSelectedOrder(null)}
				/>
			)}
			<AlertDialog
				open={!!orderToCancel}
				onOpenChange={(open) => !open && setOrderToCancel(null)}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Cancel Order</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to cancel this order? This action cannot be
							undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>No, keep order</AlertDialogCancel>
						<AlertDialogAction
							onClick={confirmCancelOrder}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
							Yes, cancel order
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);

	function renderOrdersList(ordersList: Order[]) {
		if (ordersList.length === 0) {
			return (
				<div className="text-center py-12 border rounded-lg bg-muted/20">
					<ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground" />
					<h3 className="mt-4 text-lg font-medium">No orders found</h3>
					<p className="mt-1 text-sm text-muted-foreground">
						{statusFilter !== "all"
							? "Try changing your filter settings"
							: "You haven't placed any orders yet"}
					</p>
					{statusFilter === "all" && [].length === 0 && (
						<Button className="mt-4" onClick={() => router("/flowers")}>
							Browse Products
						</Button>
					)}
				</div>
			);
		}

		return ordersList.map((order: Order) => (
			<Card key={order.id} className={"overflow-hidden "}>
				<CardHeader className="bg-muted/30 pb-4">
					<div className="flex flex-col sm:flex-row justify-between gap-2">
						<div>
							<CardTitle className="text-base flex items-center gap-2">
								Order {order.formattedId}
								{order.isPreOrder && (
									<Badge variant="outline" className="bg-blue-50 text-blue-700">
										Pre-Order
									</Badge>
								)}
							</CardTitle>
							<CardDescription className="flex items-center gap-2 mt-1">
								<Calendar className="h-3.5 w-3.5" />
								{formatDate(
									new Date(Number(order.orderDate)),
									"MMMM dd, yyyy"
								)}{" "}
								- {format(new Date(Number(order.orderDate)), "hh:mm a")}
							</CardDescription>
						</div>
						<div className="flex items-center gap-2">
							{getStatusBadge(order.status)}
						</div>
					</div>
				</CardHeader>
				<CardContent className="pt-4">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div>
							<p className="text-sm font-medium">Items</p>
							<p className="text-sm text-muted-foreground">
								{order.isPreOrder ? (
									"1 item"
								) : (
									<>
										{order.orderItems.length}{" "}
										{order.orderItems.length === 1 ? "item" : "items"}
									</>
								)}
							</p>
						</div>
						<div>
							<p className="text-sm font-medium">Delivery Method</p>
							<p className="text-sm text-muted-foreground capitalize">
								{order.typeOfDelivery.toLowerCase()}
							</p>
						</div>
						<div>
							<p className="text-sm font-medium">Payment Method</p>
							<p className="text-sm text-muted-foreground capitalize">
								{order.typeOfPayment.toLowerCase()}
							</p>
						</div>
					</div>
				</CardContent>
				<Separator />
				<CardFooter className="flex flex-wrap gap-2 justify-between py-4">
					<div className="font-medium">
						Total: {formatCurrency(order.totalPrice)}
					</div>
					<div className="flex gap-2 flex-wrap">
						{order.status === "PENDING" && (
							<Button
								className="w-full sm:w-fit"
								variant="destructive"
								onClick={() => setOrderToCancel(order.id)}>
								Cancel Order
							</Button>
						)}
						<Button
							className="w-full sm:w-fit"
							variant="outline"
							onClick={() => handleViewDetails(order.id)}>
							View Details
						</Button>
					</div>
				</CardFooter>
			</Card>
		));
	}
}
