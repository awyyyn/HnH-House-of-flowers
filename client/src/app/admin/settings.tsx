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
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
	Textarea,
	Separator,
	InputWithIcon,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { UPDATE_STORE_SETTINGS_MUTATION } from "@/queries";
import { SystemSettingsSkeleton } from "../skeletons";
import { useMutation } from "@apollo/client";

import { useAtom } from "jotai";
import { storeAtom } from "@/states";
import { useToast } from "@/hooks/use-toast";

const generalFormSchema = z.object({
	storeName: z.string().min(1, "Store name is required"),
	storeEmail: z.string().email("Invalid email address"),
	storePhone: z.string().min(10, "Phone number must be at least 10 digits"),
	storeAddress: z.string().min(1, "Store address is required"),
	storeDescription: z.string().min(1, "Store description is required"),
	facebook: z.string().url("Invalid Facebook URL").optional(),
	instagram: z.string().url("Invalid Instagram URL").optional(),
	deliveryFee: z.string().min(1, "Delivery fee is required"),
});

const policyFormSchema = z.object({
	privacyPolicy: z.string().min(1, "Privacy policy is required"),
	termsOfService: z.string().min(1, "Terms of service is required"),
	returnPolicy: z.string().min(1, "Return policy is required"),
	shippingPolicy: z.string().min(1, "Shipping policy is required"),
});

type GeneralFormValues = z.infer<typeof generalFormSchema>;
type PolicyFormValues = z.infer<typeof policyFormSchema>;

