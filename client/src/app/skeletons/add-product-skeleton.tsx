import { Skeleton } from "@/components/ui/skeleton";

export function AddProductSkeleton() {
	return (
		<form className="space-y-5">
			<div className="flex items-center justify-between">
				<div className="md:px-5">
					<Skeleton className="h-8 w-48" />
				</div>
				<div className="hidden md:flex items-center gap-2">
					<Skeleton className="h-10 w-20" />
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-9 gap-3 grid-flow-dense">
				{/* Left Column - Form Fields */}
				<div className="col-span-5 order-2 md:order-1 p-5 space-y-5">
					{/* Name Field */}
					<div className="space-y-2">
						<Skeleton className="h-4 w-16" />
						<Skeleton className="h-10 w-full" />
					</div>

					{/* Description Field */}
					<div className="space-y-2">
						<Skeleton className="h-4 w-24" />
						<Skeleton className="h-32 w-full" />
					</div>

					{/* Price and Stock Fields */}
					<div className="flex flex-col gap-4 items-start md:flex-row">
						<div className="w-full space-y-2">
							<Skeleton className="h-4 w-16" />
							<Skeleton className="h-10 w-full" />
						</div>
						<div className="w-full space-y-2">
							<Skeleton className="h-4 w-16" />
							<Skeleton className="h-10 w-full" />
						</div>
					</div>

					{/* Category and Status Fields */}
					<div className="flex flex-col gap-4 items-start md:flex-row">
						<div className="w-full space-y-2">
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-10 w-full" />
						</div>
						<div className="w-full space-y-2">
							<Skeleton className="h-4 w-16" />
							<Skeleton className="h-10 w-full" />
						</div>
					</div>
				</div>

				{/* Right Column - Image Upload */}
				<div className="col-span-4 order-1">
					<div className="p-5">
						<div className="space-y-2">
							<Skeleton className="h-4 w-16" />
							<div className="w-full relative h-96 border-2 rounded-lg border-gray-200 dark:border-zinc-800">
								<Skeleton className="absolute inset-0 w-full h-full" />
							</div>
						</div>
					</div>
					{/* Additional Images */}
					<div className="overflow-x-auto pt-5 flex gap-2 px-5 pb-5">
						{[1, 2, 3].map((i) => (
							<Skeleton key={i} className="h-[100px] w-[100px] rounded-md" />
						))}
					</div>
				</div>
			</div>

			{/* Mobile Submit Buttons */}
			<div className="flex md:hidden items-center justify-end px-5 gap-2">
				<Skeleton className="h-10 w-20" />
			</div>
		</form>
	);
}
