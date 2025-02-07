import {
	Button,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
	InputWithIcon,
} from "@/components";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	IconCircleKey,
	IconMailbox,
	IconMailOpened,
	IconShieldCheck,
} from "@tabler/icons-react";
import { Eye, EyeOff, MoveLeft } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";

const formSchema = z
	.object({
		email: z.string().email("Invalid email"),
		password: z
			.string()
			.min(1, "Password is required")
			.min(8, "Password must be at least 8 characters"),
		confirmPassword: z
			.string()
			.min(1, "Confirm Password is required")
			.min(8, "Password must be at least 8 characters"),
		otp: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

const icons = [
	<IconMailbox className="text-primary mx-auto " size={100} />,
	<IconMailOpened className="text-primary mx-auto " size={100} />,
	<IconCircleKey className="text-primary mx-auto " size={100} />,
	<IconShieldCheck className="text-primary mx-auto " size={100} />,
];
const header = ["Forgot Password", "Check your email", "Create new Password"];
const description = [
	"Enter your registered email below to \n receive reset instruction.",
	"We've sent the code to the email on your device",
	"Your new password must be different from previous used passwords.",
];

const buttonLabel = ["Reset Password", "Verify OTP", "Create Password"];

export default function ForgotPassword() {
	const [loading, setLoading] = useState(false);
	const [step, setStep] = useState(0);
	const [showPassword, setShowPassword] = useState(false);
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			confirmPassword: "",
			email: "",
			password: "",
			otp: "",
		},
	});

	const handleShowPassword = () => setShowPassword((show) => !show);

	const handleSubmit = async (values: z.infer<typeof formSchema>) => {
		if (step === 0 && values.email !== "") {
			setStep((p) => p + 1);
		} else if (step === 1 && values.otp !== "") {
			setStep((p) => p + 1);
		} else {
			setStep((p) => p + 1);
		}
	};

	return (
		<>
			{icons[step]}
			<h1 className="text-black dark:text-white text-2xl">{header[step]}</h1>
			<p className="text-black/60 dark:text-white/60 text-sm md:max-w-[80%] md:mx-auto">
				{description[step]}
			</p>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleSubmit)}>
					<div className="pt-4">
						{
							[
								<>
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
														placeholder=""
														className="dark:border-primary/50"
														readOnly={form.formState.isSubmitting || loading}
														{...field}
													/>
												</FormControl>
												<FormMessage className="dark:text-primary" />
											</FormItem>
										)}
									/>
								</>,
								<>
									<Input className="hidden" />
									<FormField
										control={form.control}
										name="otp"
										render={({ field }) => (
											<FormItem className="flex flex-col items-start">
												<FormLabel className="text-black dark:text-white ">
													One-time Password
												</FormLabel>
												<FormControl className="">
													{/* className="dark:border-primary/50" */}
													<InputOTP
														maxLength={6}
														readOnly={form.formState.isSubmitting || loading}
														className=""
														// onChange={(e) => form.setValue("otp", e)}
														// value={form.getValues("otp")}
														{...field}>
														<InputOTPGroup>
															<InputOTPSlot
																className="h-12 w-12 text-2xl"
																index={0}
															/>
														</InputOTPGroup>
														<InputOTPGroup>
															<InputOTPSlot
																className="h-12 w-12 text-2xl"
																index={1}
															/>
														</InputOTPGroup>
														<InputOTPGroup>
															<InputOTPSlot
																className="h-12 w-12 text-2xl"
																index={2}
															/>
														</InputOTPGroup>
														<InputOTPGroup>
															<InputOTPSlot
																className="h-12 w-12 text-2xl"
																index={3}
															/>
														</InputOTPGroup>
														<InputOTPGroup>
															<InputOTPSlot
																className="h-12 w-12 text-2xl"
																index={4}
															/>
														</InputOTPGroup>
														<InputOTPGroup>
															<InputOTPSlot
																className="h-12 w-12 text-2xl"
																index={5}
															/>
														</InputOTPGroup>
													</InputOTP>
												</FormControl>
												<FormMessage className="dark:text-primary" />
											</FormItem>
										)}
									/>
								</>,

								<div className="space-y-4">
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
																<EyeOff
																	size={20}
																	onClick={handleShowPassword}
																/>
															) : (
																<Eye size={20} onClick={handleShowPassword} />
															)
														}
														inputProps={{
															type: showPassword ? "text" : "password",
															readOnly: form.formState.isSubmitting || loading,
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
																<EyeOff
																	size={20}
																	onClick={handleShowPassword}
																/>
															) : (
																<Eye size={20} onClick={handleShowPassword} />
															)
														}
														inputProps={{
															type: showPassword ? "text" : "password",
															readOnly: form.formState.isSubmitting || loading,
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
								</div>,
							][step]
						}
						{step < 3 && (
							<Button
								type={step === 2 ? "submit" : "button"}
								onClick={() => handleSubmit(form.getValues())}
								className="w-full mt-4"
								disabled={!form.getValues("email") || loading}>
								{buttonLabel[step]}
							</Button>
						)}

						<Link to="/auth/login">
							<Button
								variant="ghost"
								type={"button"}
								disabled={loading}
								className="w-full mt-4 hover:bg-primary/5 transition-all duration-300">
								<MoveLeft /> Back to Log in
							</Button>
						</Link>
					</div>
				</form>
			</Form>
		</>
	);
}
