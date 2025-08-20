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
  Helmet,
} from "@/components";
import { useQuery } from "@apollo/client";
import { READ_COMPONENTS_QUERY } from "@/queries";
import DataTable from "./components/table";
import { Component } from "@/types";
import { ComponentDetailsModal } from "./components/component-modal";
import { useNavigate } from "react-router-dom";

export default function ComponentsPage() {
  const [pagination, setPagination] = React.useState({
    pageIndex: 0, //initial page index
    pageSize: 10, //default page size
  });
  const [item, setItem] = React.useState<{
    editing?: boolean;
    component: Component | null;
    isOpen: boolean;
  }>({
    editing: false,
    isOpen: false,
    component: null,
  });
  const navigate = useNavigate();
  const { data, loading, refetch } = useQuery<{
    components: { data: Component[]; hasNextPage: boolean; total: number };
  }>(READ_COMPONENTS_QUERY, {
    variables: {
      pagination: {
        page: Number(pagination.pageIndex),
        limit: Number(pagination.pageSize),
      },
    },
  });

  const columns: ColumnDef<Component>[] = [
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
        }).format(row.original.price ? row.original.price : 0);
        // return user.phoneNumber ?? <i className="text-gray-400">No data</i>;
      },
    },
    {
      accessorKey: "isAvailable",
      header: "Status",
      enableHiding: true,
      cell: ({ row }) => {
        return (
          <Badge
            variant={row.original.isAvailable ? "default" : "destructive"}
            className="capitalize"
          >
            {row.original.isAvailable ? "Available" : "Not Available"}
          </Badge>
        );
      },
    },
    // {
    // 	accessorKey: "category",
    // 	header: "Category",
    // 	enableHiding: true,
    // 	cell: ({ row }) => {
    // 		return (
    // 			<p className="capitalize">
    // 				{row.original.category[0]}
    // 				{row.original.category.slice(1).toLocaleLowerCase()}
    // 			</p>
    // 		);
    // 	},
    // },
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
                  setItem({
                    component: row.original,
                    isOpen: true,
                    editing: false,
                  });
                }}
                className="cursor-pointer"
              >
                <Info />
                View
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => navigate(`/components/${row.original.id}/edit`)}
                className="cursor-pointer"
              >
                <Edit />
                Edit
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <>
      <Helmet title="Bouquet Item" />
      <div className="flex justify-between items-center py-2">
        <h1 className="text-4xl">List of components</h1>
      </div>
      <DataTable
        loading={loading}
        handleRefresh={refetch}
        pagination={pagination}
        setPagination={setPagination}
        columns={columns}
        data={data?.components.data ?? []}
        rowCount={data?.components.total ?? 0}
      />
      {item.component && item.isOpen && (
        <ComponentDetailsModal
          isOpen={item.isOpen}
          component={item.component}
          handleClose={() => {
            setItem({ ...item, isOpen: false, component: null });
          }}
        />
      )}
    </>
  );
}
