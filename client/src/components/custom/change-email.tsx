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
	FormDescription,
} from "../ui/form";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Input } from "../ui/input";
import { useAuth } from "@/contexts";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@apollo/client";
import {
	SEND_CHANGE_EMAIL_OTP_MUTATION,
	UPDATE_EMAIL_MUTATION,
} from "@/queries";
import { useState } from "react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { Loader } from "lucide-react";

const emailSchema = z.object({
	email: z.string().email(),
	newEmail: z.string().email(),
	otp: z.string(),
});

export default function ChangeEmail() {
	const { user, setUser } = useAuth();
	const { toast } = useToast();
	const [sendOTP] = useMutation(SEND_CHANGE_EMAIL_OTP_MUTATION);
	const [updateEmail] = useMutation(UPDATE_EMAIL_MUTATION);
	const [verifyOTP, setVerifyOTP] = useState(false);
	const form = useForm<z.infer<typeof emailSchema>>({
		resolver: zodResolver(emailSchema),
		reValidateMode: "onChange",
		defaultValues: {
			email: user.email,
			newEmail: "",
			otp: "",
		},
	});

	const handleSubmit = async (values: z.infer<typeof emailSchema>) => {
		try {
			if (!verifyOTP) {
				const { data } = await sendOTP({
					variables: {
						newEmail: values.newEmail,
					},
				});

				setVerifyOTP(true);
				toast({
					variant: "success",
					title: "Success",
					description: data.data,
				});
			} else {
				//
				const { data } = await updateEmail({
					variables: {
						newEmail: values.newEmail,
						otp: values.otp,
					},
				});

				localStorage.setItem("accessToken", data.data.accessToken);
				form.reset();
				setVerifyOTP(false);
				toast({
					variant: "success",
					title: "Success",
					description: "Email updated successfully",
				});
				setUser(data.data.data);
			}
		} catch (err) {
			toast({
				title: "Error",
				description: (err as Error).message,
				variant: "destructive",
			});
		}
	};

	return (
		<Card className="sm:min-w-[400px] max-w-[400px] sm:max-w-[420px]  mx-auto">
			<CardHeader>
				<h1 className="text-2xl">Change Email</h1>
				<p className="text-sm text-black/80 dark:text-white/80">
					Enter your current email and the new email address you would like to
					use. Make sure to double-check for any typos.
				</p>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="space-y-5">
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
											readOnly={true}
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
							name="newEmail"
							render={({ field }) => (
								<FormItem className="flex flex-col items-start">
									<FormLabel className="text-black dark:text-white ">
										New Email
									</FormLabel>
									<FormControl>
										<Input
											readOnly={form.formState.isSubmitting || verifyOTP}
											placeholder=""
											className="dark:border-primary/50"
											{...field}
										/>
									</FormControl>
									<FormDescription>
										A verification code will be sent to this email address.
									</FormDescription>
									<FormMessage className="dark:text-primary" />
								</FormItem>
							)}
						/>
						{verifyOTP && (
							<>
								<>
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
														readOnly={form.formState.isSubmitting}
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
								</>
							</>
						)}

						<Button disabled={form.formState.isSubmitting} className="w-full">
							{form.formState.isSubmitting ? (
								<Loader className="animate-spin" />
							) : (
								"Update email"
							)}
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
