import { Skeleton } from "@/components";
import { Outlet } from "react-router-dom";

export function MobileMessagingSkeletonLoading() {
	return (
		<div className="h-screen flex flex-col md:hidden">
			<div className="flex-1 overflow-y-auto">
				{/* User list skeleton for mobile */}
				{Array(8)
					.fill(null)
					.map((_, index) => (
						<div key={index} className="flex items-center gap-3 p-4 border-b">
							<Skeleton className="h-10 w-10 rounded-full" />
							<div className="space-y-2 flex-1">
								<Skeleton className="h-4 w-3/4" />
								<Skeleton className="h-3 w-1/2" />
							</div>
						</div>
					))}
			</div>
		</div>
	);
}

export function MessagesLayoutSkeleton() {
	return (
		<>
			{/* Desktop skeleton */}
			<div className="hidden md:block">
				<MessagingSkeletonLoading />
			</div>

			{/* Mobile skeleton */}
			<div className="block md:hidden">
				{/* <MobileMessagingSkeletonLoading /> */}
				{/* <ConversationSkeletonLoading />/ */}
			</div>
		</>
	);
}

export function ConversationSkeletonLoading() {
	return (
		<div className="h-[90dvh] flex flex-col">
			{/* Messages skeleton */}
			<div className="flex-1 overflow-y-auto p-4 space-y-4 bg-primary/5">
				<div className="flex justify-start">
					<Skeleton className="h-12 w-2/3 max-w-[70%] rounded-lg" />
				</div>
				<div className="flex justify-end">
					<Skeleton className="h-10 w-1/2 max-w-[70%] rounded-lg" />
				</div>
				<div className="flex justify-start">
					<Skeleton className="h-16 w-3/4 max-w-[70%] rounded-lg" />
				</div>
				<div className="flex justify-end">
					<Skeleton className="h-12 w-2/3 max-w-[70%] rounded-lg" />
				</div>
				<div className="flex justify-start">
					<Skeleton className="h-10 w-1/2 max-w-[70%] rounded-lg" />
				</div>
			</div>

			{/* Input skeleton */}
			<div className="p-4 border-t bg-white dark:bg-zinc-950">
				<Skeleton className="h-10 w-full rounded-md" />
			</div>
		</div>
	);
}

export function MessagingSkeletonLayoutLoading() {
	return (
		<div className="h-screen flex flex-col">
			<div className="flex flex-1 overflow-hidden">
				{/* User list skeleton */}
				<div className="w-full block md:w-80 md:border-r overflow-y-auto p-2">
					{Array(5)
						.fill(null)
						.map((_, index) => (
							<div key={index} className="flex items-center gap-3 p-3 mb-2">
								<Skeleton className="h-10 w-10 rounded-full" />
								<div className="space-y-2 flex-1">
									<Skeleton className="h-4 md:w-3/4" />
									<Skeleton className="h-3 w-1/2" />
								</div>
							</div>
						))}
				</div>
			</div>
		</div>
	);
}

/* 


				<div className="flex-1 flex flex-col">

					<div className="flex items-center px-4 py-3 border-b bg-white dark:bg-zinc-950">
						<div className="flex items-center gap-3">
							<Skeleton className="h-10 w-10 rounded-full" />
							<div>
								<Skeleton className="h-4 w-32 mb-2" />
								<Skeleton className="h-3 w-48" />
							</div>
						</div>
					</div>


					<div className="flex-1 overflow-y-auto p-4 space-y-4 bg-primary/5">
						<div className="flex justify-start">
							<Skeleton className="h-12 w-2/3 max-w-[70%] rounded-lg" />
						</div>
						<div className="flex justify-end">
							<Skeleton className="h-10 w-1/2 max-w-[70%] rounded-lg" />
						</div>
						<div className="flex justify-start">
							<Skeleton className="h-16 w-3/4 max-w-[70%] rounded-lg" />
						</div>
						<div className="flex justify-end">
							<Skeleton className="h-12 w-2/3 max-w-[70%] rounded-lg" />
						</div>
					</div>


					<div className="p-4 border-t bg-white dark:bg-zinc-950">
						<Skeleton className="h-10 w-full rounded-md" />
					</div>
				</div>
*/
