import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "@/contexts";
import { UserRole } from "@/types";

interface ProtectedRouteProps {
	allowedRoles: UserRole[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
	const { isAuthenticated, role, loading, user } = useAuth();

	if (loading) return <div>Loading...</div>;

	if (!isAuthenticated) return <Navigate to="/auth/login" />;

	if (role !== null && !allowedRoles.includes(role)) {
		return <Navigate to="/unauthorized" />;
	}

	if (role !== null && (user.status === "UNVERIFIED" || !user.verifiedAt)) {
		return <Navigate to="/verify-account" />;
	}

	if (role !== null && (user.phoneNumber === null || !user.phoneNumber)) {
		return <Navigate to="/set-up-account" />;
	}

	return <Outlet />;
}
