import { useRoutes } from "react-router-dom";
import { AdminLayout, AuthLayout, UserLayout } from "./layouts";

import NotFound from "./app/not-found";
import Unauthorized from "./app/unauthorized";
import Register from "./app/auth/register";
import Login from "./app/auth/login";
import ForgotPassword from "./app/auth/forgot-password";
import Home from "./app/home";
import ProtectedRoute from "./components/custom/protected-route";
import Account from "./app/account";
import VerifyAccount from "./app/verify-account";
import SetUpAccount from "./app/set-up-account";
import MessagesMobile from "./app/admin/messages-mobile";
import CheckoutSuccess from "./app/user/checkout-success";
import CheckoutError from "./app/user/checkout-error";
import Notification from "./app/notification";

import loadable from "@loadable/component";
import {
	DashboardSkeleton,
	MessagingSkeletonLayoutLoading,
	ConversationSkeletonLoading,
	UsersSkeleton,
	AddAdminSkeleton,
	SystemSettingsSkeleton,
	AddOrderSkeleton,
	AdminOrdersSkeleton,
	BouquetItemsSkeleton,
	AddBouquetItemSkeleton,
	AddProductSkeleton,
	ProductInfoSkeleton,
	CardSkeleton,
	CartSkeleton,
	UserOrdersSkeleton,
	ReviewSkeleton,
	CustomizeSkeleton,
	CheckoutSkeleton,
} from "./app/skeletons";

const Dashboard = loadable(() => import("./app/admin/dashboard"));
const UsersPage = loadable(() => import("./app/admin/users"));
const Settings = loadable(() => import("./app/admin/settings"));
const Messages = loadable(() => import("./app/admin/messages"));
const Conversation = loadable(() => import("./app/admin/conversation"));
const AddAdmin = loadable(() => import("./app/admin/add-admin"));
const AddOrder = loadable(() => import("./app/admin/add-order"));
const Orders = loadable(() => import("./app/admin/orders"));
const PreOrders = loadable(() => import("./app/admin/pre-orders"));
const BouquetItems = loadable(() => import("./app/admin/bouquet-items"));
const AddBouquetItem = loadable(() => import("./app/admin/add-bouquet-item"));
const Products = loadable(() => import("./app/admin/products"));
const AdminsPage = loadable(() => import("./app/admin/admins"));
const AddProduct = loadable(() => import("./app/admin/add-product"));
const EditProduct = loadable(() => import("./app/admin/edit-product"));
const ProductInfo = loadable(() => import("./app/admin/product-info"));
const Chat = loadable(() => import("./app/user/chat"));
const Chocolates = loadable(() => import("./app/user/chocolates"));
const ProductDetails = loadable(() => import("./app/user/product"));
const Flowers = loadable(() => import("./app/user/flowers"));
const Gifts = loadable(() => import("./app/user/gifts"));
const Bouquets = loadable(() => import("./app/user/bouquets"));
const CartPage = loadable(() => import("./app/user/cart"));
const UserOrders = loadable(() => import("./app/user/orders"));
const ReviewPage = loadable(() => import("./app/user/review"));
const Customize = loadable(() => import("./app/user/customize"));
const CheckoutPage = loadable(() => import("./app/user/checkout"));

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
								element: <AddOrder fallback={<AddOrderSkeleton />} />,
							},
							{
								index: true,
								element: <Orders fallback={<AdminOrdersSkeleton />} />,
							},
							{
								path: "pre-orders",
								element: <PreOrders fallback={<AdminOrdersSkeleton />} />,
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
								element: <BouquetItems fallback={<BouquetItemsSkeleton />} />,
							},
							{
								path: "add-item",
								element: (
									<AddBouquetItem fallback={<AddBouquetItemSkeleton />} />
								),
							},
						],
					},
					{
						path: "products",
						children: [
							{
								index: true,
								element: <Products fallback={<AdminOrdersSkeleton />} />,
							},
							{
								path: "add-product",
								element: <AddProduct fallback={<AddProductSkeleton />} />,
							},
							{
								path: "edit/:id",
								element: <EditProduct fallback={<AddProductSkeleton />} />,
							},
							{
								path: ":productId/info",
								element: <ProductInfo fallback={<ProductInfoSkeleton />} />,
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
								element: <AdminsPage fallback={<AdminOrdersSkeleton />} />,
							},
							{
								path: "add-admin",
								element: <AddAdmin fallback={<AddAdminSkeleton />} />,
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
						element: <Customize fallback={<CustomizeSkeleton />} />,
					},
					{
						path: "add-review/:id",
						element: <ReviewPage fallback={<ReviewSkeleton />} />,
					},
					{
						path: "my-orders",
						element: <UserOrders fallback={<UserOrdersSkeleton />} />,
					},
					{
						path: "checkout",
						children: [
							{
								index: true,
								element: <CheckoutPage fallback={<CheckoutSkeleton />} />,
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
						element: <Chat fallback={<ConversationSkeletonLoading />} />,
					},
					{
						path: "chocolates",
						children: [
							{
								index: true,
								element: <Chocolates fallback={<CardSkeleton />} />,
							},
							{
								path: ":productId",
								element: <ProductDetails fallback={<ProductInfoSkeleton />} />,
							},
						],
					},
					{
						path: "flowers",
						children: [
							{
								index: true,
								element: <Flowers fallback={<CardSkeleton />} />,
							},
							{
								path: ":productId",
								element: <ProductDetails fallback={<ProductInfoSkeleton />} />,
							},
						],
					},
					{
						path: "gifts",
						children: [
							{
								index: true,
								element: <Gifts fallback={<CardSkeleton />} />,
							},
							{
								path: ":productId",
								element: <ProductDetails fallback={<ProductInfoSkeleton />} />,
							},
						],
					},
					{
						path: "bouquets",
						children: [
							{
								index: true,
								element: <Bouquets fallback={<CardSkeleton />} />,
							},
							{
								path: ":productId",
								element: <ProductDetails fallback={<ProductInfoSkeleton />} />,
							},
						],
					},
					{
						path: "cart",
						element: <CartPage fallback={<CartSkeleton />} />,
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
