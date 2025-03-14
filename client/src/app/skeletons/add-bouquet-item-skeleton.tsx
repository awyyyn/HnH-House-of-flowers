import { Skeleton } from "@/components/ui/skeleton";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export function AddBouquetItemSkeleton() {
	return (
		<form className="max-w-3xl mx-auto">
			<Card>
				<CardHeader>
					<CardTitle>
						<Skeleton className="h-8 w-48" />
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					{/* Name Field */}
					<div className="space-y-2">
						<Skeleton className="h-4 w-16" />
						<Skeleton className="h-10 w-full" />
					</div>

					{/* Price Field */}
					<div className="space-y-2">
						<Skeleton className="h-4 w-16" />
						<Skeleton className="h-10 w-full" />
					</div>

					{/* Type Selection */}
					<div className="space-y-2">
						<Skeleton className="h-4 w-16" />
						<div className="grid grid-cols-2 gap-4">
							{[1, 2, 3, 4].map((i) => (
								<div key={i} className="flex items-center space-x-3">
									<Skeleton className="h-4 w-4 rounded-full" />
									<Skeleton className="h-4 w-24" />
								</div>
							))}
						</div>
					</div>

					{/* SVG Field */}
					<div className="space-y-2">
						<Skeleton className="h-4 w-16" />
						<Skeleton className="h-32 w-full" />
						<div className="border p-4 rounded-md">
							<Skeleton className="h-4 w-20 mb-2" />
							<div className="flex justify-center">
								<Skeleton className="h-20 w-20" />
							</div>
						</div>
					</div>

					{/* Colors Field */}
					<div className="space-y-4">
						<div className="space-y-2">
							<Skeleton className="h-4 w-16" />
							<div className="flex space-x-2">
								<Skeleton className="h-10 flex-1" />
								<Skeleton className="h-10 w-12" />
							</div>
						</div>
						<div className="flex flex-wrap gap-2">
							{[1, 2, 3].map((i) => (
								<Skeleton key={i} className="h-6 w-24 rounded-full" />
							))}
						</div>
					</div>
				</CardContent>
				<CardFooter>
					<Skeleton className="h-10 w-48 ml-auto" />
				</CardFooter>
			</Card>
		</form>
	);
}
