export * from "./user.js";
export * from "./customize.js";
export * from "./order.js";

import { SVGProps } from "react";
import { User, UserRole } from "./user.js";
import { JwtPayload } from "jwt-decode";

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
	count: number;
	data: T[];
	hasMore: boolean;
}
export interface AuthContextProps {
	// user: User;
	role: UserRole | null;
	loading: boolean;
	login: (token: string) => void;
	logout: () => void;
	isAuthenticated: boolean;
}

export type JWTDecoded = {
	id: string;
	email: string;
	role: UserRole;
} & JwtPayload;
