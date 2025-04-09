import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";

export function PoliciesSkeleton() {
	return (
		<div className="container mx-auto py-10 max-w-4xl">
			<div className="flex justify-between items-center mb-6">
				<div className="h-9 w-48 bg-gray-200 animate-pulse rounded" />
			</div>

			<Tabs defaultValue="privacy" className="w-full">
				<TabsList className="grid grid-cols-4 mb-8">
					{["Privacy", "Terms", "Returns", "Shipping"].map((tab) => (
						<TabsTrigger key={tab} value={tab.toLowerCase()} disabled>
							{tab}
						</TabsTrigger>
					))}
				</TabsList>

				<Card>
					<CardHeader>
						<div className="h-7 w-36 bg-gray-200 animate-pulse rounded" />
						<div className="h-5 w-48 bg-gray-200 animate-pulse rounded mt-2" />
					</CardHeader>
					<CardContent className="space-y-4">
						{/* Main content skeleton */}
						<div className="h-4 w-full bg-gray-200 animate-pulse rounded" />
						<div className="h-4 w-[95%] bg-gray-200 animate-pulse rounded" />
						<div className="h-4 w-[90%] bg-gray-200 animate-pulse rounded" />

						{/* Section skeletons */}
						{[1, 2, 3].map((section) => (
							<div key={section} className="mt-8">
								<div className="h-6 w-40 bg-gray-200 animate-pulse rounded mb-4" />
								<div className="space-y-3">
									<div className="h-4 w-full bg-gray-200 animate-pulse rounded" />
									<div className="h-4 w-[92%] bg-gray-200 animate-pulse rounded" />
									<div className="h-4 w-[88%] bg-gray-200 animate-pulse rounded" />
								</div>
							</div>
						))}
					</CardContent>
					<CardFooter className="border-t pt-6">
						<div className="h-4 w-[70%] bg-gray-200 animate-pulse rounded" />
					</CardFooter>
				</Card>
			</Tabs>
		</div>
	);
}
