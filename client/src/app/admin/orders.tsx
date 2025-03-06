import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Copy, Edit, Info, MoreHorizontal } from "lucide-react";
import {
	Badge,
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
	Helmet,
} from "@/components";
import { useQuery } from "@apollo/client";
import { READ_ORDERS_QUERY } from "@/queries";
import { Order } from "@/types";
import DataTable from "./components/table";
import { productStatusColorMap } from "@/constants";
import { formatCurrency } from "@/lib";
import OrderDetailDialog from "../user/components/order-detail-dialog";
import { useToast } from "@/hooks/use-toast";
import OrderStatusUpdateModal from "./components/update-order-modal";

export default function Orders() {
	const [pagination, setPagination] = React.useState({
		pageIndex: 0, //initial page index
		pageSize: 10, //default page size
	});

	const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);
	const [editOrder, setEditOrder] = React.useState<Order | null>(null);
	const { toast } = useToast();
	const [isFetching, setIsFetching] = React.useState(false);

	const { data, loading, refetch } = useQuery<{
		orders: { data: Order[]; hasNextPage: boolean; total: number };
	}>(READ_ORDERS_QUERY, {
		variables: {
			pagination: {
				page: Number(pagination.pageIndex),
				limit: Number(pagination.pageSize),
			},
		},
	});

	const handleCopy = (id: string) => {
		navigator.clipboard.writeText(id);
		toast({
			variant: "success",
			title: "Copied",
			description: "Order ID copied to clipboard",
		});
	};

	const columns: ColumnDef<Order>[] = [
		{
			accessorKey: "formattedId",
			header: "Formatted ID",
			enableHiding: false,
			cell: ({ row }) => (
				<div className=" group flex gap-1 items-center">
					<p>{row.original.formattedId}</p>
					<Copy
						onClick={() => handleCopy(row.original.formattedId)}
						className="cursor-pointer stroke-gray-400 hover:stroke-gray-800 dark:stroke-gray-300 hover:dark:stroke-white invisible group-hover:visible h-4 w-4"
					/>
				</div>
			),
		},
		{
			accessorKey: "totalPrice",
			header: "Total Price",
			enableHiding: true,

			cell: ({ row }) => {
				return formatCurrency(row.original.totalPrice);
			},
		},
		{
			accessorKey: "status",
			header: "Status",
			enableHiding: true,
			cell: ({ row }) => {
				return (
					<Badge
						variant={productStatusColorMap[row.original.status]}
						className="capitalize">
						{row.original.status}
					</Badge>
				);
			},
		},
		{
			accessorKey: "typeOfDelivery",
			header: "Delivery Method",
			enableHiding: true,
			cell: ({ row }) => {
				return (
					<p className="capitalize">
						{row.original.typeOfDelivery.toLowerCase()}
					</p>
				);
			},
		},
		{
			accessorKey: "typeOfPayment",
			header: "Payment Method",
			enableHiding: true,
			cell: ({ row }) => {
				return (
					<p className="capitalize">
						{row.original.typeOfPayment.toLowerCase()}
					</p>
				);
			},
		},
		{
			id: "actions",
			enableHiding: false,

			cell: ({ row }) => {
				return (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="h-8 w-8 p-0">
								<span className="sr-only">Open menu</span>
								<MoreHorizontal />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>Actions</DropdownMenuLabel>
							<DropdownMenuItem
								onClick={() => {
									setSelectedOrder(row.original);
								}}
								className="cursor-pointer">
								<Info />
								View Details
							</DropdownMenuItem>
							{row.original.status !== "COMPLETED" && (
								<DropdownMenuItem
									onClick={() => {
										setEditOrder(row.original);
									}}
									className="cursor-pointer">
									<Edit />
									Edit Product
								</DropdownMenuItem>
							)}
						</DropdownMenuContent>
					</DropdownMenu>
				);
			},
		},
	];

	return (
		<>
			<Helmet title="Orders" />
			<div className="flex justify-between items-center py-2">
				<h1 className="text-4xl">List of products</h1>
			</div>
			<DataTable
				loading={loading || isFetching}
				handleRefresh={() => {
					setIsFetching(true);
					refetch().finally(() => setIsFetching(false));
				}}
				pagination={pagination}
				filterName="formattedId"
				setPagination={setPagination}
				columns={columns}
				data={data?.orders.data ?? []}
				rowCount={data?.orders.total ?? 0}
			/>
			{selectedOrder && (
				<OrderDetailDialog
					showCustomer
					order={selectedOrder}
					open={!!selectedOrder}
					onClose={() => setSelectedOrder(null)}
				/>
			)}
			{editOrder && (
				<OrderStatusUpdateModal
					isOpen={true}
					onClose={() => setEditOrder(null)}
					order={editOrder}
				/>
			)}
		</>
	);
}
