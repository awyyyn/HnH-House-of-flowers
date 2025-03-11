import { BouquetItem } from "@/types";
import {
	Badge,
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
	RadioGroup,
	RadioGroupItem,
	Switch,
	Textarea,
} from "@/components";
import { Loader2, Save, Trash2 } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UPDATE_BOUQUET_ITEM_MUTATION } from "@/queries";
import { useMutation } from "@apollo/client";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

const BouquetItemType = z.enum(["WRAPPER", "TIE", "FLOWER", "SUB_FLOWER"]);

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

export default function BouquetItemModal({
	bouquet,
	isOpen,
	handleClose,
	edit = false,
}: {
	bouquet: BouquetItem;
	isOpen: boolean;
	edit?: boolean;
	handleClose: VoidFunction;
}) {
	const [readOnly, setReadOnly] = useState(!!edit);
	const [loading, setLoading] = useState(false);
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

	const [updateBouquetItem] = useMutation(UPDATE_BOUQUET_ITEM_MUTATION);

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

	async function handleSubmit(data: FormValues) {
		// Remove the currentColor field from the submitted data
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { currentColor, ...submitData } = data;

		setLoading(true);

		try {
			await updateBouquetItem({
				variables: {
					id: bouquet.id,
					data: {
						...submitData,

						colors: submitData.colors.map((color) => color.toUpperCase()),
					},
				},
			});

			toast({
				title: "Bouquet Item updated",
				description: "The bouquet item has been updated successfully",
				variant: "success",
				duration: 5000,
			});
			handleClose();
		} catch (error) {
			toast({
				title: "An error occurred",
				description: (error as Error).message,
				variant: "destructive",
			});
		} finally {
			setLoading(false);
		}
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(handleSubmit)}
				className="max-w-3xl mx-auto">
				<Dialog open={isOpen}>
					<DialogContent className="sm:max-w-[425px] md:min-w-[600px] lg:min-w-[800px] max-h-screen overflow-y-auto h-[80dvh]">
						<DialogHeader>
							<div className="flex items-center justify-between">
								<DialogTitle>
									{readOnly ? "Edit Bouquet Item" : "Bouquet Item Info"}
								</DialogTitle>
								<Button
									onClick={() => {
										if (readOnly) {
											setReadOnly(false);
										} else {
											form.reset();
											setReadOnly(true);
										}
									}}
									variant={readOnly ? "default" : "secondary"}
									type="button">
									{readOnly ? "View" : "Edit"}
								</Button>
							</div>
							<DialogDescription>
								{readOnly
									? "Make changes to bouquet item here. Click save when you're done."
									: "View bouquet item details here."}
							</DialogDescription>
						</DialogHeader>

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
												<FormLabel className="text-base">
													Availability
												</FormLabel>
												<FormDescription>
													Make this bouquet item available for purchase
												</FormDescription>
											</div>
											<FormControl>
												<Switch
													disabled={loading || !readOnly}
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
												<Input
													readOnly={loading || !readOnly}
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
													readOnly={loading || !readOnly}
													type="number"
													step="0.01"
													min="0"
													placeholder="29.99"
													{...field}
													onChange={(e) =>
														field.onChange(Number(e.target.value))
													}
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
													disabled={loading || !readOnly}
													defaultValue={field.value}
													className="grid grid-cols-2 gap-4">
													{Object.values(BouquetItemType.Values).map((type) => (
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
																readOnly={loading || !readOnly}
																placeholder="<svg>...</svg>"
																{...field}
															/>
															{field.value && (
																<div className="border p-4 rounded-md">
																	<p className="text-sm font-medium mb-2">
																		Preview:
																	</p>
																	<div
																		className="flex justify-center"
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
																readOnly={loading || !readOnly}
																placeholder="<svg>...</svg>"
																{...field}
															/>
															{field.value && (
																<div className="border p-4 rounded-md">
																	<p className="text-sm font-medium mb-2">
																		Preview:
																	</p>
																	<div
																		className="flex justify-center"
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
															readOnly={loading || !readOnly}
															placeholder="<svg>...</svg>"
															{...field}
														/>
														{field.value && (
															<div className="border p-4 rounded-md">
																<p className="text-sm font-medium mb-2">
																	Preview:
																</p>
																<div
																	className="flex justify-center"
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
																readOnly={loading || !readOnly}
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
															readOnly={readOnly || loading}
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
																className="ml-1 text-white text-xs hover:opacity-70"
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
						</Card>
						<DialogFooter>
							<Button
								variant="destructive"
								type="button"
								onClick={handleClose}
								disabled={loading}
								className="ml-auto">
								Close
							</Button>

							{readOnly && (
								<Button
									type="button"
									disabled={loading}
									onClick={() => {
										handleSubmit(form.getValues());
									}}
									className="ml-auto min-w-[100px]">
									<Save className="h-4 w-4 mr-2" />
									{loading ? <Loader2 className="animate-spin" /> : "Save"}
								</Button>
							)}
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</form>
		</Form>
	);
}
