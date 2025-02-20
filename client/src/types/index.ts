export * from "./user.js";
export * from "./customize.js";
export * from "./order.js";
export * from "./product.js";

import { Dispatch, SetStateAction, SVGProps } from "react";
import { User, UserRole } from "./user.js";
import { JwtPayload } from "jwt-decode";
import { ColumnDef } from "@tanstack/react-table";

export interface CustomizationValues {
	wrapper: string;
	color: string;
	mainFlower: string;
	additionalFlower: string;
	tie: string;
}

export type IconSvgProps = SVGProps<SVGSVGElement> & {
	size?: number;
};

export interface PaginationResult<T> {
	total: number;
	data: T[];
	hasNextPage: boolean;
}
export interface AuthContextProps {
	user: User;
	role: UserRole | null;
	loading: boolean;
	login: (token: string, loggedInUser: User) => void;
	logout: () => void;
	isAuthenticated: boolean;
	setUser: Dispatch<SetStateAction<User>>;
	setValues: Dispatch<
		SetStateAction<{
			isAuthenticated: boolean;
			role: UserRole | null;
		}>
	>;
}

export type JWTDecoded = {
	id: string;
	email: string;
	role: UserRole;
} & JwtPayload;

type DataTablePagination = {
	pageIndex: number;
	pageSize: number;
};

export interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	rowCount: number;
	loading?: boolean;
	handleRefresh?: VoidFunction;
	filterName?: string;
	pagination: DataTablePagination;
	setPagination: Dispatch<SetStateAction<DataTablePagination>>;
}
