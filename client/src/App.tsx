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
import Account from "./app/account";
import VerifyAccount from "./app/verify-account";
import SetUpAccount from "./app/set-up-account";
import Products from "./app/admin/products";
import AddProduct from "./app/admin/add-product";
import EditProduct from "./app/admin/edit-product";
import ProductInfo from "./app/admin/product-info";
import Chocolates from "./app/user/chocolates";
import Flowers from "./app/user/flowers";
import Gifts from "./app/user/gifts";
import Bouquets from "./app/user/bouquets";
import ProductDetails from "./app/user/product";
import Messages from "./app/admin/messages";
import MessagesMobile from "./app/admin/messages-mobile";
import Conversation from "./app/conversation";

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
					{
						path: "messages",
						element: <Messages />,
						children: [
							{
								index: true,
								element: <MessagesMobile />,
							},
							{
								path: ":userId",
								element: <Conversation />,
							},
						],
					},
					{
						path: "products",
						children: [
							{
								index: true,
								element: <Products />,
							},
							{
								path: "add-product",
								element: <AddProduct />,
							},
							{
								path: "edit/:id",
								element: <EditProduct />,
							},
							{
								path: ":productId/info",
								element: <ProductInfo />,
							},
						],
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
					{
						path: "chocolates",
						children: [
							{
								index: true,
								element: <Chocolates />,
							},
							{
								path: ":productId",
								element: <ProductDetails />,
							},
						],
					},
					{
						path: "flowers",
						children: [
							{
								index: true,
								element: <Flowers />,
							},
							{
								path: ":productId",
								element: <ProductDetails />,
							},
						],
					},
					{
						path: "gifts",
						children: [
							{
								index: true,
								element: <Gifts />,
							},
							{
								path: ":productId",
								element: <ProductDetails />,
							},
						],
					},
					{
						path: "bouquets",
						children: [
							{
								index: true,
								element: <Bouquets />,
							},
							{
								path: ":productId",
								element: <ProductDetails />,
							},
						],
					},
				],
			},
		],
	};

	const sharedRoutes = [
		{
			element: (
				<ProtectedRoute allowedRoles={["USER", "ADMIN", "SUPER_ADMIN"]} />
			),
			children: [
				{
					path: "account",
					element: <Account />,
				},
			],
		},
		{
			path: "verify-account",
			element: <VerifyAccount />,
		},
		{
			path: "set-up-account",
			element: <SetUpAccount />,
		},
	];

	return useRoutes([
		adminRoutes,
		userRoutes,
		authRoutes,
		...publicRoutes,
		...sharedRoutes,
	]);
}
