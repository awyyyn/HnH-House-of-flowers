import { Globe, FileText } from "lucide-react";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

export default function SystemSettingsSkeleton() {
	return (
		<Tabs defaultValue="general" className="space-y-4">
			<TabsList className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-5 w-full">
				<TabsTrigger value="general" className="data-[state=active]:text-white">
					<Globe className="mr-2 h-4 w-4" />
					<span className="hidden sm:inline">General</span>
				</TabsTrigger>
				<TabsTrigger value="policy" className="data-[state=active]:text-white">
					<FileText className="mr-2 h-4 w-4" />
					<span className="hidden sm:inline">Policy & Terms</span>
				</TabsTrigger>
			</TabsList>

			{/* General Settings Skeleton */}
			<TabsContent value="general">
				<Card>
					<CardHeader>
						<Skeleton className="h-8 w-[200px]" />
						<Skeleton className="h-4 w-[300px]" />
					</CardHeader>
					<CardContent className="space-y-6">
						{/* Store Information Section */}
						<div className="space-y-4">
							<Skeleton className="h-6 w-[150px]" />
							<div className="grid gap-4 md:grid-cols-2">
								{[1, 2, 3, 4].map((i) => (
									<div key={i} className="space-y-2">
										<Skeleton className="h-4 w-[100px]" />
										<Skeleton className="h-10 w-full" />
									</div>
								))}
							</div>
							<div className="space-y-2">
								<Skeleton className="h-4 w-[120px]" />
								<Skeleton className="h-24 w-full" />
							</div>
						</div>

						<Separator />

						{/* Social Media Section */}
						<div className="space-y-4">
							<Skeleton className="h-6 w-[120px]" />
							<div className="grid gap-4 md:grid-cols-2">
								{[1, 2].map((i) => (
									<div key={i} className="space-y-2">
										<Skeleton className="h-4 w-[100px]" />
										<Skeleton className="h-10 w-full" />
									</div>
								))}
							</div>
						</div>

						<Separator />

						{/* Delivery Fee Section */}
						<div className="space-y-4">
							<Skeleton className="h-6 w-[100px]" />
							<div className="grid gap-4 md:grid-cols-2">
								<div className="space-y-2">
									<Skeleton className="h-4 w-[80px]" />
									<Skeleton className="h-10 w-full" />
								</div>
							</div>
						</div>
					</CardContent>
					<CardFooter>
						<Skeleton className="h-10 w-[150px]" />
					</CardFooter>
				</Card>
			</TabsContent>

			{/* Policy and Terms Settings Skeleton */}
			<TabsContent value="policy">
				<Card>
					<CardHeader>
						<Skeleton className="h-8 w-[200px]" />
						<Skeleton className="h-4 w-[300px]" />
					</CardHeader>
					<CardContent className="space-y-6">
						{/* Policy Sections */}
						{[1, 2, 3, 4].map((i) => (
							<div key={i} className="space-y-4">
								<Skeleton className="h-6 w-[150px]" />
								<div className="space-y-2">
									<Skeleton className="h-4 w-[180px]" />
									<Skeleton className="h-24 w-full" />
								</div>
								{i < 4 && <Separator />}
							</div>
						))}
					</CardContent>
					<CardFooter>
						<Skeleton className="h-10 w-[150px]" />
					</CardFooter>
				</Card>
			</TabsContent>
		</Tabs>
	);
}
