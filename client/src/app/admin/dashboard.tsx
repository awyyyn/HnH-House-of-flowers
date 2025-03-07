import {
	Badge,
	Button,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Helmet,
	Progress,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/components";

import {
	BarChart3,
	CreditCard,
	Flower,
	Package,
	ShoppingCart,
	Users,
} from "lucide-react";
import { useState } from "react";
import { RevenueChart } from "./components/revenue-chart";
import { useQuery } from "@apollo/client";
import { DASHBOARD_QUERY } from "@/queries";
import { LastMonth, Revenue } from "@/types";
import { Link } from "react-router-dom";
import { formatCurrency } from "@/lib";

export default function Dashboard() {
	const [activeTab, setActiveTab] = useState("overview");
	const { loading, data } = useQuery<{
		revenues: Revenue[];
		lastMonthData: LastMonth;
	}>(DASHBOARD_QUERY, {
		variables: {
			// year: 2025,
		},
	});

	console.log(data, "qqq");

	if (loading) return <div>Loading...</div>;

	return (
		<div className="space-y-4">
			<Helmet title="Dashboard" />
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-semibold">Dashboard</h1>
				<Button asChild variant="default">
					<Link to="/products/add-product">
						<Package className="h-4 w-4 mr-2" />
						Add New Product
					</Link>
				</Button>
			</div>
			<Tabs
				value={activeTab}
				onValueChange={setActiveTab}
				className="space-y-4">
				<TabsList>
					<TabsTrigger
						value="overview"
						className="data-[state=active]:text-white">
						Overview
					</TabsTrigger>
					<TabsTrigger
						value="products"
						className="data-[state=active]:text-white">
						Products
					</TabsTrigger>
					<TabsTrigger
						value="recent"
						className="data-[state=active]:text-white">
						Recent Orders
					</TabsTrigger>
				</TabsList>
				<TabsContent value="overview" className="space-y-4">
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">
									Total Revenue
								</CardTitle>
								<CreditCard className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">
									{formatCurrency(data?.lastMonthData.revenues.lastMonth || 0)}
								</div>
								<p className="text-xs text-muted-foreground">
									+{data?.lastMonthData.revenues.percentage}% from last month
								</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">Orders</CardTitle>
								<ShoppingCart className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">
									{data?.lastMonthData.orders.lastMonth}
								</div>
								<p className="text-xs text-muted-foreground">
									+{data?.lastMonthData.orders.percentage}% from last month
								</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">
									New Customers
								</CardTitle>
								<Users className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">
									+{data?.lastMonthData.users.lastMonth}
								</div>
								<p className="text-xs text-muted-foreground">
									+{data?.lastMonthData.users.percentage.toFixed(2)}% from last
									month
								</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">
									Conversion Rate
								</CardTitle>
								<BarChart3 className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">3.6%</div>
								<p className="text-xs text-muted-foreground">
									+2.1% from last month
								</p>
							</CardContent>
						</Card>
					</div>
					<div className="grid gap-4 grid-cols-1 md:grid-cols-7">
						<div className="md:col-span-4">
							<RevenueChart chartData={data?.revenues || []} />
						</div>
						<Card className="md:col-span-3">
							<CardHeader>
								<CardTitle>Best Selling Products</CardTitle>
								<CardDescription>
									Top selling products this month.
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									<div className="flex items-center gap-4">
										<div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center">
											<Flower className="h-6 w-6 text-primary" />
										</div>
										<div className="flex-1 space-y-1">
											<p className="text-sm font-medium leading-none">
												Rose Bouquet
											</p>
											<p className="text-sm text-muted-foreground">128 sold</p>
										</div>
										<div className="font-medium">$64.99</div>
									</div>
									<div className="flex items-center gap-4">
										<div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center">
											<Flower className="h-6 w-6 text-primary" />
										</div>
										<div className="flex-1 space-y-1">
											<p className="text-sm font-medium leading-none">
												Spring Mix
											</p>
											<p className="text-sm text-muted-foreground">96 sold</p>
										</div>
										<div className="font-medium">$49.99</div>
									</div>
									<div className="flex items-center gap-4">
										<div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center">
											<Flower className="h-6 w-6 text-primary" />
										</div>
										<div className="flex-1 space-y-1">
											<p className="text-sm font-medium leading-none">
												Tulip Arrangement
											</p>
											<p className="text-sm text-muted-foreground">64 sold</p>
										</div>
										<div className="font-medium">$39.99</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</TabsContent>
				<TabsContent value="products" className="space-y-4">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between">
							<div>
								<CardTitle>Product Inventory</CardTitle>
								<CardDescription>
									Manage your flower shop inventory
								</CardDescription>
							</div>
							<Button size="sm">
								<Package className="h-4 w-4 mr-2" />
								Add Product
							</Button>
						</CardHeader>
						<CardContent>
							<div className="rounded-md border">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead className="w-[80px]">Image</TableHead>
											<TableHead>Name</TableHead>
											<TableHead>Category</TableHead>
											<TableHead>Price</TableHead>
											<TableHead>Stock</TableHead>
											<TableHead>Status</TableHead>
											<TableHead className="text-right">Actions</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{[
											{
												name: "Red Rose Bouquet",
												category: "Bouquets",
												price: "$64.99",
												stock: 24,
												status: "In Stock",
											},
											{
												name: "Tulip Arrangement",
												category: "Arrangements",
												price: "$39.99",
												stock: 18,
												status: "In Stock",
											},
											{
												name: "Spring Mix",
												category: "Bouquets",
												price: "$49.99",
												stock: 12,
												status: "Low Stock",
											},
											{
												name: "Sunflower Bouquet",
												category: "Bouquets",
												price: "$54.99",
												stock: 0,
												status: "Out of Stock",
											},
											{
												name: "Lily Arrangement",
												category: "Arrangements",
												price: "$59.99",
												stock: 8,
												status: "Low Stock",
											},
											{
												name: "Daisy Bouquet",
												category: "Bouquets",
												price: "$44.99",
												stock: 32,
												status: "In Stock",
											},
										].map((product, i) => (
											<TableRow key={i}>
												<TableCell>
													<div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center">
														<Flower className="h-5 w-5 text-primary" />
													</div>
												</TableCell>
												<TableCell className="font-medium">
													{product.name}
												</TableCell>
												<TableCell>{product.category}</TableCell>
												<TableCell>{product.price}</TableCell>
												<TableCell>{product.stock}</TableCell>
												<TableCell>
													<Badge
														variant={
															product.status === "In Stock"
																? "outline"
																: product.status === "Low Stock"
																? "secondary"
																: "destructive"
														}>
														{product.status}
													</Badge>
												</TableCell>
												<TableCell className="text-right">
													<Button variant="ghost" size="sm">
														Edit
													</Button>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
						</CardContent>
					</Card>
					<div className="grid gap-4 md:grid-cols-2">
						<Card>
							<CardHeader>
								<CardTitle>Inventory Status</CardTitle>
								<CardDescription>Stock levels by category</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{[
										{ name: "Bouquets", stock: 68, total: 100 },
										{ name: "Arrangements", stock: 26, total: 50 },
										{ name: "Single Flowers", stock: 124, total: 200 },
										{ name: "Plants", stock: 32, total: 40 },
										{ name: "Accessories", stock: 45, total: 60 },
									].map((category) => (
										<div key={category.name} className="space-y-2">
											<div className="flex items-center justify-between">
												<div className="text-sm font-medium">
													{category.name}
												</div>
												<div className="text-sm text-muted-foreground">
													{category.stock}/{category.total}
												</div>
											</div>
											<Progress
												value={(category.stock / category.total) * 100}
												className="h-2"
											/>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<CardTitle>Low Stock Alert</CardTitle>
								<CardDescription>Products that need reordering</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{[
										{ name: "Spring Mix", stock: 12, threshold: 15 },
										{ name: "Lily Arrangement", stock: 8, threshold: 10 },
										{ name: "White Roses", stock: 5, threshold: 20 },
										{ name: "Orchid Plant", stock: 3, threshold: 10 },
										{ name: "Gift Wrapping", stock: 7, threshold: 25 },
									].map((product) => (
										<div
											key={product.name}
											className="flex items-center justify-between">
											<div className="flex items-center gap-2">
												<div
													className={`w-2 h-2 rounded-full ${
														product.stock === 0
															? "bg-destructive"
															: "bg-amber-500"
													}`}></div>
												<span className="text-sm font-medium">
													{product.name}
												</span>
											</div>
											<div className="flex items-center gap-2">
												<span className="text-sm text-muted-foreground">
													{product.stock} left
												</span>
												<Button variant="outline" size="sm">
													Reorder
												</Button>
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</div>
				</TabsContent>
				<TabsContent value="recent" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Recent Orders</CardTitle>
							<CardDescription>
								A list of recent orders from your store.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="rounded-md border">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead className="w-[100px]">Order</TableHead>
											<TableHead>Customer</TableHead>
											<TableHead>Products</TableHead>
											<TableHead>Date</TableHead>
											<TableHead>Total</TableHead>
											<TableHead>Status</TableHead>
											<TableHead className="text-right">Actions</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{[
											{
												id: "ORD-2024-1234",
												customer: "Sarah Johnson",
												products: "Rose Bouquet (x1)",
												date: "Mar 14, 2024",
												total: "$64.99",
												status: "Delivered",
											},
											{
												id: "ORD-2024-1233",
												customer: "Michael Brown",
												products: "Spring Mix (x1)",
												date: "Mar 14, 2024",
												total: "$49.99",
												status: "Processing",
											},
											{
												id: "ORD-2024-1232",
												customer: "James Wilson",
												products: "Tulip Arrangement (x1)",
												date: "Mar 13, 2024",
												total: "$39.99",
												status: "Shipped",
											},
											{
												id: "ORD-2024-1231",
												customer: "Emily Davis",
												products: "Lily Arrangement (x1)",
												date: "Mar 13, 2024",
												total: "$59.99",
												status: "Processing",
											},
											{
												id: "ORD-2024-1230",
												customer: "Alex Rodriguez",
												products: "Sunflower Bouquet (x1)",
												date: "Mar 12, 2024",
												total: "$54.99",
												status: "Delivered",
											},
											{
												id: "ORD-2024-1229",
												customer: "Sophia Anderson",
												products: "Daisy Bouquet (x1)",
												date: "Mar 12, 2024",
												total: "$44.99",
												status: "Shipped",
											},
										].map((order) => (
											<TableRow key={order.id}>
												<TableCell className="font-medium">
													{order.id}
												</TableCell>
												<TableCell>{order.customer}</TableCell>
												<TableCell>{order.products}</TableCell>
												<TableCell>{order.date}</TableCell>
												<TableCell>{order.total}</TableCell>
												<TableCell>
													<Badge
														variant={
															order.status === "Delivered"
																? "outline"
																: order.status === "Shipped"
																? "secondary"
																: "default"
														}>
														{order.status}
													</Badge>
												</TableCell>
												<TableCell className="text-right">
													<Button variant="ghost" size="sm">
														View
													</Button>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
						</CardContent>
					</Card>
					<div className="grid gap-4 md:grid-cols-2">
						<Card>
							<CardHeader>
								<CardTitle>Order Summary</CardTitle>
								<CardDescription>Order status breakdown</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{[
										{ status: "Processing", count: 12, color: "bg-primary" },
										{ status: "Shipped", count: 8, color: "bg-secondary" },
										{ status: "Delivered", count: 24, color: "bg-muted" },
										{ status: "Cancelled", count: 2, color: "bg-destructive" },
									].map((status) => (
										<div
											key={status.status}
											className="flex items-center gap-4">
											<div
												className={`w-3 h-3 rounded-full ${status.color}`}></div>
											<div className="flex-1 space-y-1">
												<p className="text-sm font-medium leading-none">
													{status.status}
												</p>
												<p className="text-sm text-muted-foreground">
													{status.count} orders
												</p>
											</div>
											<div className="font-medium">
												{Math.round((status.count / 46) * 100)}%
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<CardTitle>Delivery Performance</CardTitle>
								<CardDescription>Average delivery times</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									<div className="space-y-2">
										<div className="flex items-center justify-between">
											<div className="text-sm font-medium">
												Same Day Delivery
											</div>
											<div className="text-sm text-muted-foreground">
												92% on time
											</div>
										</div>
										<Progress value={92} className="h-2" />
									</div>
									<div className="space-y-2">
										<div className="flex items-center justify-between">
											<div className="text-sm font-medium">
												Next Day Delivery
											</div>
											<div className="text-sm text-muted-foreground">
												96% on time
											</div>
										</div>
										<Progress value={96} className="h-2" />
									</div>
									<div className="space-y-2">
										<div className="flex items-center justify-between">
											<div className="text-sm font-medium">
												Standard Delivery
											</div>
											<div className="text-sm text-muted-foreground">
												98% on time
											</div>
										</div>
										<Progress value={98} className="h-2" />
									</div>
									<div className="pt-2 text-xs text-muted-foreground">
										Average delivery time: 1.2 days
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
