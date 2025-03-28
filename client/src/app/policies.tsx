"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import { useAtomValue } from "jotai";
import { storeAtom } from "@/states";
import { formatDate } from "date-fns";
import { useAuth } from "@/contexts";
import { AdminLayout, UserLayout } from "@/layouts";

function Policies() {
	const [activeTab, setActiveTab] = useState("privacy");
	const data = useAtomValue(storeAtom);

	const policies = {
		privacyPolicy: data.policies.privacyPolicy,
		termsOfService: data.policies.termsOfService,
		returnPolicy: data.policies.returnPolicy,
		shippingPolicy: data.policies.shippingPolicy,
	};

	return (
		<div className="container mx-auto py-10 max-w-4xl">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold">Store Policies</h1>
			</div>

			<Tabs
				defaultValue="privacy"
				value={activeTab}
				onValueChange={setActiveTab}
				className="w-full">
				<TabsList className="grid grid-cols-4 mb-8">
					<TabsTrigger
						className="data-[state=active]:text-white"
						value="privacy">
						Privacy
					</TabsTrigger>
					<TabsTrigger className="data-[state=active]:text-white" value="terms">
						Terms
					</TabsTrigger>
					<TabsTrigger
						className="data-[state=active]:text-white"
						value="returns">
						Returns
					</TabsTrigger>
					<TabsTrigger
						className="data-[state=active]:text-white"
						value="shipping">
						Shipping
					</TabsTrigger>
				</TabsList>

				<Card>
					<TabsContent value="privacy">
						<CardHeader>
							<CardTitle>Privacy Policy</CardTitle>
							<CardDescription>
								Last updated:{" "}
								{formatDate(new Date(data.updatedAt), "MMMM dd, yyyy")}
							</CardDescription>
						</CardHeader>
						<CardContent className="prose max-w-none">
							<p>{policies.privacyPolicy}</p>
						</CardContent>
						<CardFooter className="border-t pt-6">
							<p className="text-sm text-muted-foreground">
								If you have any questions about our Privacy Policy, please
								contact us.
							</p>
						</CardFooter>
					</TabsContent>

					<TabsContent value="terms">
						<CardHeader>
							<CardTitle>Terms of Service</CardTitle>
							<CardDescription>
								Last updated:{" "}
								{formatDate(new Date(data.updatedAt), "MMMM dd, yyyy")}
							</CardDescription>
						</CardHeader>
						<CardContent className="prose max-w-none">
							<p>{policies.termsOfService}</p>
						</CardContent>
						<CardFooter className="border-t pt-6">
							<p className="text-sm text-muted-foreground">
								By using our services, you agree to these terms.
							</p>
						</CardFooter>
					</TabsContent>

					<TabsContent value="returns">
						<CardHeader>  
							<CardTitle>Return Policy</CardTitle>
							<CardDescription>
								Last updated:{" "}
								{formatDate(new Date(data.updatedAt), "MMMM dd, yyyy")}
							</CardDescription>
						</CardHeader>
						<CardContent className="prose max-w-none">
							<p>{policies.returnPolicy}</p>
						</CardContent>
						<CardFooter className="border-t pt-6">
							<p className="text-sm text-muted-foreground">
								If you have any questions about our Return Policy, please
								contact our customer service team.
							</p>
						</CardFooter>
					</TabsContent>

					<TabsContent value="shipping">
						<CardHeader>
							<CardTitle>Shipping Policy</CardTitle>
							<CardDescription>
								Last updated:{" "}
								{formatDate(new Date(data.updatedAt), "MMMM dd, yyyy")}
							</CardDescription>
						</CardHeader>
						<CardContent className="prose max-w-none">
							<p>{policies.shippingPolicy}</p>
						</CardContent>
						<CardFooter className="border-t pt-6">
							<p className="text-sm text-muted-foreground">
								For shipping inquiries, please contact our customer service
								team.
							</p>
						</CardFooter>
					</TabsContent>
				</Card>
			</Tabs>
		</div>
	);
}

export default function PoliciesPage() {
	const { role } = useAuth();

	if (role === "USER") {
		return (
			<UserLayout>
				<Policies />
			</UserLayout>
		);
	} else {
		return (
			<AdminLayout>
				<Policies />
			</AdminLayout>
		);
	}
}
