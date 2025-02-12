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
} from "@/components";
import { useAuth } from "@/contexts";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Flower, Loader } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import { z } from "zod";

const formSchema = z.object({
	email: z.string().min(1, "Email is required").email("Invalid email"),
	password: z
		.string()
		.min(1, "Password is required")
		.min(8, "Password must be at least 8 characters"),
});

export default function Login() {
	const { login } = useAuth();
	const navigate = useNavigate();
	const [showPassword, setShowPassword] = useState(false);
	const { toast } = useToast();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const handleSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/api/auth/login`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(values),
				}
			);

			const data = await response.json();

			if (response.status !== 200) {
				throw new Error(data.message ?? "An error occurred");
			}

			login(data.data.accessToken, data.data.user);
			if (data.data.user.role === "USER") {
				navigate("/");
			} else {
				navigate("/dashboard");
			}
			toast({
				title: "Logged in successfully",
				description: "You have successfully logged in",
				variant: "success",
				duration: 5000,
			});
		} catch (err) {
			toast({
				title: "An error occurred",
				description: (err as Error).message,
				variant: "destructive",
			});
		}
	};

	const handleShowPassword = () => setShowPassword((prev) => !prev);

	return (
		<>
			<Flower className="text-primary mx-auto " size={50} />
			<h1 className="text-black dark:text-white text-2xl">Log in</h1>
			<p className="text-black/60 dark:text-white/60 text-sm">
				Enter your email and password to access your account
			</p>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleSubmit)}>
					<div className="space-y-4 mt-5">
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
												readOnly: form.formState.isSubmitting,
												placeholder: "",
												...field,
											}}
											className="dark:ring-primary/60 dark:border-primary/50"
										/>
									</FormControl>
									<div className="flex w-full">
										<FormMessage className="dark:text-primary text-start" />
										<FormDescription className="ml-auto">
											<Link to="/auth/forgot-password">Forgot password?</Link>
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
								"Log in"
							)}
						</Button>

						{/* <hr className="my-4" /> */}

						<div className="pt-5 pb-3">
							<p className=" text-sm dark:text-white/60">
								Don't have an account?
								<Link
									to="/auth/register"
									className="text-primary ml-2 hover:underline">
									Sign up
								</Link>
							</p>
						</div>
					</div>
				</form>
			</Form>
		</>
	);
}
