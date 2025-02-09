"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Ban, Info, MoreHorizontal } from "lucide-react";
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
import { getUsersQuery } from "@/queries";
import { User } from "@/types";
import DataTable from "./components/table";
import UserInfoModal from "./components/user-info-modal";
import DeleteUserModal from "./components/delete-modal";
import { statusColorMap } from "@/constants";

export default function UsersPage() {
	const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
	const [selectedToDelete, setSelectedToDelete] = React.useState<User | null>(
		null
	);
	const [pagination, setPagination] = React.useState({
		pageIndex: 0, //initial page index
		pageSize: 10, //default page size
	});
	const { data, loading } = useQuery<{
		users: { users: User[]; hasNextPage: boolean; total: number };
	}>(getUsersQuery, {
		variables: {
			role: "USER",
			pagination: {
				page: Number(pagination.pageIndex),
				limit: Number(pagination.pageSize),
			},
		},
	});

	const columns: ColumnDef<User>[] = [
		{
			id: "id",
			header: "#",
			cell: ({ row }) => row.index + 1,
			enableSorting: false,
			enableHiding: false,
		},
		{
			accessorKey: "email",
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() =>
							column.toggleSorting(column.getIsSorted() === "asc")
						}>
						Email
						<ArrowUpDown />
					</Button>
				);
			},
			enableHiding: false,
			cell: ({ row }) => (
				<div className="lowercase">{row.getValue("email")}</div>
			),
		},
		{
			accessorKey: "firstName",
			header: "Name",
			enableHiding: true,
			cell: ({ row }) => {
				const user = row.original;
				return user.lastName ? (
					<p>
						{user.firstName} {user.lastName}
					</p>
				) : (
					<i className="text-gray-400">No data</i>
				);
			},
		},
		{
			accessorKey: "phoneNumber",
			header: "Phone Number",
			enableHiding: true,
			cell: ({ row }) => {
				const user = row.original;
				return user.phoneNumber ?? <i className="text-gray-400">No data</i>;
			},
		},
		{
			accessorKey: "status",
			header: "Status",
			enableHiding: true,
			cell: ({ row }) => {
				const user = row.original;
				return (
					<Badge variant={statusColorMap[user.status]} className="capitalize">
						{user.status === "DELETED" ? "BLOCKED" : user.status}
					</Badge>
				);
			},
		},

		{
			id: "actions",
			enableHiding: false,

			cell: ({ row }) => {
				const user = row.original;
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
								onClick={() => setSelectedUser(user)}
								className="cursor-pointer">
								<Info />
								View Details
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => setSelectedToDelete(user)}
								className="text-destructive cursor-pointer">
								<Ban /> {user.status === "DELETED" ? "Unblock" : "Block"}
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
				<h1 className="text-4xl">List of users</h1>
			</div>
			<DataTable
				loading={loading}
				pagination={pagination}
				setPagination={setPagination}
				columns={columns}
				data={data?.users.users ?? []}
				rowCount={data?.users.total ?? 0}
			/>
			{selectedUser?.id && (
				<UserInfoModal
					user={selectedUser}
					isOpen={!!selectedUser.id}
					onClose={() => setSelectedUser(null)}
				/>
			)}
			{selectedToDelete?.id && (
				<DeleteUserModal
					user={selectedToDelete}
					isOpen={!!selectedToDelete.id}
					unblock={selectedToDelete.status === "DELETED"}
					onClose={() => setSelectedToDelete(null)}
				/>
			)}
		</>
	);
}

// export default function DataTableDemo() {
// 	const [pagination, setPagination] = React.useState({
// 		pageIndex: 0, //initial page index
// 		pageSize: 1, //default page size
// 	});

// 	const { data } = useQuery<{
// 		users: { users: User[]; hasNextPage: boolean; total: number };
// 	}>(getUsersQuery, {
// 		variables: {
// 			role: "USER",
// 			pagination: {
// 				page: Number(pagination.pageIndex),
// 				limit: Number(pagination.pageSize),
// 			},
// 		},
// 	});
// 	const [sorting, setSorting] = React.useState<SortingState>([]);
// 	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
// 		[]
// 	);
// 	const [columnVisibility, setColumnVisibility] =
// 		React.useState<VisibilityState>({});

