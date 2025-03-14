import { generate } from "generate-password-browser";
import {
	Button,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
	Form,
	FormDescription,
	InputWithIcon,
	Helmet,
} from "@/components";
import { z } from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Loader } from "lucide-react";
import { useMutation } from "@apollo/client";
import { CREATE_ADMIN_MUTATION } from "@/queries";

const formSchema = z.object({
	email: z.string().min(1, "Email is required").email("Invalid email"),
	password: z
		.string()
		.min(1, "Password is required")
		.min(8, "Password must be at least 8 characters"),
});

export default function AddAdmin() {
	const { toast } = useToast();
	const [createAdmin] = useMutation(CREATE_ADMIN_MUTATION);
	const [showPassword, setShowPassword] = useState(false);
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const handleShowPassword = () => setShowPassword((prev) => !prev);
	const generatePassword = async () => {
		const generatedPassword = generate({
			length: 12,
			numbers: true,
			strict: true,
			uppercase: true,
			lowercase: true,
		});
		form.setValue("password", generatedPassword);
	};

	const handleSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			await createAdmin({
				variables: values,
			});

			form.reset();

			toast({
				title: "Success",
				description: "Admin created successfully",
				variant: "success",
			});
		} catch (err) {
			toast({
				title: "Error",
				description: (err as Error).message,
				variant: "destructive",
			});
		}
	};

	return (
		<>
			<Helmet title="Add Admin" />
			<div>
				<div className="flex flex-col gap-4 h-full mt-[20dvh] P-5 mx-auto sm:max-w-[400px] dark:bg-zinc-900 dark:shadow-primary/10 shadow-md p-2 md:p-5">
					<div>
						<h1 className="text-2xl">Add New Administrator</h1>
						<p className="dark:text-gray-400">
							Administrator can manage users, orders, and flowers
						</p>
					</div>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(handleSubmit)}>
							<div className="space-y-4 ">
								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem className="flex flex-col items-start">
											<FormLabel className="text-black dark:text-white ">
												Email
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
									name="password"
									render={({ field }) => (
										<FormItem className="flex flex-col items-start">
											<FormLabel className="text-black dark:text-white ">
												Password
											</FormLabel>
											<FormControl>
												<InputWithIcon
													endIcon={
														showPassword ? (
															<EyeOff size={20} onClick={handleShowPassword} />
														) : (
															<Eye size={20} onClick={handleShowPassword} />
														)
													}
													inputProps={{
														type: showPassword ? "text" : "password",
														readOnly: true,
														placeholder: "",
														...field,
													}}
													className="dark:ring-primary/60 dark:border-primary/50"
												/>
											</FormControl>
											<div className="flex w-full">
												<FormMessage className="dark:text-primary text-start" />
												<FormDescription
													onClick={generatePassword}
													className="ml-auto cursor-pointer">
													Generate Password
												</FormDescription>
											</div>
										</FormItem>
									)}
								/>
								<Button
									disabled={form.formState.isSubmitting}
									type="submit"
									className="w-full">
									{form.formState.isSubmitting ? (
										<Loader className="animate-spin" />
									) : (
										"Add Admin"
									)}
								</Button>
							</div>
						</form>
					</Form>
				</div>
			</div>
		</>
	);
}
