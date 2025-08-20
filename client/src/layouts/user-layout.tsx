import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Navbar } from "./components/user-navbar";
import { useAuth } from "@/contexts";
import { useEffect } from "react";
import { useLocalPathname } from "@/hooks/use-local-pathname";

export default function UserLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const localPathname = useLocalPathname();

  useEffect(() => {
    if (localPathname && localPathname !== pathname) {
      navigate(localPathname, {
        replace: true,
      });
    }
  }, []);

  if (user !== null && (user.status === "UNVERIFIED" || !user.verifiedAt)) {
    return <Navigate to="/verify-account" />;
  }

  if (user !== null && user.phoneNumber === null) {
    return <Navigate to="/set-up-account" />;
  }

  return (
    <div className="dark:bg-zinc-900 min-h-screen">
      <Navbar className="" />
      <main className="container px-2 pt-[4.5rem] md:pt-28   w-full mx-auto  ">
        {children ? children : <Outlet />}
      </main>
    </div>
  );
}
