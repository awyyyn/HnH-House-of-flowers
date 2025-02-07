import { Button } from "@/components";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { IconNoteOff } from "@tabler/icons-react";

export default function NotFound() {
	const { isAuthenticated, role } = useAuth();

	const buttonLabel = isAuthenticated
		? role === "USER"
			? "Home"
			: "Dashboard"
		: "Login";

	const link = isAuthenticated
		? role === "USER"
			? "/"
			: "/dashboard"
		: "/auth/login";

	return (
		<div className="min-h-dvh w-screen h-screen flex justify-center items-center">
			<div className="flex flex-col space-y-10 max-w-[90%] items-center">
				<div className="text-center space-y-5">
					<IconNoteOff className="h-52 w-64 mx-auto" />
					<h1 className="text-primary text-5xl">404</h1>
					<h1 className="text-2xl">Page not found!</h1>
					<h3>Sorry we were unable to find that page</h3>
				</div>

				<Button asChild>
					<Link to={link}>Go to {buttonLabel}</Link>
				</Button>
			</div>
		</div>
	);
}
