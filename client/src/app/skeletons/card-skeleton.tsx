import { Skeleton } from "@/components";

export function CardSkeleton() {
	return (
		<div className="grid grid-cols-6 sm:grid-cols-8 justify-center gap-3 sm:gap-5 lg:grid-cols-10 ">
			{Array.from({ length: 10 }).map((_, index) => (
				<div
					key={index}
					className="space-y-1 min-w-full col-span-3 lg:col-span-2">
					<Skeleton className="h-52 sm:h-72 w-full" />
					<Skeleton className="h-8 w-[90%]" />
					<Skeleton className="h-6 w-[40%]" />
				</div>
			))}
		</div>
	);
}
