import { Skeleton } from "@/components/ui/skeleton";

export function NotificationSkeleton() {
	return (
		<div className="w-full container mx-auto border-none shadow-none mb-5">
			{/* Header */}
			<div className="flex flex-row items-center justify-between pb-2 space-y-0">
				<div>
					<Skeleton className="h-6 w-32 mb-1" />
					<Skeleton className="h-4 w-48" />
				</div>
				<Skeleton className="h-8 w-24" />
			</div>

			{/* Content */}
			<div className="max-h-[78vh] overflow-auto">
				<div className="space-y-4">
					{[1, 2, 3].map((i) => (
						<div
							key={i}
							className="flex items-start gap-3 p-3 rounded-lg bg-muted">
							{/* Icon */}
							<Skeleton className="h-4 w-4 mt-1" />

							{/* Notification Content */}
							<div className="flex-1 space-y-1">
								<div className="flex items-center justify-between">
									<Skeleton className="h-4 w-48" />
									<div className="flex items-center gap-1">
										<Skeleton className="h-5 w-12" />
									</div>
								</div>

								{/* Message */}
								<Skeleton className="h-4 w-full" />

								{/* Time and Action */}
								<div className="flex items-center justify-between mt-2">
									<Skeleton className="h-3 w-24" />
									<Skeleton className="h-6 w-20" />
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
