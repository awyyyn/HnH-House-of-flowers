import { Skeleton } from "@/components/ui/skeleton";

export function ProductInfoSkeleton() {
	return (
		<div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
			{/* Left Column - Image Gallery */}
			<div className="lg:col-span-5">
				{/* Main Image */}
				<div className="border shadow-md rounded-xl overflow-hidden relative min-w-full min-h-[350px] sm:min-h-[400px] dark:border-transparent dark:bg-zinc-900 sm:max-w-[400px] sm:min-w-[300px] lg:max-w-[400px] lg:max-h-[400px] lg:h-[400px] xl:max-h-[500px] xl:h-[500px] xl:w-[500px] xl:min-w-[500px] xl:max-w-[500px] mx-auto">
					<Skeleton className="absolute inset-0 w-full h-full" />
				</div>

				{/* Thumbnail Images */}
				<div className="w-full overflow-x-auto flex gap-2 mt-2">
					{[1, 2, 3].map((i) => (
						<div key={i} className="img-card-sm">
							<Skeleton className="absolute inset-0 w-full h-full" />
						</div>
					))}
				</div>
			</div>

			{/* Right Column - Product Details */}
			<div className="lg:col-span-7 md:px-10 xl:px-20 w-full space-y-3">
				{/* Title with Edit Button */}
				<div className="flex items-center gap-2">
					<Skeleton className="h-8 w-48 md:w-64" />
					<Skeleton className="h-6 w-6" />
				</div>

				{/* Price */}
				<div className="flex gap-1">
					<Skeleton className="h-4 w-16" />
				</div>

				{/* Category */}
				<div className="flex gap-1">
					<Skeleton className="h-4 w-16" />
				</div>

				{/* Status */}
				<div className="flex gap-1">
					<Skeleton className="h-4 w-16" />
				</div>

				{/* Description */}
				<div className="space-y-2">
					<Skeleton className="h-4 w-24" />
					<Skeleton className="h-32 w-full" />
				</div>
			</div>
		</div>
	);
}
