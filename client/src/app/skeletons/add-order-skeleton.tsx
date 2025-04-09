import { Skeleton } from "@/components/ui/skeleton";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export function AddOrderSkeleton() {
	return (
		<div className="container mx-auto py-6 max-w-3xl">
			<Card>
				<CardHeader>
					<CardTitle>
						<Skeleton className="h-8 w-48" />
					</CardTitle>
					<CardDescription>
						<Skeleton className="h-5 w-72" />
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					{/* Order Items Section */}
					<div className="space-y-4">
						<div className="flex justify-between items-center">
							<Skeleton className="h-6 w-32" />
							<Skeleton className="h-9 w-24" />
						</div>

						{/* Product Items */}
						<div className="space-y-4">
							<div className="flex items-center gap-4 p-4 border rounded-lg">
								<Skeleton className="h-20 w-20 rounded-md" />
								<div className="flex-1 space-y-2">
									<Skeleton className="h-5 w-48" />
									<Skeleton className="h-4 w-24" />
								</div>
								<div className="flex items-center gap-2">
									<Skeleton className="h-8 w-8 rounded-full" />
								</div>
							</div>
						</div>
					</div>

					{/* Payment Method Section */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="space-y-4">
							<Skeleton className="h-6 w-40" />
							<div className="space-y-2">
								<Skeleton className="h-4 w-20" />
								<Skeleton className="h-4 w-20" />
							</div>
						</div>
					</div>

					{/* Order Summary Section */}
					<div className="bg-muted p-4 rounded-lg space-y-2">
						<Skeleton className="h-6 w-32" />
						<div className="space-y-2">
							<div className="flex justify-between">
								<Skeleton className="h-4 w-24" />
								<Skeleton className="h-4 w-24" />
							</div>
							<div className="flex justify-between">
								<Skeleton className="h-4 w-16" />
								<Skeleton className="h-4 w-24" />
							</div>
						</div>
					</div>
				</CardContent>
				<CardFooter>
					<Skeleton className="h-10 w-full" />
				</CardFooter>
			</Card>
		</div>
	);
}
