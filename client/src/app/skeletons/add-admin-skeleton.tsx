import { Skeleton } from "@/components/ui/skeleton";

export function AddAdminSkeleton() {
	return (
		<div>
			<div className="flex flex-col gap-4 h-full mt-[20dvh] P-5 mx-auto sm:max-w-[400px] dark:bg-zinc-900 dark:shadow-primary/10 shadow-md p-2 md:p-5">
				<div>
					<Skeleton className="h-8 w-48 mb-2" />
					<Skeleton className="h-5 w-64" />
				</div>
				<div className="space-y-4">
					<div className="flex flex-col items-start gap-2">
						<Skeleton className="h-5 w-16" />
						<Skeleton className="h-10 w-full" />
					</div>
					<div className="flex flex-col items-start gap-2">
						<Skeleton className="h-5 w-24" />
						<Skeleton className="h-10 w-full" />
						<div className="flex w-full">
							<Skeleton className="h-4 w-24" />
						</div>
					</div>
					<Skeleton className="h-10 w-full" />
				</div>
			</div>
		</div>
	);
}
