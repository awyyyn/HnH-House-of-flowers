import { Navigate, Outlet } from "react-router-dom";
import { HoverBorderGradient, StarsBackground } from "@/components";
import { useAuth, useTheme } from "@/contexts";

export default function AuthLayout() {
	const { theme } = useTheme();
	const { isAuthenticated, role } = useAuth();

	if (isAuthenticated)
		return <Navigate to={role === "USER" ? "/" : "/dashboard"} />;

	return (
		<div className="h-screen w-screen flex dark:bg-zinc-950 justify-center items-center">
			<HoverBorderGradient className="w-full border shadow-md shadow-primary/10 rounded-xl border-primary/30 cursor-default p-5 bg-white dark:bg-zinc-900 sm:min-w-[380px]   max-w-[380px]">
				<Outlet />
			</HoverBorderGradient>
			<StarsBackground isDarkMode={!!(theme === "dark")} />
		</div>
	);
}
