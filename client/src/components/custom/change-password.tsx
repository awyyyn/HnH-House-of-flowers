import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
	FormControl,
	FormField,
	FormItem,
	Form,
	FormLabel,
	FormMessage,
} from "../ui/form";
import { InputWithIcon } from "./flexible-input";
import { Eye, EyeOff, Loader } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@apollo/client";
import { RESET_PASSWORD_MUTATION } from "@/queries";

const passwordSchema = z
	.object({
		oldPassword: z.string().min(8, "Password should be at least 8 characters"),
		password: z.string().min(8, "Password should be at least 8 characters"),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

export default function ChangePassword() {
	const { toast } = useToast();
	const [showPassword, setShowPassword] = useState({
		oldPassword: false,
		password: false,
		confirmPassword: false,
	});
	const form = useForm<z.infer<typeof passwordSchema>>({
		resolver: zodResolver(passwordSchema),
		reValidateMode: "onChange",
		defaultValues: {
			confirmPassword: "",
			oldPassword: "",
			password: "",
		},
	});

	const [resetPassword] = useMutation(RESET_PASSWORD_MUTATION);

	const handleSubmit = async (values: z.infer<typeof passwordSchema>) => {
		try {
			await resetPassword({
				variables: {
					oldPassword: values.oldPassword,
					newPassword: values.confirmPassword,
				},
			});

			form.reset();
			toast({
				variant: "success",
				title: "Success",
				description: "Password changed successfully",
			});
		} catch (err) {
			toast({
				title: "Error",
				description: (err as Error).message,
				variant: "destructive",
			});
		}
	};

	const handleShowPassword = (field: keyof typeof showPassword) => {
		setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
	};

	return (
		<Card className="sm:min-w-[400px] max-w-[400px] sm:max-w-[420px]  mx-auto">
			<CardHeader>
				<h1 className="text-2xl">Change Password</h1>
				<p className="text-sm text-black/80 dark:text-white/80">
					Please enter your old password and a new password to change your
					password.
				</p>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="space-y-5">
						<FormField
							control={form.control}
							name="oldPassword"
							render={({ field }) => (
								<FormItem className="flex flex-col items-start">
									<FormLabel className="text-black dark:text-white ">
										Old Password
									</FormLabel>
									<FormControl>
										<InputWithIcon
											endIcon={
												showPassword.oldPassword ? (
													<EyeOff
														size={20}
														onClick={() => handleShowPassword("oldPassword")}
													/>
												) : (
													<Eye
														size={20}
														onClick={() => handleShowPassword("oldPassword")}
													/>
												)
											}
											inputProps={{
												type: showPassword.oldPassword ? "text" : "password",
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
							name="password"
							render={({ field }) => (
								<FormItem className="flex flex-col items-start">
									<FormLabel className="text-black dark:text-white ">
										New Password
									</FormLabel>
									<FormControl>
										<InputWithIcon
											endIcon={
												showPassword.password ? (
													<EyeOff
														size={20}
														onClick={() => handleShowPassword("password")}
													/>
												) : (
													<Eye
														size={20}
														onClick={() => handleShowPassword("password")}
													/>
												)
											}
											inputProps={{
												type: showPassword.password ? "text" : "password",
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
												showPassword.confirmPassword ? (
													<EyeOff
														size={20}
														onClick={() =>
															handleShowPassword("confirmPassword")
														}
													/>
												) : (
													<Eye
														size={20}
														onClick={() =>
															handleShowPassword("confirmPassword")
														}
													/>
												)
											}
											inputProps={{
												type: showPassword.confirmPassword
													? "text"
													: "password",
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

						<Button className="w-full" disabled={form.formState.isSubmitting}>
							{form.formState.isSubmitting ? (
								<Loader className="animate-spin" />
							) : (
								"Change Password"
							)}
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
