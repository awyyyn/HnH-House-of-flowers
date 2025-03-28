import { useState } from "react";
// import { useNavigate } from "react-router-dom";
import { Check, Star } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import type { Product } from "@/types";
import { cn, formatCurrency } from "@/lib";
import { useMutation } from "@apollo/client";
import { CREATE_REVIEW_MUTATION } from "@/queries";
import { useToast } from "@/hooks/use-toast";

interface ProductReviewFormProps {
	product: Product;
	products: Product[];
}

const formSchema = z.object({
	rating: z
		.number()
		.min(0.5, {
			message: "Please select a rating.",
		})
		.max(5),
	comment: z
		.string()
		.min(1, {
			message: "Please enter a review comment.",
		})
		.max(500, {
			message: "Review comment must be less than 500 characters.",
		}),
});

type FormValues = z.infer<typeof formSchema>;

export default function ProductReviewForm({
	product,
	products,
}: ProductReviewFormProps) {
	const [hoveredRating, setHoveredRating] = useState<number | null>(null);
	const [selectedProduct, setSelectedProduct] = useState<Product>(product);
	const [createReview, { loading }] = useMutation(CREATE_REVIEW_MUTATION);
	const { toast } = useToast();
	const [showSuccess, setShowSuccess] = useState(false);
	const [toReviewProducts, setProducts] = useState<Product[]>(products || []);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			rating: 0,
			comment: "",
		},
	});

	// const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
	// 	if (e.target.files) {
	// 		const newImages = Array.from(e.target.files);

	// 		// Create preview URLs for the images
	// 		const newPreviewImages = newImages.map((file) =>
	// 			URL.createObjectURL(file)
	// 		);

	// 		setPreviewImages([...previewImages, ...newPreviewImages]);

	// 		// In a real app, you would upload these images to a server
	// 		// and get back URLs to store in the database
	// 		// For now, we'll just pretend we have the URLs
	// 		setImages([...images, ...newPreviewImages]);
	// 	}
	// };

	// const removeImage = (index: number) => {
	// 	const updatedPreviewImages = [...previewImages];
	// 	const updatedImages = [...images];

	// 	// Revoke the object URL to avoid memory leaks
	// 	URL.revokeObjectURL(previewImages[index]);

	// 	updatedPreviewImages.splice(index, 1);
	// 	updatedImages.splice(index, 1);

	// 	setPreviewImages(updatedPreviewImages);
	// 	setImages(updatedImages);
	// };

	const onSubmit = async (values: FormValues) => {
		// In a real app, you would submit this data to your API

		try {
			//

			await createReview({
				variables: {
					comment: values.comment,
					productId: selectedProduct.id,
					rate: values.rating,
				},
			});
			setProducts((products) =>
				products.filter((product) => product.id !== selectedProduct.id)
			);
			setShowSuccess(true);
		} catch (err) {
			toast({
				title: "An error occurred",
				description: (err as Error).message,
				variant: "destructive",
			});
		}
	};

	const handleClick = (product: Product) => {
		setShowSuccess(false);
		setSelectedProduct(product);
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<div className="grid gap-5 grid-cols-1 lg:grid-cols-12">
					{/* Product Preview */}
					<Card className="lg:col-span-3">
						<CardContent className="px-6 pb-6">
							<div className="flex flex-col  items-center pt-5 text-center">
								<img
									src={selectedProduct.images[0] || "/placeholder.svg"}
									alt={selectedProduct.name}
									width={200}
									height={200}
									className="rounded-md object-cover h-[200px] shadow w-[200px] mb-4"
								/>
								<h2 className="text-xl font-semibold">
									{selectedProduct.name}
								</h2>
								<p className="text-lg font-medium text-primary mt-1">
									{formatCurrency(selectedProduct.price)}
								</p>
							</div>
						</CardContent>
					</Card>

					{/* Review Form */}
					<Card className="lg:col-span-6">
						<CardContent className="p-6">
							{showSuccess ? (
								<>
									<div className="text-center mb-6">
										<div className="mx-auto mb-4 bg-green-100 w-16 h-16 rounded-full flex items-center justify-center">
											<Check className="h-8 w-8 text-green-600" />
										</div>
										<h2 className="text-2xl font-bold mb-2">Thanks, !</h2>
										<p className="text-gray-500">
											Your review has been submitted successfully
										</p>
									</div>
									<div className="text-center max-w-[80%] mb-6 mx-auto">
										<p className="text-gray-500">
											We appreciate you taking the time to share your feedback.
											Your opinion helps us improve our services and helps other
											customers make informed decisions.
										</p>
									</div>
								</>
							) : (
								<>
									<div className="space-y-6">
										{/* Rating */}
										<FormField
											control={form.control}
											name="rating"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="text-base font-medium">
														Rating
													</FormLabel>
													<FormControl>
														<div className="flex items-center gap-1">
															{[1, 2, 3, 4, 5].map((value) => {
																const isHalfStar = value % 1 !== 0;
																const isActive =
																	value <= (hoveredRating || field.value);

																return (
																	<button
																		disabled={form.formState.isSubmitting}
																		key={value}
																		type="button"
																		onClick={() => {
																			field.onChange(value);
																			field.onBlur();
																		}}
																		onMouseEnter={() => setHoveredRating(value)}
																		onMouseLeave={() => setHoveredRating(null)}
																		className="focus:outline-none relative w-8 h-8 flex items-center justify-center">
																		{isHalfStar ? (
																			<>
																				<Star className="w-8 h-8 absolute text-muted-foreground" />
																				<div className="absolute inset-0 overflow-hidden w-[50%]">
																					<Star
																						className={`w-8 h-8 ${
																							isActive
																								? "fill-primary text-primary"
																								: "text-muted-foreground"
																						}`}
																					/>
																				</div>
																			</>
																		) : (
																			<Star
																				className={`w-8 h-8 ${
																					isActive
																						? "fill-primary text-primary"
																						: "text-muted-foreground"
																				}`}
																			/>
																		)}
																		<span className="sr-only">
																			Rate {value} stars
																		</span>
																	</button>
																);
															})}
														</div>
													</FormControl>
													<FormDescription>
														{field.value > 0
															? `You selected ${field.value} star${
																	field.value === 1 ? "" : "s"
															  }`
															: "Select a rating"}
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>

										<Separator />

										{/* Comment */}
										<FormField
											control={form.control}
											name="comment"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="text-base font-medium">
														Your Review
													</FormLabel>
													<FormControl>
														<Textarea
															readOnly={form.formState.isSubmitting}
															placeholder="Share your experience with this product..."
															className="min-h-[120px]"
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<Separator />

										<Button
											disabled={form.formState.isSubmitting}
											type="submit"
											size="lg"
											className="w-full">
											{loading ? "Submitting..." : "Submit Review"}
										</Button>
									</div>
								</>
							)}
						</CardContent>
					</Card>
					<Card className="lg:col-span-3">
						<CardHeader>
							<h2 className="text-lg font-semibold">Pending Review</h2>
						</CardHeader>
						<CardContent className="px-6 pb-6 max-h-[600px] overflow-y-auto">
							<ul className="divide-y divide-border rounded-md border overflow-hidden">
								{toReviewProducts.length > 0 ? (
									toReviewProducts.map((item) => {
										const isActive = selectedProduct.id === item.id;

										return (
											<li
												key={item.id}
												onClick={() => handleClick(item)}
												className={cn(
													"px-4 py-3 flex justify-between items-center transition-colors",
													"hover:bg-muted/50 cursor-pointer",
													isActive &&
														"bg-primary/10 hover:bg-primary/15 border-l-4 border-l-primary"
												)}>
												<span
													className={cn(
														"font-medium",
														isActive && "text-primary font-semibold"
													)}>
													{item.name}
												</span>
												<span
													className={cn(
														"text-muted-foreground",
														isActive && "text-primary"
													)}>
													${item.price.toFixed(2)}
												</span>
											</li>
										);
									})
								) : (
									<li className="px-4 py-3 text-center">
										<p className="text-gray-500">No products to review</p>
									</li>
								)}
							</ul>
						</CardContent>
					</Card>
				</div>
			</form>
		</Form>
	);
}

