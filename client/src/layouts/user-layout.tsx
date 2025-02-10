import { Outlet } from "react-router-dom";
import { Navbar } from "./components/user-navbar";

export default function UserLayout({
	children,
}: {
	children?: React.ReactNode;
}) {
	return (
		<div>
			<Navbar className="" />
			<main className="container px-2 pt-[4.5rem] md:pt-28   w-full mx-auto  ">
				{children ? children : <Outlet />}
			</main>
		</div>
	);
}
