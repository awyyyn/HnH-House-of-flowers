"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Trash2, Save, Loader2 } from "lucide-react";
import {
	Button,
	Input,
	Textarea,
	Badge,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
	RadioGroup,
	RadioGroupItem,
} from "@/components";
import { CREATE_BOUQUET_ITEM_MUTATION } from "@/queries";
import { useMutation } from "@apollo/client";
import { toast } from "@/hooks/use-toast";

// Define the item types
const ItemType = z.enum(["WRAPPER", "TIE", "FLOWER", "SUB_FLOWER"]);

// Create the form schema
const formSchema = z.object({
	name: z.string().min(2, {
		message: "Name must be at least 2 characters.",
	}),
	price: z.string().regex(/^\d+(\.\d+)?$/, {
		message: "Price must only contain digits and an optional decimal point.",
	}),
	type: ItemType,
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
	currentColor: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function BouquetItemForm() {
	const [createBouquetItem] = useMutation(CREATE_BOUQUET_ITEM_MUTATION);
	// Initialize the form
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			price: "",
			type: "FLOWER",
			svg: [""],
			colors: [],
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
		// Convert color to hex if it's a named color
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

	console.log(form.formState.errors, "qq");

	// Handle form submission
	async function onSubmit(values: FormValues) {
		// Remove the currentColor field from the submitted data
		try {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { currentColor, ...data } = values;

			await createBouquetItem({
				variables: {
					data: {
						...data,
						price: parseFloat(data.price),
						isAvailable: true,
						colors: data.colors.map((color) => color.toUpperCase()),
					},
				},
			});

			// Reset the form
			form.reset();

			toast({
				title: "Bouquet Item created",
				description: "The bouquet item has been created successfully",
				variant: "success",
				duration: 5000,
			});
		} catch (error) {
			toast({
				title: "An error occurred",
				description: (error as Error).message,
				variant: "destructive",
			});
		}
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="max-w-3xl mx-auto">
				<Card>
					<CardHeader>
						<CardTitle>Create Bouquet Item</CardTitle>
					</CardHeader>
					<CardContent className="space-y-6">
						{/* Name Field */}
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input
											readOnly={form.formState.isSubmitting}
											placeholder="Rose Bouquet"
											{...field}
										/>
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
											readOnly={form.formState.isSubmitting}
											step="0.01"
											min="0"
											placeholder="29.99"
											{...field}
											onChange={(e) => field.onChange(String(e.target.value))}
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
											disabled={form.formState.isSubmitting}
											className="grid grid-cols-2 gap-4">
											{Object.values(ItemType.Values).map((type) => (
												<FormItem
													key={type}
													className="flex items-center space-x-3 space-y-0">
													<FormControl>
														<RadioGroupItem value={type} />
													</FormControl>
													<FormLabel className="font-normal capitalize">
														{type.split("_").join(" ").toLowerCase()}
													</FormLabel>
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
													<Textarea
														readOnly={form.formState.isSubmitting}
														placeholder="<svg>...</svg>"
														{...field}
													/>
													{field.value && (
														<div className="border p-4 rounded-md">
															<p className="text-sm font-medium mb-2">
																Preview:
															</p>
															<div
																className=" flex justify-center  "
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
													<Textarea
														readOnly={form.formState.isSubmitting}
														placeholder="<svg>...</svg>"
														{...field}
													/>
													{field.value && (
														<div className="border p-4 rounded-md">
															<p className="text-sm font-medium mb-2">
																Preview:
															</p>
															<div
																className="flex justify-center  "
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
												<Textarea
													readOnly={form.formState.isSubmitting}
													placeholder="<svg>...</svg>"
													{...field}
												/>
												{field.value && (
													<div className="border p-4 rounded-md">
														<p className="text-sm font-medium mb-2">Preview:</p>
														<div
															className="flex justify-center"
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
						{(form.getValues().type === "TIE" ||
							form.getValues().type === "WRAPPER") && (
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
															readOnly={form.formState.isSubmitting}
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
						)}
					</CardContent>
					<CardFooter>
						<Button
							disabled={form.formState.isSubmitting}
							type="submit"
							className="ml-auto min-w-[200px]">
							<Save className="h-4 w-4 mr-2" />

							{form.formState.isSubmitting ? (
								<Loader2 className="animate-spin" />
							) : (
								"Save Bouquet Item"
							)}
						</Button>
					</CardFooter>
				</Card>
			</form>
		</Form>
	);
}