/* 
		{showSuccess ? 
							
							<div className="text-center mb-6">
								<div className="mx-auto mb-4 bg-green-100 w-16 h-16 rounded-full flex items-center justify-center">
									<Check className="h-8 w-8 text-green-600" />
								</div>
								<h2 className="text-2xl font-bold mb-2">Thanks, !</h2>
								<p className="text-gray-500">
									Your review has been submitted successfully
								</p>
							</div>

							<div className="text-center max-w-[80%] mb-6 mx-auto">
								<p className="text-gray-500">
									We appreciate you taking the time to share your feedback. Your
									opinion helps us improve our services and helps other
									customers make informed decisions.
								</p>
							</div>
								</>
								: 
								
								}
*/

/* 

	{/* Image Upload 
								{/* <div>
                  <Label
                    htmlFor="images"
                    className="text-base font-medium block mb-2">
                    Add Photos (Optional)
                  </Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                    {previewImages.map((src, index) => (
                      <div key={index} className="relative aspect-square">
                        <img
                          src={src || "/placeholder.svg"}
                          alt={`Review image ${index + 1}`}
                          fill
                          className="object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1">
                          <X className="w-4 h-4" />
                          <span className="sr-only">Remove image</span>
                        </button>
                      </div>
                    ))}
                    {previewImages.length < 5 && (
                      <label
                        htmlFor="image-upload"
                        className="border-2 border-dashed border-muted-foreground/25 rounded-md flex flex-col items-center justify-center cursor-pointer aspect-square hover:border-primary/50 transition-colors">
                        <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                        <span className="text-sm text-muted-foreground">
                          Upload
                        </span>
                        <input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageUpload}
                          className="sr-only"
                        />
                      </label>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    You can upload up to 5 images. Each image should be less than
                    5MB.
                  </p>
                </div> 
*/
