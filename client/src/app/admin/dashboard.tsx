import {
	Badge,
	Button,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Helmet,
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

import { CreditCard, Flower, Package, ShoppingCart, Users } from "lucide-react";
import { useState } from "react";
import { RevenueChart } from "./components/revenue-chart";
import { useQuery } from "@apollo/client";
import { DASHBOARD_QUERY } from "@/queries";
import {
	BestSellingProduct,
	LastMonth,
	OrderSummary,
	Product,
	ProductSummary,
	Revenue,
} from "@/types";
import { Link } from "react-router-dom";
import { formatCurrency } from "@/lib";
import SummaryItem from "./components/summary-item";
import { DashboardSkeleton } from "../skeletons/dashboard-skeleton";

export default function Dashboard() {
	const [activeTab, setActiveTab] = useState("overview");
	const { loading, data } = useQuery<{
		revenues: Revenue[];
		lastMonthData: LastMonth;
		topProducts: BestSellingProduct[];
		products: { data: Product[] };
		ordersSummary: OrderSummary[];
		productsSummary: ProductSummary;
	}>(DASHBOARD_QUERY, {
		variables: {
			year: 2025,
			take: 6,
			pagination: {
				page: 0,
				limit: 8,
			},
		},
	});

	if (loading) return <DashboardSkeleton />;

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
				</TabsList>
				<TabsContent value="overview" className="space-y-4">
					<div className="grid gap-4 md:grid-cols-3 ">
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
									{(data?.topProducts || []).map((product) => (
										<div key={product.id} className="flex items-center gap-4">
											<div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center">
												<Flower className="h-6 w-6 text-primary" />
											</div>
											<div className="flex-1 space-y-1">
												<p className="text-sm font-medium leading-none">
													{product.name}
												</p>
												<p className="text-sm text-muted-foreground">
													{product.sold} sold
												</p>
											</div>
											<div className="font-medium">
												{formatCurrency(product.price)}
											</div>
										</div>
									))}
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
							<Button size="sm" asChild>
								<Link to="/products">
									<Package className="h-4 w-4 mr-2" />
									View All
								</Link>
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
										{(data?.products.data || []).map((product, i) => (
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
														className="capitalize"
														variant={
															product.stock === 0
																? "destructive"
																: product.stock < 10
																? "secondary"
																: "default"
														}>
														{product.stock === 0
															? "Out of stock"
															: product.stock < 10
															? "Low stock"
															: product.status
																	.split("_")
																	.join(" ")
																	.toLowerCase()}
													</Badge>
												</TableCell>
												<TableCell className="text-right">
													<Button asChild variant="ghost" size="sm">
														<Link
															to={`/products/edit/${product.id}`}
															state={{ product }}>
															Edit
														</Link>
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
								<CardTitle>Products Overview</CardTitle>
								<CardDescription>
									Total Products: {data?.productsSummary.total}
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									<SummaryItem
										label="Flowers"
										count={data?.productsSummary.flowerCount || 0}
										percentage={data?.productsSummary.flowerPercentage || 0}
									/>
									<SummaryItem
										label="Bouquets"
										count={data?.productsSummary.bouquetCount || 0}
										percentage={data?.productsSummary.bouquetPercentage || 0}
									/>
									<SummaryItem
										label="Chocolates"
										count={data?.productsSummary.chocolateCount || 0}
										percentage={data?.productsSummary.chocolatePercentage || 0}
									/>
									<SummaryItem
										label="Gifts"
										count={data?.productsSummary.giftCount || 0}
										percentage={data?.productsSummary.giftPercentage || 0}
									/>
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<CardTitle>Order Summary</CardTitle>
								<CardDescription>Order status breakdown</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{(data?.ordersSummary ?? []).map((order) => (
										<SummaryItem
											label={order.status.toLocaleLowerCase()}
											count={order.count}
											percentage={order.percentage}
											key={order.status}
										/>
									))}
								</div>
							</CardContent>
						</Card>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
