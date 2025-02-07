import { Route, Routes } from "react-router-dom";
import Home from "./app/home";
import { AdminLayout } from "./layouts";

export default function App() {
	return (
		<Routes>
			<Route element={<AdminLayout />}>
				<Route path="/" element={<Home />} />
			</Route>
		</Routes>
	);
}
