export const UsersSkeleton = () => {
	return (
		<>
			<div className="flex justify-between items-center py-2">
				<div className="h-10 w-48 bg-gray-200 rounded animate-pulse"></div>
			</div>

			{/* Table skeleton */}
			<div className="rounded-md border">
				{/* Table header skeleton */}
				<div className="flex items-center justify-between p-4 bg-gray-50">
					<div className="flex items-center gap-2">
						<div className="h-8 w-40 bg-gray-200 rounded animate-pulse"></div>
					</div>
					<div className="flex items-center gap-2">
						<div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
						<div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
					</div>
				</div>

				{/* Column headers */}
				<div className="flex items-center border-b px-4 py-2 bg-gray-50">
					<div className="w-12 flex-shrink-0">
						<div className="h-6 w-6 bg-gray-200 rounded animate-pulse"></div>
					</div>
					<div className="flex-1">
						<div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
					</div>
					<div className="flex-1">
						<div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
					</div>
					<div className="flex-1">
						<div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
					</div>
					<div className="w-24 flex-shrink-0">
						<div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
					</div>
					<div className="w-12 flex-shrink-0">
						<div className="h-6 w-6 bg-gray-200 rounded animate-pulse"></div>
					</div>
				</div>

				{/* Table rows */}
				{[...Array(10)].map((_, index) => (
					<div key={index} className="flex items-center border-b px-4 py-4">
						<div className="w-12 flex-shrink-0">
							<div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
						</div>
						<div className="flex-1">
							<div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
						</div>
						<div className="flex-1">
							<div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
						</div>
						<div className="flex-1">
							<div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
						</div>
						<div className="w-24 flex-shrink-0">
							<div className="h-5 w-16 bg-gray-200 rounded-full animate-pulse"></div>
						</div>
						<div className="w-12 flex-shrink-0">
							<div className="h-6 w-6 bg-gray-200 rounded animate-pulse"></div>
						</div>
					</div>
				))}

				{/* Pagination skeleton */}
				<div className="flex items-center justify-between p-4">
					<div className="flex items-center gap-2">
						<div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
					</div>
					<div className="flex items-center gap-2">
						<div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
						<div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
						<div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
						<div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
					</div>
				</div>
			</div>
		</>
	);
};
