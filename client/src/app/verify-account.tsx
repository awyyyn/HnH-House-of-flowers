import { Button, InputOTP, InputOTPGroup, InputOTPSlot } from "@/components";
import { useAuth } from "@/contexts";
import { useToast } from "@/hooks/use-toast";
import { UPDATE_USER_MUTATION } from "@/queries";
import { useMutation } from "@apollo/client";
import { Loader } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function VerifyAccount() {
	const { logout, user, setValues } = useAuth();
	const [input, setInput] = useState("");
	const navigate = useNavigate();
	const { toast } = useToast();
	const [loading, setLoading] = useState(false);
	const [updateUser, { loading: updating }] = useMutation(UPDATE_USER_MUTATION);

	const verifyOTP = async () => {
		try {
			setLoading(true);

			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/api/auth/verify-otp`,
				{
					method: "POST",
					headers: {
						"Content-type": `application/json`,
					},
					body: JSON.stringify({
						email: user.email,
						token: input,
					}),
				}
			);

			const data = await response.json();

			if (response.status !== 200) {
				throw new Error(data.message ?? "Something went wrong!");
			}

			await updateUser({
				variables: {
					data: { verifiedAt: new Date().toISOString(), status: "VERIFIED" },
				},
			});
			navigate("/set-up-account");

			setValues({
				isAuthenticated: true,
				role: user.role,
			});
			toast({
				title: "Account verified successfully",
				description: "Set up your account to continue",
				variant: "success",
			});
		} catch (err) {
			//
			const error = err as Error;
			toast({
				title: error.message,
				description: "Please try again",
				variant: "destructive",
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="p-5  ">
			<header className="fixed top-0 left-0 w-screen flex p-5 justify-end">
				<Button
					onClick={() => {
						logout();
						navigate("/auth/login");
					}}>
					Logout
				</Button>
			</header>
			<main className="h-screen w-screen grid place-content-center">
				<div className="max-w-screen-sm">
					<h1 className="text-3xl font-bold text-center">
						Verify your account
					</h1>

					<p className="text-center mt-4">
						You can verify your account using the OTP sent to your email (
						<i>{user.email}</i>).
					</p>
					<div className="flex items-center flex-col gap-5 mt-5">
						<div>
							<InputOTP
								maxLength={6}
								// readOnly={form.formState.isSubmitting}
								className=""
								value={input}
								readOnly={loading || updating}
								onChange={setInput}
								// value={form.getValues("otp")}
							>
								<InputOTPGroup>
									<InputOTPSlot className="h-12 w-12 text-2xl" index={0} />
								</InputOTPGroup>
								<InputOTPGroup>
									<InputOTPSlot className="h-12 w-12 text-2xl" index={1} />
								</InputOTPGroup>
								<InputOTPGroup>
									<InputOTPSlot className="h-12 w-12 text-2xl" index={2} />
								</InputOTPGroup>
								<InputOTPGroup>
									<InputOTPSlot className="h-12 w-12 text-2xl" index={3} />
								</InputOTPGroup>
								<InputOTPGroup>
									<InputOTPSlot className="h-12 w-12 text-2xl" index={4} />
								</InputOTPGroup>
								<InputOTPGroup>
									<InputOTPSlot className="h-12 w-12 text-2xl" index={5} />
								</InputOTPGroup>
							</InputOTP>
						</div>
						<div className="flex gap-1">
							<p className="text-gray-600 text-sm">Didn't receive OTP?</p>
							<p className="text-primary text-sm cursor-pointer hover:underline">
								Resend OTP
							</p>
						</div>
						<Button
							onClick={verifyOTP}
							disabled={input.length < 6 || loading || updating}
							className="ml-2 min-w-[200px]">
							{loading ? (
								<Loader className="w-6 h-6 animate-spin" />
							) : (
								"Verify Account"
							)}
						</Button>
					</div>
				</div>
			</main>
		</div>
	);
}
