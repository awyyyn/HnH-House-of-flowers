import { Route, Routes } from "react-router-dom";
import Home from "./app/home";
import { UserLayout } from "./layouts";

export default function App() {
	return (
		<Routes>
			<Route element={<UserLayout />}>
				<Route path="/" element={<Home />} />
			</Route>
		</Routes>
	);
}
