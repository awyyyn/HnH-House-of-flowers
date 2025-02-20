import { Button } from "@/components";
// import { Link } from "@heroui/link";

import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { IconBarrierBlock } from "@tabler/icons-react";
import { Helmet } from "@/components";

export default function Unauthorized() {
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
		<>
			<Helmet title="UnAuthorized" />
			<div className="min-h-dvh w-screen h-screen flex justify-center items-center">
				<div className="flex flex-col space-y-10 max-w-[90%] items-center">
					<div className="text-center space-y-5">
						<IconBarrierBlock className="h-52 w-64 mx-auto" />
						<h1 className="text-primary text-5xl">403</h1>
						<h1 className="text-2xl">Unauthorized</h1>
						<h3>
							Accessing the page or resource you were trying to reach is
							forbidden.
						</h3>
					</div>

					<Button asChild>
						<Link to={link}>Go to {buttonLabel}</Link>
					</Button>
				</div>
			</div>
		</>
	);
}
