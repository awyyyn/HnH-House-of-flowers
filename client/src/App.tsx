import { useRoutes } from "react-router-dom";
import { AdminLayout, AuthLayout, UserLayout } from "./layouts";
import NotFound from "./app/not-found";
import Unauthorized from "./app/unauthorized";
import Register from "./app/auth/register";
import Login from "./app/auth/login";
import ForgotPassword from "./app/auth/forgot-password";
import Customize from "./app/user/customize";
import Home from "./app/home";
import Dashboard from "./app/admin/dashboard";
import UsersPage from "./app/admin/users";
import AdminsPage from "./app/admin/admins";
import Orders from "./app/admin/orders";
import PreOrders from "./app/admin/pre-orders";
import AddAdmin from "./app/admin/add-admin";
import ProtectedRoute from "./components/custom/protected-route";

export default function App() {
	const publicRoutes = [
		{
			path: "/",
			element: <UserLayout />,
			children: [{ index: true, element: <Home /> }],
		},
		{
			path: "unauthorized",
			element: <Unauthorized />,
		},
		{
			path: "*",
			element: <NotFound />,
		},
	];

	const adminRoutes = {
		element: <AdminLayout />,

		children: [
			{
				element: <ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]} />,
				children: [
					{
						element: <Dashboard />,
						path: "dashboard",
					},
					{
						path: "users",
						element: <UsersPage />,
					},
					{
						path: "orders",
						element: <Orders />,
					},
					{
						path: "pre-orders",
						element: <PreOrders />,
					},
				],
			},
			{
				element: <ProtectedRoute allowedRoles={["SUPER_ADMIN"]} />,
				children: [
					{
						path: "admins",
						children: [
							{
								index: true,
								element: <AdminsPage />,
							},
							{
								path: "add-admin",
								element: <AddAdmin />,
							},
						],
					},
				],
			},
		],
	};

	const authRoutes = {
		path: "auth",
		element: <AuthLayout />,
		children: [
			{
				index: true,
				path: "login",
				element: <Login />,
			},
			{
				path: "register",
				element: <Register />,
			},
			{
				path: "forgot-password",
				element: <ForgotPassword />,
			},
		],
	};

	const userRoutes = {
		element: <UserLayout />,
		children: [
			{
				element: <ProtectedRoute allowedRoles={["USER"]} />,
				children: [
					{
						path: "customize",
						element: <Customize />,
					},
				],
			},
		],
	};

	return useRoutes([adminRoutes, userRoutes, authRoutes, ...publicRoutes]);
}
