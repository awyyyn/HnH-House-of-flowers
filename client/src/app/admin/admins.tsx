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
	const [selectedAdmin, setSelectedAdmin] = React.useState<User | null>(null);
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
			role: "ADMIN",
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
						{user.status === "DELETED" ? "BANNED" : user.status}
					</Badge>
				);
			},
		},

		{
			id: "actions",
			enableHiding: false,

			cell: ({ row }) => {
				const admin = row.original;

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
								onClick={() => setSelectedAdmin(admin)}
								className="cursor-pointer">
								<Info />
								View Details
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => setSelectedToDelete(admin)}
								className="text-destructive cursor-pointer dark:text-white">
								<Ban /> {admin.status === "DELETED" ? "Unban" : "Ban"}
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
				pagination={pagination}
				setPagination={setPagination}
				columns={columns}
				data={data?.users.users ?? []}
				rowCount={data?.users.total ?? 0}
			/>
			{selectedAdmin?.id && (
				<UserInfoModal
					isAdmin
					user={selectedAdmin}
					isOpen={!!selectedAdmin.id}
					onClose={() => setSelectedAdmin(null)}
				/>
			)}
			{selectedToDelete?.id && (
				<DeleteUserModal
					isAdmin
					user={selectedToDelete}
					isOpen={!!selectedToDelete.id}
					unblock={selectedToDelete.status === "DELETED"}
					onClose={() => setSelectedToDelete(null)}
				/>
			)}
		</>
	);
}
