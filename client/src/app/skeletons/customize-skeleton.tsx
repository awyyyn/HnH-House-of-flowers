import { Skeleton } from "@/components/ui/skeleton";

export function CustomizeSkeleton() {
	return (
		<div className="container mx-auto pb-10">
			{/* Header */}
			<div className="space-y-4 mb-6">
				<Skeleton className="h-8 w-48" /> {/* Title */}
				<Skeleton className="h-4 w-96" /> {/* Description */}
			</div>

			{/* Main Content */}
			<div className="grid md:grid-cols-2 gap-8">
				{/* Left Column - Bouquet Items */}
				<div className="space-y-6">
					<Skeleton className="h-6 w-32 mb-4" /> {/* Section Title */}
					{/* Bouquet Items List */}
					<div className="space-y-4">
						{[1, 2, 3].map((i) => (
							<div key={i} className="border rounded-lg p-4">
								<div className="flex gap-4">
									<Skeleton className="h-24 w-24 rounded-lg" />{" "}
									{/* Item Image */}
									<div className="flex-1 space-y-2">
										<Skeleton className="h-5 w-48" /> {/* Item Name */}
										<Skeleton className="h-4 w-24" /> {/* Item Price */}
										<div className="flex items-center gap-2">
											<Skeleton className="h-8 w-8" /> {/* Quantity Control */}
											<Skeleton className="h-8 w-12" /> {/* Quantity */}
											<Skeleton className="h-8 w-8" /> {/* Quantity Control */}
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Right Column - Customize Details */}
				<div className="space-y-6">
					{/* Name Input */}
					<div className="space-y-2">
						<Skeleton className="h-5 w-24" /> {/* Label */}
						<Skeleton className="h-10 w-full" /> {/* Input */}
					</div>

					{/* Note Input */}
					<div className="space-y-2">
						<Skeleton className="h-5 w-32" /> {/* Label */}
						<Skeleton className="h-32 w-full" /> {/* Textarea */}
					</div>

					{/* Total Price */}
					<div className="border-t pt-4 mt-8">
						<div className="flex justify-between items-center">
							<Skeleton className="h-6 w-24" /> {/* Total Label */}
							<Skeleton className="h-8 w-32" /> {/* Price */}
						</div>
					</div>

					{/* Submit Button */}
					<Skeleton className="h-12 w-full mt-4" />
				</div>
			</div>
		</div>
	);
}
