import { Skeleton } from "@/components/ui/skeleton";

export function CheckoutSkeleton() {
	return (
		<div className="relative">
			{/* Main content area */}
			<div className="space-y-4">
				<Skeleton className="h-6 w-32" /> {/* Order Items Title */}
				{/* Order Items List */}
				<div className="space-y-4">
					{[1, 2, 3].map((i) => (
						<div key={i} className="border rounded-lg">
							<div className="flex items-center justify-between p-4">
								<div className="space-y-2">
									<Skeleton className="h-5 w-48" /> {/* Product Name */}
									<Skeleton className="h-4 w-24" /> {/* Quantity */}
								</div>
								<Skeleton className="h-5 w-24" /> {/* Price */}
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Sticky Footer */}
			<div className="fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
				<div className="container mx-auto px-5 md:px-0 py-4 space-y-4">
					{/* Payment Selection */}
					<div className="space-y-2">
						<Skeleton className="h-5 w-32" /> {/* Payment Method Label */}
						<div className="grid grid-cols-2 gap-4">
							{[1, 2].map((i) => (
								<Skeleton key={i} className="h-10 rounded-md" />
							))}
						</div>
					</div>
					<div className="h-px bg-border" /> {/* Separator */}
					{/* Delivery Selection */}
					<div className="space-y-2">
						<Skeleton className="h-5 w-32" /> {/* Delivery Method Label */}
						<div className="grid grid-cols-2 gap-4">
							{[1, 2].map((i) => (
								<Skeleton key={i} className="h-10 rounded-md" />
							))}
						</div>
					</div>
					{/* Total and Continue Button */}
					<div className="flex items-center justify-between pt-2">
						<div className="space-y-1">
							<Skeleton className="h-4 w-12" /> {/* Total Label */}
							<Skeleton className="h-6 w-24" /> {/* Total Amount */}
						</div>
						<Skeleton className="h-11 w-32" /> {/* Continue Button */}
					</div>
				</div>
			</div>
		</div>
	);
}
