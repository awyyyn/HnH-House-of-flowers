import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

export function BouquetItemsSkeleton() {
	return (
		<>
			<div className="flex justify-between items-center py-2">
				<Skeleton className="h-10 w-48" />
			</div>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>
								<Skeleton className="h-4 w-8" />
							</TableHead>
							<TableHead>
								<Skeleton className="h-4 w-32" />
							</TableHead>
							<TableHead>
								<Skeleton className="h-4 w-24" />
							</TableHead>
							<TableHead>
								<Skeleton className="h-4 w-24" />
							</TableHead>
							<TableHead>
								<Skeleton className="h-8 w-8 rounded-full" />
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{[1, 2, 3, 4, 5].map((i) => (
							<TableRow key={i}>
								<TableCell>
									<Skeleton className="h-4 w-8" />
								</TableCell>
								<TableCell>
									<Skeleton className="h-4 w-48" />
								</TableCell>
								<TableCell>
									<Skeleton className="h-4 w-24" />
								</TableCell>
								<TableCell>
									<Skeleton className="h-6 w-24 rounded-full" />
								</TableCell>
								<TableCell>
									<Skeleton className="h-8 w-8 rounded-full" />
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
			<div className="flex items-center justify-between px-2 py-4">
				<div className="flex-1 text-sm text-muted-foreground">
					<Skeleton className="h-4 w-48" />
				</div>
				<div className="flex items-center space-x-6 lg:space-x-8">
					<div className="flex items-center space-x-2">
						<Skeleton className="h-8 w-8" />
					</div>
					<div className="flex w-[100px] items-center justify-center text-sm font-medium">
						<Skeleton className="h-4 w-12" />
					</div>
					<div className="flex items-center space-x-2">
						<Skeleton className="h-8 w-8" />
					</div>
				</div>
			</div>
		</>
	);
}
