import { Skeleton } from "@/components/ui/skeleton";

export function UserOrdersSkeleton() {
	return (
		<div className="space-y-6 relative pb-8">
			{/* Search and Filter Section */}
			<div className="flex flex-col sm:flex-row gap-4 justify-between">
				<div className="relative w-full sm:w-72">
					<Skeleton className="h-10 w-full" />
				</div>
				<div className="flex gap-2">
					<Skeleton className="h-10 w-[100px]" />
					<Skeleton className="h-10 w-[180px]" />
				</div>
			</div>

			{/* Tabs */}
			<div>
				<div className="grid grid-cols-5 gap-1 mb-4">
					{[1, 2, 3, 4, 5].map((i) => (
						<Skeleton key={i} className="h-10" />
					))}
				</div>

				{/* Order Cards */}
				<div className="space-y-4">
					{[1, 2, 3].map((i) => (
						<div key={i} className="border rounded-lg overflow-hidden">
							{/* Card Header */}
							<div className="bg-muted/30 p-6">
								<div className="flex flex-col sm:flex-row justify-between gap-2">
									<div className="space-y-2">
										<Skeleton className="h-5 w-32" />
										<Skeleton className="h-4 w-48" />
									</div>
									<Skeleton className="h-6 w-24" />
								</div>
							</div>

							{/* Card Content */}
							<div className="p-6">
								<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
									{[1, 2, 3].map((j) => (
										<div key={j} className="space-y-2">
											<Skeleton className="h-4 w-20" />
											<Skeleton className="h-4 w-24" />
										</div>
									))}
								</div>
							</div>

							{/* Card Footer */}
							<div className="border-t p-6">
								<div className="flex flex-wrap gap-2 justify-between">
									<Skeleton className="h-5 w-32" />
									<div className="flex gap-2">
										<Skeleton className="h-10 w-[120px]" />
										<Skeleton className="h-10 w-[120px]" />
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
