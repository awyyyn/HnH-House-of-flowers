export * from "./user.js";
export * from "./customize.js";
export * from "./order.js";
export * from "./product.js";
export * from "./bouquet-item.js";
export * from "./notification.js";
export * from "./review.js";

import { Dispatch, SetStateAction, SVGProps } from "react";
import { User, UserRole } from "./user.js";
import { JwtPayload } from "jwt-decode";
import { ColumnDef } from "@tanstack/react-table";
import { OrderStatus } from "./order.js";

export type PaymentMethod = "COD" | "ONLINE_PAYMENT" | "COP";
export type DeliveryMethod = "PICKUP" | "DELIVERY";

export type Revenue = {
	month: string;
	revenue: number;
	year: number;
};

export type ProductSummary = {
	total: number;
	bouquetCount: number;
	chocolateCount: number;
	flowerCount: number;
	giftCount: number;
	bouquetPercentage: number;
	flowerPercentage: number;
	chocolatePercentage: number;
	giftPercentage: number;
};

export type OrderSummary = {
	count: number;
	status: OrderStatus;
	percentage: number;
};

export type BestSellingProduct = {
	id: string;
	images: string[];
	price: number;
	name: string;
	sold: number;
};

export type LastMonth = {
	orders: LastMonthItem;
	revenues: LastMonthItem;
	users: LastMonthItem;
};

export type LastMonthItem = {
	lastMonth: number;
	overAll: number;
	percentage: number;
};

export interface CustomizationValues {
	wrapper: string;

	mainFlower: string;
	additionalFlower: string[];
	tie: string;
	note: string;
	wrapperColor: string;
	tieColor: string;
	paymentMethod: PaymentMethod;
	delivery: DeliveryMethod;
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

export type StoreSettings = {
	readonly id: string;
	storeName: string;
	storeEmail: string;
	storePhone: string;
	storeAddress: string;
	storeDescription: string;
	deliveryFee: number;
	policies: Policies;
	socialMedia: SocialMedia;

	createdAt: string;
	updatedAt: string;
};

export type Policies = {
	privacyPolicy: string;
	termsOfService: string;
	returnPolicy: string;
	shippingPolicy: string;
};

export type SocialMedia = {
	facebook: string;
	instagram: string;
};
