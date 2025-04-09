import { Skeleton } from "@/components/ui/skeleton";

export function ProductsSkeleton() {
	return (
		<>
			<div className="grid grid-cols-6 sm:grid-cols-9 justify-center gap-3 sm:gap-5 lg:grid-cols-10">
				{[...Array(10)].map((_, index) => (
					<div key={index} className="relative group">
						{/* Image Container */}
						<div className="aspect-square relative overflow-hidden rounded-lg border bg-muted">
							<Skeleton className="absolute inset-0 w-full h-full" />
						</div>

						{/* Product Info */}
						<div className="mt-2 space-y-2">
							{/* Name */}
							<Skeleton className="h-4 w-3/4" />

							{/* Price */}
							<Skeleton className="h-4 w-1/2" />

							{/* Status Badge */}
							<div className="flex justify-between items-center">
								<Skeleton className="h-5 w-20 rounded-full" />
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Pagination Skeleton */}
			<div className="my-5 flex justify-center gap-2">
				<Skeleton className="h-10 w-10 rounded-md" />
				<Skeleton className="h-10 w-10 rounded-md" />
				<Skeleton className="h-10 w-10 rounded-md" />
			</div>
		</>
	);
}
