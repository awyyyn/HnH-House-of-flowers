import {
	Skeleton,
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	Separator,
} from "@/components";

export function OrdersSkeleton() {
	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row gap-4 justify-between">
				<Skeleton className="h-10 w-full sm:w-72" />
				<div className="flex gap-2">
					<Skeleton className="h-10 w-32" />
					<Skeleton className="h-10 w-[180px]" />
				</div>
			</div>

			<div className="space-y-2">
				<Skeleton className="h-10 w-full" />
				<div className="space-y-4">
					{Array(3)
						.fill(0)
						.map((_, i) => (
							<Card key={i} className="overflow-hidden">
								<CardHeader className="pb-4">
									<div className="flex flex-col sm:flex-row justify-between gap-2">
										<div>
											<Skeleton className="h-5 w-32 mb-2" />
											<Skeleton className="h-4 w-24" />
										</div>
										<Skeleton className="h-6 w-24" />
									</div>
								</CardHeader>
								<CardContent className="pt-4">
									<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
										{Array(3)
											.fill(0)
											.map((_, j) => (
												<div key={j}>
													<Skeleton className="h-4 w-20 mb-2" />
													<Skeleton className="h-4 w-16" />
												</div>
											))}
									</div>
								</CardContent>
								<Separator />
								<CardFooter className="flex justify-between py-4">
									<Skeleton className="h-5 w-24" />
									<Skeleton className="h-9 w-28" />
								</CardFooter>
							</Card>
						))}
				</div>
			</div>
		</div>
	);
}
