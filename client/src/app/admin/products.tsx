"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Info, MoreHorizontal } from "lucide-react";
import {
	Badge,
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components";
import { useQuery } from "@apollo/client";
import { GET_PRODUCTS_QUERY } from "@/queries";
import { Product } from "@/types";
import DataTable from "./components/table";
import { productStatusColorMap } from "@/constants";
import { useNavigate } from "react-router-dom";

export default function ProductsPage() {
	const navigate = useNavigate();
	const [pagination, setPagination] = React.useState({
		pageIndex: 0, //initial page index
		pageSize: 10, //default page size
	});

	const { data, loading, refetch } = useQuery<{
		products: { data: Product[]; hasNextPage: boolean; total: number };
	}>(GET_PRODUCTS_QUERY, {
		variables: {
			pagination: {
				page: Number(pagination.pageIndex),
				limit: Number(pagination.pageSize),
			},
		},
	});

	const columns: ColumnDef<Product>[] = [
		{
			id: "id",
			header: "#",
			cell: ({ row }) => row.index + 1,
			enableSorting: false,
			enableHiding: false,
		},
		{
			accessorKey: "name",
			header: "Name",
			enableHiding: true,
			cell: ({ row }) => row.original.name,
		},
		{
			accessorKey: "price",
			header: "Price",
			enableHiding: true,
			cell: ({ row }) => {
				return Intl.NumberFormat("en-PH", {
					style: "currency",
					currency: "PHP",
				}).format(row.original.price);
				// return user.phoneNumber ?? <i className="text-gray-400">No data</i>;
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
			accessorKey: "category",
			header: "Category",
			enableHiding: true,
			cell: ({ row }) => {
				return (
					<p className="capitalize">
						{row.original.category[0]}
						{row.original.category.slice(1).toLocaleLowerCase()}
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
									navigate(`/products/${row.original.id}/info`, {
										state: { product: row.original },
									});
								}}
								className="cursor-pointer">
								<Info />
								View Details
							</DropdownMenuItem>

							<DropdownMenuItem
								onClick={() =>
									navigate("/products/edit/" + row.original.id, {
										state: { product: row.original },
									})
								}
								className="cursor-pointer">
								<Edit />
								Edit Product
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				);
			},
		},
	];

	return (
		<>
			<div className="flex justify-between items-center py-2">
				<h1 className="text-4xl">List of admins</h1>
			</div>
			<DataTable
				loading={loading}
				handleRefresh={refetch}
				pagination={pagination}
				setPagination={setPagination}
				columns={columns}
				data={data?.products.data ?? []}
				rowCount={data?.products.total ?? 0}
			/>
		</>
	);
}
