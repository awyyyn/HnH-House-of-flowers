import { useRoutes } from "react-router-dom";
import { AdminLayout, AuthLayout, UserLayout } from "./layouts";
import NotFound from "./app/not-found";
import Unauthorized from "./app/unauthorized";
import Register from "./app/auth/register";
import Login from "./app/auth/login";
import ForgotPassword from "./app/auth/forgot-password";
import Customize from "./app/user/customize";
import Home from "./app/home";

import AdminsPage from "./app/admin/admins";
import Orders from "./app/admin/orders";
import PreOrders from "./app/admin/pre-orders";
import UserOrders from "./app/user/orders";
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

import MessagesMobile from "./app/admin/messages-mobile";

import Chat from "./app/user/chat";
import CartPage from "./app/user/cart";
import BouquetsItems from "./app/admin/bouquet-items";
import AddBouquetItem from "./app/admin/add-bouquet-item";
import CheckoutPage from "./app/user/checkout";
import CheckoutSuccess from "./app/user/checkout-success";
import CheckoutError from "./app/user/checkout-error";
import AddOrder from "./app/admin/add-order";
import Notification from "./app/notification";
import ReviewPage from "./app/user/review";

import loadable from "@loadable/component";
import {
	DashboardSkeleton,
	MessagingSkeletonLayoutLoading,
	ConversationSkeletonLoading,
	UsersSkeleton,
} from "./app/skeletons";
import SystemSettingsSkeleton from "./app/skeletons/settings-skeleton";

const Dashboard = loadable(() => import("./app/admin/dashboard"));
const UsersPage = loadable(() => import("./app/admin/users"));
const Settings = loadable(() => import("./app/admin/settings"));
const Messages = loadable(() => import("./app/admin/messages"));
const Conversation = loadable(() => import("./app/admin/conversation"));

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
						element: <Dashboard fallback={<DashboardSkeleton />} />,
						path: "dashboard",
					},
					{
						element: <Settings fallback={<SystemSettingsSkeleton />} />,
						path: "settings",
					},
					{
						path: "users",
						element: <UsersPage fallback={<UsersSkeleton />} />,
					},
					{
						path: "orders",
						children: [
							{
								path: "add",
								element: <AddOrder />,
							},
							{
								index: true,
								element: <Orders />,
							},
							{
								path: "pre-orders",
								element: <PreOrders />,
							},
						],
					},
					{
						path: "messages",
						element: <Messages fallback={<MessagingSkeletonLayoutLoading />} />,
						children: [
							{
								index: true,
								element: <MessagesMobile />,
							},
							{
								path: ":userId",
								element: (
									<Conversation fallback={<ConversationSkeletonLoading />} />
								),
							},
						],
					},
					{
						path: "bouquet-items",
						children: [
							{
								index: true,
								element: <BouquetsItems />,
							},
							{
								path: "add-item",
								element: <AddBouquetItem />,
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
						path: "add-review/:id",
						element: <ReviewPage />,
					},
					{
						path: "my-orders",
						element: <UserOrders />,
					},
					{
						path: "checkout",
						children: [
							{
								index: true,
								element: <CheckoutPage />,
							},
							{
								path: "success",
								element: <CheckoutSuccess />,
							},
							{
								path: "error",
								element: <CheckoutError />,
							},
						],
					},
					{
						path: "chat",
						element: <Chat />,
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
					{
						path: "cart",
						element: <CartPage />,
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
				{
					path: "notifications",
					element: <Notification />,
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
