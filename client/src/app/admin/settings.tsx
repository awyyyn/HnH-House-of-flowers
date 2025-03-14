import { useState } from "react";
import { Globe, Save, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	Input,
	Label,
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
	Textarea,
	Separator,
} from "@/components";

export default function SystemSettings() {
	const [isSaving, setIsSaving] = useState(false);

	const handleSave = () => {
		setIsSaving(true);
		// Simulate API call
		setTimeout(() => {
			setIsSaving(false);
		}, 1000);
	};

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

			{/* General Settings */}
			<TabsContent value="general">
				<Card>
					<CardHeader>
						<CardTitle>General Settings</CardTitle>
						<CardDescription>
							Configure your store information and general settings.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="space-y-4">
							<h3 className="text-lg font-medium">Store Information</h3>
							<div className="grid gap-4 md:grid-cols-2">
								<div className="space-y-2">
									<Label htmlFor="store-name">Store Name</Label>
									<Input id="store-name" defaultValue="Flower Shop" />
								</div>
								<div className="space-y-2">
									<Label htmlFor="store-email">Store Email</Label>
									<Input
										id="store-email"
										type="email"
										defaultValue="contact@flowershop.com"
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="store-phone">Store Phone</Label>
									<Input id="store-phone" defaultValue="+1 (555) 123-4567" />
								</div>
								<div className="space-y-2">
									<Label htmlFor="store-address">Store Address</Label>
									<Input
										id="store-address"
										defaultValue="123 Flower St, Garden City"
									/>
								</div>
							</div>
							<div className="space-y-2">
								<Label htmlFor="store-description">Store Description</Label>
								<Textarea
									id="store-description"
									rows={3}
									defaultValue="We provide beautiful flowers and bouquets for all occasions."
								/>
							</div>
						</div>

						<Separator />

						<div className="space-y-4">
							<h3 className="text-lg font-medium">Social Media</h3>
							<div className="grid gap-4 md:grid-cols-2">
								<div className="space-y-2">
									<Label htmlFor="facebook">Facebook</Label>
									<Input
										id="facebook"
										defaultValue="https://facebook.com/flowershop"
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="instagram">Instagram</Label>
									<Input
										id="instagram"
										defaultValue="https://instagram.com/flowershop"
									/>
								</div>
							</div>
						</div>

						<Separator />

						<div className="space-y-4">
							<h3 className="text-lg font-medium">Delivery Fee</h3>
							<div className="grid gap-4 md:grid-cols-2">
								<div className="space-y-2">
									<Label htmlFor="deliveryFee">Price</Label>
									<Input id="deliveryFee" />
								</div>
							</div>
						</div>
					</CardContent>
					<CardFooter>
						<Button onClick={handleSave} disabled={isSaving}>
							{isSaving ? (
								<>Saving...</>
							) : (
								<>
									<Save className="mr-2 h-4 w-4" />
									Save Changes
								</>
							)}
						</Button>
					</CardFooter>
				</Card>
			</TabsContent>

			{/* Policy and Terms Settings */}
			<TabsContent value="policy">
				<Card>
					<CardHeader>
						<CardTitle>Policy and Terms</CardTitle>
						<CardDescription>
							Configure legal policies and terms for your store.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="space-y-4">
							<h3 className="text-lg font-medium">Privacy Policy</h3>
							<div className="space-y-2">
								<Label htmlFor="privacy-policy">Privacy Policy Content</Label>
								<Textarea
									id="privacy-policy"
									rows={6}
									placeholder="Enter your privacy policy here..."
									defaultValue="At Flower Shop, we respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website or make a purchase."
								/>
							</div>
						</div>

						<Separator />

						<div className="space-y-4">
							<h3 className="text-lg font-medium">Terms of Service</h3>
							<div className="space-y-2">
								<Label htmlFor="terms-service">Terms of Service Content</Label>
								<Textarea
									id="terms-service"
									rows={6}
									placeholder="Enter your terms of service here..."
									defaultValue="By accessing our website and placing an order, you agree to be bound by these Terms of Service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws."
								/>
							</div>
						</div>

						<Separator />

						<div className="space-y-4">
							<h3 className="text-lg font-medium">Return Policy</h3>
							<div className="space-y-2">
								<Label htmlFor="return-policy">Return Policy Content</Label>
								<Textarea
									id="return-policy"
									rows={4}
									placeholder="Enter your return policy here..."
									defaultValue="Due to the perishable nature of our products, we do not accept returns. If you are not satisfied with your purchase, please contact us within 24 hours of delivery and we will work to resolve the issue."
								/>
							</div>
						</div>

						<Separator />

						<div className="space-y-4">
							<h3 className="text-lg font-medium">Shipping Policy</h3>
							<div className="space-y-2">
								<Label htmlFor="shipping-policy">Shipping Policy Content</Label>
								<Textarea
									id="shipping-policy"
									rows={4}
									placeholder="Enter your shipping policy here..."
									defaultValue="We deliver within our service area on the same day for orders placed before 2 PM. Delivery times may vary based on location and availability. We cannot guarantee specific delivery times."
								/>
							</div>
						</div>
					</CardContent>
					<CardFooter>
						<Button onClick={handleSave} disabled={isSaving}>
							{isSaving ? (
								<>Saving...</>
							) : (
								<>
									<Save className="mr-2 h-4 w-4" />
									Save Changes
								</>
							)}
						</Button>
					</CardFooter>
				</Card>
			</TabsContent>
		</Tabs>
	);
}
