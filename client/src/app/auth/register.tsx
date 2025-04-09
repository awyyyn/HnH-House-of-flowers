import {
	Button,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
	Form,
	InputWithIcon,
	Helmet,
	Checkbox,
} from "@/components";
import { useAuth } from "@/contexts";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Flower, Loader } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import { z } from "zod";

const formSchema = z
	.object({
		email: z.string().min(1, "Email is required").email("Invalid email"),
		password: z
			.string()
			.min(1, "Password is required")
			.min(8, "Password must be at least 8 characters"),
		confirmPassword: z
			.string()
			.min(1, "Confirm Password is required")
			.min(8, "Password must be at least 8 characters"),
		acceptPolicies: z.boolean().refine((val) => val === true, {
			message: "You must accept the policies to register",
		}),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

export default function Register() {
	const navigate = useNavigate();
	const { login } = useAuth();
	const [showPassword, setShowPassword] = useState(false);
	const { toast } = useToast();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	const handleSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/api/auth/register`,
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

			if (data.data.user.phoneNumber === null || !data.data.user.phoneNumber) {
				return navigate("/set-up-account");
			}

			if (
				data.data.user.status === "UNVERIFIED" ||
				!data.data.user.verifiedAt
			) {
				return navigate("/verify-account");
			}

			toast({
				title: "Logged in successfully",
				description: "You have successfully logged in",
				variant: "success",
				duration: 5000,
			});
		} catch (err) {
			toast({
				title: (err as Error).message,
				description: "An error occurred",
				variant: "destructive",
			});
		}
	};

	const handleShowPassword = () => setShowPassword((prev) => !prev);

	return (
		<>
			<Helmet title="Register" />
			<Flower className="text-primary mx-auto " size={50} />
			<h1 className="text-black dark:text-white text-2xl">Sign up</h1>
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
									<FormMessage className="dark:text-primary text-start" />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="confirmPassword"
							render={({ field }) => (
								<FormItem className="flex flex-col items-start">
									<FormLabel className="text-black dark:text-white ">
										Confirm Password
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
									<FormMessage className="dark:text-primary text-start" />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="acceptPolicies"
							render={({ field }) => (
								<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md">
									<FormControl>
										<Checkbox
											checked={field.value}
											onCheckedChange={field.onChange}
											disabled={form.formState.isSubmitting}
										/>
									</FormControl>
									<div className="space-y-1 leading-none text-left">
										<FormLabel className="text-sm text-black/60 dark:text-white/60">
											I accept the{" "}
											<Link
												to="/policies"
												target="_blank"
												className="text-primary  hover:underline">
												Terms of Service, Privacy Policy, and other policies
											</Link>
										</FormLabel>
										<FormMessage className="dark:text-primary" />
									</div>
								</FormItem>
							)}
						/>
						<Button
							disabled={
								form.formState.isSubmitting || !form.getValues().acceptPolicies
							}
							type="submit"
							className="w-full">
							{form.formState.isSubmitting ? (
								<Loader className="animate-spin" />
							) : (
								"Sign up"
							)}
						</Button>

						{/* <hr className="my-4" /> */}

						<div className="pt-5 pb-3">
							<p className=" text-sm dark:text-white/60">
								Already have an account?
								<Link
									to="/auth/login"
									className="text-primary ml-2 hover:underline">
									Sign in
								</Link>
							</p>
						</div>
					</div>
				</form>
			</Form>
		</>
	);
}