export default function SystemSettings() {
	const [data, setData] = useAtom(storeAtom);
	const [updateStoreSettings, { loading: updating }] = useMutation(
		UPDATE_STORE_SETTINGS_MUTATION
	);
	const { toast } = useToast();

	const generalForm = useForm<GeneralFormValues>({
		resolver: zodResolver(generalFormSchema),
		values: {
			storeName: data.storeName || "",
			storeEmail: data.storeEmail || "",
			storePhone: data.storePhone || "",
			storeAddress: data.storeAddress || "",
			storeDescription: data.storeDescription || "",
			deliveryFee: String(data.deliveryFee),
			facebook: data.socialMedia.facebook || "",
			instagram: data.socialMedia.instagram || "",
		},
	});

	const policyForm = useForm<PolicyFormValues>({
		resolver: zodResolver(policyFormSchema),
		values: {
			privacyPolicy: data.policies.privacyPolicy || "",
			termsOfService: data.policies.termsOfService || "",
			returnPolicy: data.policies.returnPolicy || "",
			shippingPolicy: data.policies.shippingPolicy || "",
		},
	});

	async function onGeneralSubmit(values: GeneralFormValues) {
		try {
			const { data: updatedData } = await updateStoreSettings({
				variables: {
					...values,
					policies: {
						privacyPolicy: data.policies.privacyPolicy,
						returnPolicy: data.policies.returnPolicy,
						shippingPolicy: data.policies.shippingPolicy,
						termsOfService: data.policies.termsOfService,
					},
					deliveryFee: Number(values.deliveryFee),
					socialMedia: {
						facebook: values.facebook,
						instagram: values.instagram,
					},
					id: data.id,
				},
			});

			setData(updatedData.settings);
			toast({
				title: "Settings updated successfully",
				description: "Your store settings have been updated successfully.",
				variant: "success",
			});

			// setData({})
		} catch (error) {
			toast({
				title: "Error updating settings",
				description: "An error occurred while updating your store settings.",
				variant: "destructive",
			});
			console.error("Error saving policy settings:", error);
		}
	}

	async function onPolicySubmit(values: PolicyFormValues) {
		try {
			const { data: updatedData } = await updateStoreSettings({
				variables: {
					...data,
					policies: {
						privacyPolicy: values.privacyPolicy,
						returnPolicy: values.returnPolicy,
						shippingPolicy: values.shippingPolicy,
						termsOfService: values.termsOfService,
					},
					id: data.id,
				},
			});

			setData(updatedData.settings);
			toast({
				title: "Settings updated successfully",
				description: "Your store settings have been updated successfully.",
				variant: "success",
			});
		} catch (error) {
			console.error("Error saving policy settings:", error);
			toast({
				title: "Error updating settings",
				description: "An error occurred while updating your store settings.",
				variant: "destructive",
			});
		}
	}

	if (!data) return <SystemSettingsSkeleton />;

	const submitting =
		updating ||
		generalForm.formState.isSubmitting ||
		policyForm.formState.isSubmitting;

	return (
		<Tabs defaultValue="general" className="space-y-4">
			<TabsList className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-5 w-full">
				<TabsTrigger
					disabled={submitting}
					value="general"
					className="data-[state=active]:text-white">
					<Globe className="mr-2 h-4 w-4" />
					<span className="hidden sm:inline">General</span>
				</TabsTrigger>
				<TabsTrigger
					disabled={submitting}
					value="policy"
					className="data-[state=active]:text-white">
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
					<Form {...generalForm}>
						<form onSubmit={generalForm.handleSubmit(onGeneralSubmit)}>
							<CardContent className="space-y-6">
								<div className="space-y-4">
									<h3 className="text-lg font-medium">Store Information</h3>
									<div className="grid gap-4 md:grid-cols-2">
										<FormField
											control={generalForm.control}
											name="storeName"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Store Name</FormLabel>
													<FormControl>
														<Input {...field} readOnly={submitting} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={generalForm.control}
											name="storeEmail"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Store Email</FormLabel>
													<FormControl>
														<Input type="email" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={generalForm.control}
											name="storePhone"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Store Phone</FormLabel>
													<FormControl>
														<InputWithIcon
															{...field}
															className=""
															startIcon={
																<p className="text-sm text-gray-500">+63</p>
															}
															inputProps={{
																value: field.value,
																onChange: field.onChange,
																onBlur: field.onBlur,
																readOnly: submitting,
															}}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={generalForm.control}
											name="storeAddress"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Store Address</FormLabel>
													<FormControl>
														<Input {...field} readOnly={submitting} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
									<FormField
										control={generalForm.control}
										name="storeDescription"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Store Description</FormLabel>
												<FormControl>
													<Textarea rows={3} {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<Separator />

								<div className="space-y-4">
									<h3 className="text-lg font-medium">Social Media</h3>
									<div className="grid gap-4 md:grid-cols-2">
										<FormField
											control={generalForm.control}
											name="facebook"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Facebook</FormLabel>
													<FormControl>
														<Input {...field} readOnly={submitting} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={generalForm.control}
											name="instagram"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Instagram</FormLabel>
													<FormControl>
														<Input {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</div>

								<Separator />

								<div className="space-y-4">
									<h3 className="text-lg font-medium">Delivery Fee</h3>
									<div className="grid gap-4 md:grid-cols-2">
										<FormField
											control={generalForm.control}
											name="deliveryFee"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Price</FormLabel>
													<FormControl>
														<Input {...field} readOnly={submitting} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</div>
							</CardContent>
							<CardFooter>
								<Button type="submit" disabled={submitting}>
									{submitting ? (
										<>Saving...</>
									) : (
										<>
											<Save className="mr-2 h-4 w-4" />
											Save Changes
										</>
									)}
								</Button>
							</CardFooter>
						</form>
					</Form>
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
					<Form {...policyForm}>
						<form onSubmit={policyForm.handleSubmit(onPolicySubmit)}>
							<CardContent className="space-y-6">
								<div className="space-y-4">
									<h3 className="text-lg font-medium">Privacy Policy</h3>
									<FormField
										control={policyForm.control}
										name="privacyPolicy"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Privacy Policy Content</FormLabel>
												<FormControl>
													<Textarea rows={6} {...field} readOnly={submitting} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<Separator />

								<div className="space-y-4">
									<h3 className="text-lg font-medium">Terms of Service</h3>
									<FormField
										control={policyForm.control}
										name="termsOfService"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Terms of Service Content</FormLabel>
												<FormControl>
													<Textarea rows={6} {...field} readOnly={submitting} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<Separator />

								<div className="space-y-4">
									<h3 className="text-lg font-medium">Return Policy</h3>
									<FormField
										control={policyForm.control}
										name="returnPolicy"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Return Policy Content</FormLabel>
												<FormControl>
													<Textarea rows={4} {...field} readOnly={submitting} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<Separator />

								<div className="space-y-4">
									<h3 className="text-lg font-medium">Shipping Policy</h3>
									<FormField
										control={policyForm.control}
										name="shippingPolicy"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Shipping Policy Content</FormLabel>
												<FormControl>
													<Textarea rows={4} {...field} readOnly={submitting} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</CardContent>
							<CardFooter>
								<Button type="submit" disabled={submitting}>
									{submitting ? (
										<>Saving...</>
									) : (
										<>
											<Save className="mr-2 h-4 w-4" />
											Save Changes
										</>
									)}
								</Button>
							</CardFooter>
						</form>
					</Form>
				</Card>
			</TabsContent>
		</Tabs>
	);
}
