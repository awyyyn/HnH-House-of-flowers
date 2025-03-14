import { Skeleton } from "@/components/ui/skeleton";

export function CartSkeleton() {
	return (
		<div className="max-w-screen-lg mx-auto p-4 mb-6">
			{/* Title */}
			<Skeleton className="h-8 w-32 mb-4" />

			{/* Cart Items */}
			<div className="border rounded-lg overflow-hidden">
				<div className="divide-y">
					{[1, 2, 3].map((i) => (
						<div key={i} className="flex items-center gap-4 p-4">
							{/* Checkbox */}
							<Skeleton className="h-4 w-4 rounded" />

							{/* Cart Item */}
							<div className="flex-1 flex gap-4">
								{/* Image */}
								<Skeleton className="h-24 w-24 rounded-lg" />

								{/* Item Details */}
								<div className="flex-1 space-y-2">
									{/* Name */}
									<Skeleton className="h-4 w-3/4" />

									{/* Price */}
									<Skeleton className="h-4 w-1/4" />

									{/* Quantity Controls */}
									<div className="flex items-center gap-2">
										<Skeleton className="h-8 w-8 rounded-md" />
										<Skeleton className="h-8 w-8 rounded-md" />
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Total Section */}
			<div className="mt-6 border-t pt-4">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div className="space-y-2">
						{/* Selected Items Count */}
						<Skeleton className="h-4 w-32" />

						{/* Total Amount */}
						<Skeleton className="h-6 w-40" />
					</div>

					{/* Buy Button */}
					<Skeleton className="h-10 w-40" />
				</div>
			</div>
		</div>
	);
}
