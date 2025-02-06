import { Outlet } from "react-router-dom";
import { Navbar } from "./components/user-navbar";

export default function UserLayout() {
	return (
		<div>
			<Navbar className="" />
			<main className="container pt-20 md:pt-28   w-full mx-auto  ">
				<Outlet />
			</main>
		</div>
	);
}
