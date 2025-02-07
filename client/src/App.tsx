import { Route, Routes } from "react-router-dom";

import { AuthLayout } from "./layouts";

import NotFound from "./app/not-found";
import Unauthorized from "./app/unauthorized";
import Register from "./app/auth/register";
import Login from "./app/auth/login";
import ForgotPassword from "./app/auth/forgot-password";

export default function App() {
	return (
		<Routes>
			<Route element={<AuthLayout />}>
				<Route path="/auth/login" element={<Login />} />
				<Route path="/auth/register" element={<Register />} />
				<Route path="/auth/forgot-password" element={<ForgotPassword />} />
			</Route>

			<Route path="/unauthorize" element={<Unauthorized />} />
			<Route path="/*" element={<NotFound />} />
		</Routes>
	);
}
