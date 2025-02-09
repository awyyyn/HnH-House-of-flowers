import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "@/contexts";
import { UserRole } from "@/types";

interface ProtectedRouteProps {
	allowedRoles: UserRole[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
	const { isAuthenticated, role, loading } = useAuth();

	if (loading) return <div>Loading...</div>;

	if (!isAuthenticated) return <Navigate to="/auth/login" />;

	if (role !== null && !allowedRoles.includes(role)) {
		return <Navigate to="/unauthorized" />;
	}

	return <Outlet />;
}
