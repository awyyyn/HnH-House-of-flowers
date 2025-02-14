import {
	Button,
	FileUpload,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
	RichTextEditor,
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components";
import { productCategory, productStatus } from "@/constants";
import { useToast } from "@/hooks/use-toast";
import { CREATE_PRODUCT_MUTATION, UPDATE_PRODUCT_MUTATION } from "@/queries";
import { Product } from "@/types";
import { useMutation } from "@apollo/client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const formSchema = z.object({
	name: z.string().nonempty("Required"),
	description: z.string().optional(),
	price: z.number().positive(),
	stock: z.number().positive(),
	images: z.array(z.string()).min(1, "Required"),
	category: z.string().nonempty("Required"),
	status: z.string().nonempty("Required"),
});

export default function ProductForm({
	editing = false,
	product,
}: {
	editing?: boolean;
	product?: Product;
}) {
	const [uploading, setUploading] = useState(false);
	const [imgs, setImgs] = useState<string[]>(product?.images ?? []);
	const { toast } = useToast();
	// const [isEditing, setIsEditing] = useState(editing);
	const navigate = useNavigate();
	const [addProduct] = useMutation(
		editing ? UPDATE_PRODUCT_MUTATION : CREATE_PRODUCT_MUTATION
	);
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: product?.name ?? "",
			description: product?.description ?? "",
			price: product?.price ?? 1,
			stock: product?.stock ?? 1,
			images: product?.images ?? [],
			category: product?.category ?? "",
			status: product?.status ?? "",
		},
	});

	useEffect(() => {
		form.setValue("images", imgs);
	}, [imgs]);

	const handleSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			const variables = editing
				? { id: String(product?.id), data: values }
				: values;

			await addProduct({
				variables,
			});

			navigate("/products");

			toast({
				title: "Success",
				description: editing
					? "Product updated successfully"
					: "Product created successfully",
				variant: "success",
			});
		} catch (error) {
			toast({
				title: "Error",
				description: (error as Error).message,
				variant: "destructive",
			});
		}
	};

	const handleFileUpload = (files: File[]) => {
		const url = `https://api.cloudinary.com/v1_1/${
			import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
		}/upload`;
		const fd = new FormData();
		// fd.append("upload_preset", unsignedUploadPreset);
		fd.append("upload_preset", "avatars");
		fd.append("tags", "user-avatar"); // Optional - add tags for image admin in Cloudinary
		fd.append("tags", "browser-upload"); // Optional - add tags for image admin in Cloudinary
		fd.append("file", files[0]);
		setUploading(true);
		fetch(url, {
			method: "POST",
			body: fd,
		})
			.then((response) => response.json())
			.then((data) => {
				setImgs((images) => [...images, data.url]);
				toast({
					title: "Success",
					description: "Image uploaded successfully",
					variant: "success",
				});
			})
			.catch((error) => {
				console.error("Error uploading the file:", error);
				toast({
					title: "Error",
					description: "Error uploading the file",
					variant: "destructive",
				});
			})
			.finally(() => {
				setUploading(false);
			});
	};

	return (
		<Form {...form}>
			<form className="space-y-5" onSubmit={form.handleSubmit(handleSubmit)}>
				<div className="flex items-center justify-between ">
					<div></div>
					<div className="hidden md:flex items-center gap-2">
						<Button variant="ghost" type="reset" onClick={() => form.reset()}>
							Reset
						</Button>
						<Button type="submit">
							{form.formState.isSubmitting ? (
								<>
									<Loader className="animate-spin" />
									{editing ? "Updating..." : "Saving..."}
								</>
							) : (
								"Submit"
							)}
						</Button>
					</div>
				</div>
				<div className="grid  grid-cols-1 lg:grid-cols-9  gap-3 grid-flow-dense">
					<div className="col-span-5 order-2 md:order-1 p-5 space-y-5">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem className="flex flex-col items-start">
									<FormLabel className="text-black dark:text-white ">
										Name
									</FormLabel>
									<FormControl>
										<Input
											readOnly={form.formState.isSubmitting}
											placeholder=""
											className="dark:border-primarsy/50 dark:bg-zinc-900"
											{...field}
										/>
									</FormControl>
									<FormMessage className="dark:text-primary" />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="description"
							render={() => (
								<FormItem className="flex flex-col items-start">
									<FormLabel className="text-black dark:text-white ">
										Description
									</FormLabel>
									<FormControl className="w-full">
										<RichTextEditor
											handleValue={(editor) => {
												form.setValue(
													"description",
													JSON.stringify(editor.getJSON())
												);
											}}
											content={form.formState.defaultValues?.description ?? ""}
											editable
										/>
									</FormControl>
									<FormMessage className="dark:text-primary" />
								</FormItem>
							)}
						/>

						<div className="flex flex-col  gap-4 items-start md:flex-row">
							<FormField
								control={form.control}
								name="price"
								render={({ field }) => (
									<FormItem className="flex w-full flex-col items-start">
										<FormLabel className="text-black dark:text-white ">
											Price
										</FormLabel>
										<Input {...field} className="dark:bg-zinc-900 " />
										<FormMessage className="dark:text-primary dark:bg-zinc-900" />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="stock"
								render={({ field }) => (
									<FormItem className="flex w-full flex-col items-start">
										<FormLabel className="text-black dark:text-white ">
											Stock
										</FormLabel>
										<Input {...field} className="dark:bg-zinc-900" />
										<FormMessage className="dark:text-primary" />
									</FormItem>
								)}
							/>
						</div>
						<div className="flex flex-col  gap-4 items-start md:flex-row">
							<FormField
								control={form.control}
								name="category"
								render={({ field }) => (
									<FormItem className="flex w-full flex-col items-start">
										<FormLabel className="text-black dark:text-white ">
											Category
										</FormLabel>

										<Select
											onValueChange={field.onChange}
											defaultValue={form.getValues("category")}>
											<SelectTrigger className="w-full border-gray-300 dark:bg-zinc-900">
												<SelectValue placeholder="Select a category" />
											</SelectTrigger>
											<SelectContent>
												<SelectGroup>
													<SelectLabel>Product Category</SelectLabel>
													{productCategory.map((status) => (
														<SelectItem
															value={status}
															key={status}
															className="capitalize">
															{status.split("_").join(" ")}
														</SelectItem>
													))}
												</SelectGroup>
											</SelectContent>
										</Select>
										<FormMessage className="dark:text-primary dark:bg-zinc-900" />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="status"
								render={({ field }) => (
									<FormItem className="flex w-full flex-col items-start">
										<FormLabel className="text-black dark:text-white ">
											Status
										</FormLabel>

										<Select
											onValueChange={field.onChange}
											defaultValue={form.getValues("status")}>
											<SelectTrigger className="w-full  dark:bg-zinc-900">
												<SelectValue placeholder="Select a status	" />
											</SelectTrigger>
											<SelectContent>
												<SelectGroup>
													<SelectLabel>Product Status</SelectLabel>
													{productStatus.map((status) => (
														<SelectItem
															value={status}
															key={status}
															className="capitalize">
															{status.split("_").join(" ")}
														</SelectItem>
													))}
												</SelectGroup>
											</SelectContent>
										</Select>
										<FormMessage className="dark:text-primary" />
									</FormItem>
								)}
							/>
						</div>
					</div>
					<div className="col-span-4 order-1">
						<div className="p-5">
							<FormField
								control={form.control}
								name="images"
								render={() => (
									<FormItem className="flex flex-col items-start">
										<FormLabel className="text-black dark:text-white ">
											Image
										</FormLabel>
										<FormControl>
											<div
												className={`w-full relative h-96  dark:bg-zinc-900 border-2 group rounded-lg border-gray-200 dark:border-zinc-800`}>
												{imgs.length > 0 ? (
													<>
														<div className="absolute cursor-pointer place-content-center z-50 backdrop-blur-md  hidden group-hover:grid h-full w-full">
															<Button type="button">Remove</Button>
														</div>
														<img
															src={imgs[0]}
															alt="product img"
															className="absolute w-full h-full object-contain group rounded-lg"
														/>
													</>
												) : (
													<>
														{uploading ? (
															<div className="z-[80] h-full w-full grid place-content-center">
																<Loader className="animate-spin" />
															</div>
														) : (
															<>
																<FileUpload
																	showText
																	onFileUpload={handleFileUpload}
																/>
															</>
														)}
													</>
												)}
											</div>
										</FormControl>
										<FormMessage className="dark:text-primary" />
									</FormItem>
								)}
							/>
						</div>
						<div className="overflow-x-auto pt-5 flex gap-2 px-5 pb-5">
							{imgs.length > 1 &&
								imgs.slice(1).map((image, index) => (
									<div
										className="h-[100px] group relative min-w-[100px] dark:bg-zinc-900 shadow-sm border border-gray-200 dark:border-zinc-800 rounded-md  "
										key={index}>
										<span
											onClick={() => {
												const newImages = imgs.filter((img) => image !== img);
												setImgs(newImages);
											}}
											className="absolute -top-2 hidden group-hover:block cursor-pointer -right-2 dark:hover:bg-white z-[40] rounded-full transition-all">
											<X className="dark:text-white dark:hover:text-primary" />
										</span>
										<img
											src={image}
											alt={`Image ${index}`}
											className="absolute h-full w-full object-contain"
										/>
									</div>
								))}
							{imgs.length > 0 && imgs.length < 6 && (
								<TooltipProvider delayDuration={200}>
									<Tooltip>
										<TooltipTrigger type="button">
											<div className="h-[100px] flex-col  cursor-pointer flex items-center justify-center relative max-w-[100px] min-w-[100px] rounded-md dark:bg-zinc-900">
												{uploading ? (
													<Loader className="animate-spin" />
												) : (
													<FileUpload onFileUpload={handleFileUpload} />
												)}
											</div>
										</TooltipTrigger>
										<TooltipContent className="flex p-2 items-center gap-2">
											{uploading ? (
												<>
													<Loader className="animate-spin" />
													<p>Add More</p>
												</>
											) : (
												<>
													<Plus className="h-5 w-5" />
													<p>Add More</p>
												</>
											)}
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							)}
						</div>
					</div>
				</div>
				<div className="flex  md:hidden items-center justify-end px-5 gap-2">
					<Button
						variant="ghost"
						type="reset"
						onClick={() => {
							form.reset();
						}}>
						Reset
					</Button>
					<Button type="submit">
						{form.formState.isSubmitting ? (
							<>
								<Loader className="animate-spin" />
								{editing ? "Updating..." : "Saving..."}
							</>
						) : (
							"Submit"
						)}
					</Button>
				</div>
			</form>
		</Form>
	);
}