// 	const table = useReactTable({
// 		data: data?.users.users ?? [],
// 		columns,
// 		onSortingChange: setSorting,
// 		onColumnFiltersChange: setColumnFilters,
// 		getCoreRowModel: getCoreRowModel(),
// 		getPaginationRowModel: getPaginationRowModel(),
// 		getSortedRowModel: getSortedRowModel(),
// 		getFilteredRowModel: getFilteredRowModel(),
// 		onColumnVisibilityChange: setColumnVisibility,
// 		onPaginationChange: setPagination,
// 		manualPagination: true,
// 		rowCount: data?.users.total ?? 0,
// 		state: {
// 			sorting,
// 			columnFilters,
// 			columnVisibility,
// 			pagination,
// 		},
// 	});

// 	return (
// 		<div className="w-full">
// 			<div className="flex items-center py-4">
// 				<Input
// 					placeholder="Filter emails..."
// 					value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
// 					onChange={(event) =>
// 						table.getColumn("email")?.setFilterValue(event.target.value)
// 					}
// 					className="max-w-sm"
// 				/>
// 				<DropdownMenu>
// 					<DropdownMenuTrigger asChild>
// 						<Button variant="outline" className="ml-auto">
// 							Columns <ChevronDown />
// 						</Button>
// 					</DropdownMenuTrigger>
// 					<DropdownMenuContent align="end">
// 						{table
// 							.getAllColumns()
// 							.filter((column) => column.getCanHide())
// 							.map((column) => {
// 								return (
// 									<DropdownMenuCheckboxItem
// 										key={column.id}
// 										className="capitalize"
// 										checked={column.getIsVisible()}
// 										onCheckedChange={(value) =>
// 											column.toggleVisibility(!!value)
// 										}>
// 										{column.id}
// 									</DropdownMenuCheckboxItem>
// 								);
// 							})}
// 					</DropdownMenuContent>
// 				</DropdownMenu>
// 			</div>
// 			<div className="rounded-md border">
// 				<Table>
// 					<TableHeader>
// 						{table.getHeaderGroups().map((headerGroup) => (
// 							<TableRow key={headerGroup.id}>
// 								{headerGroup.headers.map((header) => {
// 									return (
// 										<TableHead key={header.id}>
// 											{header.isPlaceholder
// 												? null
// 												: flexRender(
// 														header.column.columnDef.header,
// 														header.getContext()
// 												  )}
// 										</TableHead>
// 									);
// 								})}
// 							</TableRow>
// 						))}
// 					</TableHeader>
// 					<TableBody>
// 						{table.getRowModel().rows?.length ? (
// 							table.getRowModel().rows.map((row) => (
// 								<TableRow
// 									key={row.id}
// 									data-state={row.getIsSelected() && "selected"}>
// 									{row.getVisibleCells().map((cell) => (
// 										<TableCell key={cell.id}>
// 											{flexRender(
// 												cell.column.columnDef.cell,
// 												cell.getContext()
// 											)}
// 										</TableCell>
// 									))}
// 								</TableRow>
// 							))
// 						) : (
// 							<TableRow>
// 								<TableCell
// 									colSpan={columns.length}
// 									className="h-24 text-center">
// 									No results.
// 								</TableCell>
// 							</TableRow>
// 						)}
// 					</TableBody>
// 				</Table>
// 			</div>
// 			<DataTablePagination
// 				// handleFetchMore={async () => {
// 				// 	setPagination({
// 				// 		...pagination,
// 				// 		pageIndex: pagination.pageIndex + 1,
// 				// 	});
// 				// 	console.log(pagination);
// 				// 	await fetchMore({
// 				// 		variables: {
// 				// 			role: "USER",
// 				// 			pagination: {
// 				// 				page: pagination.pageIndex + 2,
// 				// 				limit: pagination.pageSize,
// 				// 			},
// 				// 		},
// 				// 	});
// 				// }}
// 				// hasMore={!!data?.users.hasNextPage}
// 				table={table}
// 			/>
// 		</div>
// 	);
// }
