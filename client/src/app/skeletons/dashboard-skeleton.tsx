import { Skeleton } from "@/components/ui/skeleton";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	BarChart3,
	CreditCard,
	Flower,
	ShoppingCart,
	Users,
} from "lucide-react";

export function DashboardSkeleton() {
	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-semibold">Dashboard</h1>
				<Skeleton className="h-10 w-[160px]" />
			</div>

			<Tabs defaultValue="overview" className="space-y-4">
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
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
						{/* Summary Cards */}
						{Array(4)
							.fill(0)
							.map((_, i) => (
								<Card key={i}>
									<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
										<CardTitle className="text-sm font-medium">
											<Skeleton className="h-4 w-24" />
										</CardTitle>
										{i === 0 && (
											<CreditCard className="h-4 w-4 text-muted-foreground" />
										)}
										{i === 1 && (
											<ShoppingCart className="h-4 w-4 text-muted-foreground" />
										)}
										{i === 2 && (
											<Users className="h-4 w-4 text-muted-foreground" />
										)}
										{i === 3 && (
											<BarChart3 className="h-4 w-4 text-muted-foreground" />
										)}
									</CardHeader>
									<CardContent>
										<Skeleton className="h-8 w-20 mb-1" />
										<Skeleton className="h-3 w-28" />
									</CardContent>
								</Card>
							))}
					</div>

					<div className="grid gap-4 grid-cols-1 md:grid-cols-7">
						{/* Revenue Chart */}
						<Card className="md:col-span-4">
							<CardHeader>
								<CardTitle>
									<Skeleton className="h-5 w-32" />
								</CardTitle>
								<CardDescription>
									<Skeleton className="h-4 w-48" />
								</CardDescription>
							</CardHeader>
							<CardContent>
								<Skeleton className="h-[240px] w-full" />
							</CardContent>
						</Card>

						{/* Best Selling Products */}
						<Card className="md:col-span-3">
							<CardHeader>
								<CardTitle>
									<Skeleton className="h-5 w-40" />
								</CardTitle>
								<CardDescription>
									<Skeleton className="h-4 w-48" />
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{Array(5)
										.fill(0)
										.map((_, i) => (
											<div key={i} className="flex items-center gap-4">
												<div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center">
													<Flower className="h-6 w-6 text-muted-foreground" />
												</div>
												<div className="flex-1 space-y-1">
													<Skeleton className="h-4 w-32" />
													<Skeleton className="h-3 w-16" />
												</div>
												<Skeleton className="h-4 w-16" />
											</div>
										))}
								</div>
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				<TabsContent value="products" className="space-y-4">
					{/* Product Inventory */}
					<Card>
						<CardHeader className="flex flex-row items-center justify-between">
							<div>
								<CardTitle>
									<Skeleton className="h-5 w-36" />
								</CardTitle>
								<CardDescription>
									<Skeleton className="h-4 w-48" />
								</CardDescription>
							</div>
							<Skeleton className="h-9 w-[100px]" />
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
										{Array(6)
											.fill(0)
											.map((_, i) => (
												<TableRow key={i}>
													<TableCell>
														<div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center">
															<Flower className="h-5 w-5 text-muted-foreground" />
														</div>
													</TableCell>
													<TableCell>
														<Skeleton className="h-4 w-24" />
													</TableCell>
													<TableCell>
														<Skeleton className="h-4 w-20" />
													</TableCell>
													<TableCell>
														<Skeleton className="h-4 w-16" />
													</TableCell>
													<TableCell>
														<Skeleton className="h-4 w-12" />
													</TableCell>
													<TableCell>
														<Skeleton className="h-6 w-20 rounded-full" />
													</TableCell>
													<TableCell className="text-right">
														<Skeleton className="h-8 w-16 ml-auto" />
													</TableCell>
												</TableRow>
											))}
									</TableBody>
								</Table>
							</div>
						</CardContent>
					</Card>

					<div className="grid gap-4 md:grid-cols-2">
						{/* Products Overview */}
						<Card>
							<CardHeader>
								<CardTitle>
									<Skeleton className="h-5 w-36" />
								</CardTitle>
								<CardDescription>
									<Skeleton className="h-4 w-40" />
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{Array(4)
										.fill(0)
										.map((_, i) => (
											<SkeletonSummaryItem key={i} />
										))}
								</div>
							</CardContent>
						</Card>

						{/* Order Summary */}
						<Card>
							<CardHeader>
								<CardTitle>
									<Skeleton className="h-5 w-32" />
								</CardTitle>
								<CardDescription>
									<Skeleton className="h-4 w-40" />
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{Array(4)
										.fill(0)
										.map((_, i) => (
											<SkeletonSummaryItem key={i} />
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

function SkeletonSummaryItem() {
	return (
		<div className="flex items-center justify-between">
			<div className="flex items-center gap-2">
				<Skeleton className="h-4 w-20" />
				<Skeleton className="h-4 w-8" />
			</div>
			<div className="w-full max-w-[50%]">
				<Skeleton className="h-2 w-full" />
			</div>
			<Skeleton className="h-4 w-12" />
		</div>
	);
}
