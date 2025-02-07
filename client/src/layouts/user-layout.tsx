import { Outlet } from "react-router-dom";
import { Navbar } from "./components/user-navbar";

export default function UserLayout() {
	return (
		<div>
			<Navbar className="" />
			<main className="container px-2 pt-[4.5rem] md:pt-28   w-full mx-auto  ">
				<Outlet />
			</main>
		</div>
	);
}
