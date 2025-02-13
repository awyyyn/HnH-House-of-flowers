import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
	RichTextEditor,
} from "@/components";

import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
	title: z.string().nonempty(),
});

export default function AddProduct() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
		},
	});

	return (
		<Form {...form}>
			<form>
				<div className="grid grid-cols-1 lg:grid-cols-9  gap-3 grid-flow-dense">
					<div className="col-span-5 p-5">
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem className="flex flex-col items-start">
									<FormLabel className="text-black dark:text-white ">
										Title
									</FormLabel>
									<FormControl>
										<Input
											readOnly={form.formState.isSubmitting}
											placeholder=""
											className="dark:border-primary/50"
											{...field}
										/>
									</FormControl>
									<FormMessage className="dark:text-primary" />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem className="flex flex-col items-start">
									<FormLabel className="text-black dark:text-white ">
										Title
									</FormLabel>
									<FormControl className="w-full">
										<RichTextEditor
											handleValue={() => {
												console.log("value");
											}}
											editable
										/>
									</FormControl>
									<FormMessage className="dark:text-primary" />
								</FormItem>
							)}
						/>
					</div>
					<div className="col-span-4">
						<div className="bg-gray-300 h-screen">Add Product</div>
					</div>
				</div>
			</form>
		</Form>
	);
}
