import { BrowserRouter, Route, Routes } from "react-router-dom";
import Customize from "./app/user/customize";

export default function App() {
	return (
		<div>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Customize />} />
				</Routes>
			</BrowserRouter>
		</div>
	);
}
