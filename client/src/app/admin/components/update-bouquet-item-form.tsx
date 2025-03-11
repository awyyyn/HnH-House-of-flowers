"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	FormDescription,
} from "@/components/ui/form";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Define the item types
const BouquetItemType = z.enum(["WRAPPER", "TIE", "FLOWER", "SUB_FLOWER"]);

interface BouquetItem {
	readonly id: string;
	name: string;
	price: number;
	svg: string[];
	colors: string[];
	type: z.infer<typeof BouquetItemType>;
	isAvailable: boolean;
	createdAt: Date;
	updatedAt: Date;
}

// Create the form schema
const formSchema = z.object({
	name: z.string().min(2, {
		message: "Name must be at least 2 characters.",
	}),
	price: z.number().min(0, {
		message: "Price must be a positive number.",
	}),
	type: BouquetItemType,
	svg: z
		.array(
			z.string().refine(
				(val) => {
					return val.trim().startsWith("<svg") && val.trim().endsWith("</svg>");
				},
				{
					message: "Invalid SVG format",
				}
			)
		)
		.min(1, "At least one SVG is required"),
	colors: z.array(
		z.string().refine(
			(val) => {
				const s = new Option().style;
				s.color = val;
				return s.color !== "";
			},
			{
				message: "Invalid color format",
			}
		)
	),
	isAvailable: z.boolean(),
	currentColor: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface UpdateBouquetFormProps {
	bouquet: BouquetItem;
	onSubmit: (data: Omit<FormValues, "currentColor">) => Promise<void>;
}

export default function UpdateBouquetForm({
	bouquet,
	onSubmit,
}: UpdateBouquetFormProps) {
	// Initialize the form with existing bouquet data
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: bouquet.name,
			price: bouquet.price,
			type: bouquet.type,
			svg: bouquet.svg,
			colors: bouquet.colors,
			isAvailable: bouquet.isAvailable,
			currentColor: "",
		},
	});

	const { watch, setValue } = form;
	const selectedType = watch("type");
	const currentColors = watch("colors");

	// Handle color addition
	const handleAddColor = (color: string) => {
		if (color && !currentColors.includes(color)) {
			const s = new Option().style;
			s.color = color;
			if (s.color !== "") {
				setValue("colors", [...currentColors, color]);
				setValue("currentColor", "");
			}
		}
	};

	// Handle color removal
	const handleRemoveColor = (colorToRemove: string) => {
		setValue(
			"colors",
			currentColors.filter((color) => color !== colorToRemove)
		);
	};

	// Get contrast color for text
	const getContrastColor = (hexColor: string): string => {
		const s = new Option().style;
		s.color = hexColor;
		const color = s.color;

		let r, g, b;
		if (color.startsWith("#")) {
			const hex = color.substring(1);
			r = Number.parseInt(hex.substring(0, 2), 16);
			g = Number.parseInt(hex.substring(2, 4), 16);
			b = Number.parseInt(hex.substring(4, 6), 16);
		} else if (color.startsWith("rgb")) {
			[r, g, b] = color.match(/\d+/g)!.map(Number);
		} else {
			return "#000000";
		}

		const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
		return luminance > 0.5 ? "#000000" : "#ffffff";
	};

	// Handle form submission
	async function handleSubmit(data: FormValues) {
		// Remove the currentColor field from the submitted data
		const { currentColor, ...submitData } = data;
		await onSubmit(submitData);
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(handleSubmit)}
				className="max-w-3xl mx-auto">
				<Card>
					<CardHeader>
						<CardTitle>Update Bouquet Item</CardTitle>
					</CardHeader>
					<CardContent className="space-y-6">
						{/* Availability Toggle */}
						<FormField
							control={form.control}
							name="isAvailable"
							render={({ field }) => (
								<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
									<div className="space-y-0.5">
										<FormLabel className="text-base">Availability</FormLabel>
										<FormDescription>
											Make this bouquet item available for purchase
										</FormDescription>
									</div>
									<FormControl>
										<Switch
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
								</FormItem>
							)}
						/>

						{/* Name Field */}
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input placeholder="Rose Bouquet" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Price Field */}
						<FormField
							control={form.control}
							name="price"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Price</FormLabel>
									<FormControl>
										<Input
											type="number"
											step="0.01"
											min="0"
											placeholder="29.99"
											{...field}
											onChange={(e) => field.onChange(Number(e.target.value))}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Type Selection */}
						<FormField
							control={form.control}
							name="type"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Type</FormLabel>
									<FormControl>
										<RadioGroup
											onValueChange={field.onChange}
											defaultValue={field.value}
											className="grid grid-cols-2 gap-4">
											{Object.values(BouquetItemType.Values).map((type) => (
												<FormItem
													key={type}
													className="flex items-center space-x-3 space-y-0">
													<FormControl>
														<RadioGroupItem value={type} />
													</FormControl>
													<FormLabel className="font-normal">{type}</FormLabel>
												</FormItem>
											))}
										</RadioGroup>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* SVG Fields */}
						{selectedType === "WRAPPER" ? (
							// Two SVG inputs for WRAPPER type
							<>
								<FormField
									control={form.control}
									name="svg.0"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Front SVG</FormLabel>
											<FormControl>
												<div className="space-y-2">
													<Textarea placeholder="<svg>...</svg>" {...field} />
													{field.value && (
														<div className="border p-4 rounded-md">
															<p className="text-sm font-medium mb-2">
																Preview:
															</p>
															<div
																className="h-24 w-24 mx-auto"
																dangerouslySetInnerHTML={{
																	__html: field.value,
																}}
															/>
														</div>
													)}
												</div>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="svg.1"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Back SVG</FormLabel>
											<FormControl>
												<div className="space-y-2">
													<Textarea placeholder="<svg>...</svg>" {...field} />
													{field.value && (
														<div className="border p-4 rounded-md">
															<p className="text-sm font-medium mb-2">
																Preview:
															</p>
															<div
																className="h-24 w-24 mx-auto"
																dangerouslySetInnerHTML={{
																	__html: field.value,
																}}
															/>
														</div>
													)}
												</div>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</>
						) : (
							// Single SVG input for other types
							<FormField
								control={form.control}
								name="svg.0"
								render={({ field }) => (
									<FormItem>
										<FormLabel>SVG</FormLabel>
										<FormControl>
											<div className="space-y-2">
												<Textarea placeholder="<svg>...</svg>" {...field} />
												{field.value && (
													<div className="border p-4 rounded-md">
														<p className="text-sm font-medium mb-2">Preview:</p>
														<div
															className="h-24 w-24 mx-auto"
															dangerouslySetInnerHTML={{ __html: field.value }}
														/>
													</div>
												)}
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						)}

						{/* Colors Field */}
						<div className="space-y-4">
							<FormField
								control={form.control}
								name="currentColor"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Colors</FormLabel>
										<div className="flex space-x-2">
											<div className="flex-1 flex space-x-2">
												<FormControl>
													<Input
														placeholder="Red or #FF0000"
														{...field}
														onChange={(e) => {
															field.onChange(e.target.value);
															if (e.target.value) {
																handleAddColor(e.target.value);
															}
														}}
													/>
												</FormControl>
												<Input
													type="color"
													className="w-12 h-10 p-1 cursor-pointer"
													value={field.value || "#000000"}
													onChange={(e) => {
														field.onChange(e.target.value);
														handleAddColor(e.target.value);
													}}
												/>
											</div>
										</div>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="colors"
								render={({ field }) => (
									<FormItem>
										<div className="flex flex-wrap gap-2">
											{field.value.map((color) => (
												<Badge
													key={color}
													className="flex items-center gap-1 px-3 py-1"
													style={{
														backgroundColor: color,
														color: getContrastColor(color),
													}}>
													{color}
													<button
														type="button"
														onClick={() => handleRemoveColor(color)}
														className="ml-1 text-xs hover:opacity-70"
														style={{ color: getContrastColor(color) }}>
														<Trash2 className="h-3 w-3" />
													</button>
												</Badge>
											))}
										</div>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					</CardContent>
					<CardFooter>
						<Button type="submit" className="ml-auto">
							<Save className="h-4 w-4 mr-2" />
							Update Bouquet Item
						</Button>
					</CardFooter>
				</Card>
			</form>
		</Form>
	);
}
