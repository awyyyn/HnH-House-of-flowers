export function HomeSkeleton() {
	return (
		<div className="flex min-h-screen flex-col">
			<main className="flex-1">
				{/* Hero Section Skeleton */}
				<section className="relative">
					<div className="container px-4 py-16 md:py-24 lg:py-32">
						<div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-[1fr_500px]">
							<div className="flex flex-col justify-center space-y-4">
								<div className="space-y-2">
									<div className="h-12 w-3/4 bg-gray-200 rounded animate-pulse" />
									<div className="h-6 w-full bg-gray-200 rounded animate-pulse" />
									<div className="h-6 w-2/3 bg-gray-200 rounded animate-pulse" />
								</div>
								<div className="flex flex-col gap-2 min-[400px]:flex-row">
									<div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
									<div className="h-10 w-40 bg-gray-200 rounded animate-pulse" />
								</div>
							</div>
							<div className="flex items-center justify-center">
								<div className="h-[550px] w-[550px] bg-gray-200 rounded-lg animate-pulse" />
							</div>
						</div>
					</div>
				</section>

				{/* Categories Section Skeleton */}
				<section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
					<div className="container px-4 md:px-6">
						<div className="flex flex-col items-center justify-center space-y-4 text-center">
							<div className="space-y-2">
								<div className="h-8 w-48 bg-gray-200 rounded animate-pulse mx-auto" />
								<div className="h-6 w-96 bg-gray-200 rounded animate-pulse mx-auto" />
							</div>
						</div>
						<div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 pt-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
							{[1, 2, 3, 4].map((i) => (
								<div
									key={i}
									className="relative overflow-hidden rounded-lg shadow-lg">
									<div className="h-[300px] w-full bg-gray-200 animate-pulse" />
								</div>
							))}
						</div>
					</div>
				</section>

				{/* Best Selling Products Skeleton */}
				<section className="w-full py-12 md:py-24 lg:py-32">
					<div className="container px-4 md:px-6">
						<div className="flex flex-col items-center justify-center space-y-4 text-center">
							<div className="space-y-2">
								<div className="h-8 w-56 bg-gray-200 rounded animate-pulse mx-auto" />
								<div className="h-6 w-96 bg-gray-200 rounded animate-pulse mx-auto" />
							</div>
						</div>
						<div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 pt-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
							{[1, 2, 3, 4].map((i) => (
								<div
									key={i}
									className="group relative overflow-hidden rounded-lg border bg-background shadow-sm">
									<div className="h-[400px] w-full bg-gray-200 animate-pulse" />
									<div className="p-4 space-y-2">
										<div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
										<div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
										<div className="mt-4">
											<div className="h-9 w-full bg-gray-200 rounded animate-pulse" />
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* Why Choose Us Skeleton */}
				<section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
					<div className="container px-4 md:px-6">
						<div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
							<div className="flex flex-col justify-center space-y-4">
								<div className="space-y-2">
									<div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
									<div className="h-6 w-96 bg-gray-200 rounded animate-pulse" />
								</div>
								<div className="space-y-6">
									{[1, 2, 3].map((i) => (
										<div key={i} className="flex items-start gap-4">
											<div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
											<div className="space-y-2 flex-1">
												<div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
												<div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
											</div>
										</div>
									))}
								</div>
							</div>
							<div className="flex items-center justify-center">
								<div className="h-[550px] w-[550px] bg-gray-200 rounded-lg animate-pulse" />
							</div>
						</div>
					</div>
				</section>

				{/* Testimonials Skeleton */}
				<section className="w-full py-12 md:py-24 lg:py-32">
					<div className="container px-4 md:px-6">
						<div className="flex flex-col items-center justify-center space-y-4 text-center">
							<div className="space-y-2">
								<div className="h-8 w-64 bg-gray-200 rounded animate-pulse mx-auto" />
								<div className="h-6 w-96 bg-gray-200 rounded animate-pulse mx-auto" />
							</div>
						</div>
						<div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 pt-12 md:grid-cols-2 lg:grid-cols-3">
							{[1, 2, 3].map((i) => (
								<div
									key={i}
									className="flex flex-col justify-between rounded-lg border bg-background p-6 shadow-sm">
									<div className="space-y-4">
										<div className="h-20 w-full bg-gray-200 rounded animate-pulse" />
									</div>
									<div className="mt-6 flex items-center gap-4">
										<div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
										<div className="space-y-2">
											<div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
											<div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</section>
			</main>

			{/* Footer Skeleton */}
			<footer className="w-full border-t bg-background py-6 md:py-12">
				<div className="container px-4 md:px-6">
					<div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
						{[1, 2, 3].map((i) => (
							<div key={i} className="space-y-4">
								<div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
								<div className="space-y-2">
									{[1, 2, 3, 4].map((j) => (
										<div
											key={j}
											className="h-4 w-24 bg-gray-200 rounded animate-pulse"
										/>
									))}
								</div>
							</div>
						))}
					</div>
					<div className="mt-8 border-t pt-8 text-center">
						<div className="h-4 w-64 bg-gray-200 rounded animate-pulse mx-auto" />
					</div>
				</div>
			</footer>
		</div>
	);
}
