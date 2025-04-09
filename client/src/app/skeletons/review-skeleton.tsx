import { Skeleton } from "@/components/ui/skeleton";

export function ReviewSkeleton() {
	return (
		<div className="container mx-auto pb-10">
			<Skeleton className="h-8 w-48 mb-6" /> {/* Title */}
			{/* Review Form Card */}
			<div className="max-w-2xl mx-auto space-y-6">
				{/* Product Info Section */}
				<div className="flex items-center gap-4 p-4 border rounded-lg">
					<Skeleton className="h-24 w-24 rounded-lg" /> {/* Product Image */}
					<div className="flex-1 space-y-2">
						<Skeleton className="h-5 w-48" /> {/* Product Name */}
						<Skeleton className="h-4 w-32" /> {/* Product Price */}
					</div>
				</div>

				{/* Rating Section */}
				<div className="space-y-4 p-4 border rounded-lg">
					<Skeleton className="h-5 w-32" /> {/* Rating Label */}
					<div className="flex gap-2">
						{[1, 2, 3, 4, 5].map((i) => (
							<Skeleton key={i} className="h-8 w-8" /> /* Star buttons */
						))}
					</div>
				</div>

				{/* Review Text Section */}
				<div className="space-y-4 p-4 border rounded-lg">
					<Skeleton className="h-5 w-40" /> {/* Review Label */}
					<Skeleton className="h-32 w-full" /> {/* Review Textarea */}
				</div>

				{/* Submit Button */}
				<Skeleton className="h-10 w-full max-w-[200px] mx-auto" />
			</div>
		</div>
	);
}
