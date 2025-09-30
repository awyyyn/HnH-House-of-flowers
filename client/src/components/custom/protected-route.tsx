import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "@/contexts";
import { UserRole } from "@/types";
import { Loader } from "./loader";
import { useEffect } from "react";

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, role, loading, user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Function to handle beforeunload event
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      // Save the current path to localStorage or sessionStorage
      localStorage.setItem("lastPath", location.pathname);

      // Optional: Customize the message shown when trying to leave (works in some browsers)
      event.returnValue =
        "Are you sure you want to leave? Your work may not be saved.";
    };

    // Add the event listener
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [location]);

  if (loading) return <Loader />;

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
