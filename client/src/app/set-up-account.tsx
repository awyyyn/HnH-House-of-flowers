import { Button } from "@/components";
import AccountInformation from "@/components/custom/account-information";
import { useAuth } from "@/contexts";
import { useNavigate } from "react-router-dom";

export default function SetUpAccount() {
	const { logout } = useAuth();
	const navigate = useNavigate();

	return (
		<div className="min-h-screens pb-20 overscroll-y-auto">
			<header className=" w-screen flex pt-5 px-2 sm:px-5 justify-end">
				<Button
					onClick={() => {
						logout();
						navigate("/auth/login");
					}}>
					Logout
				</Button>
			</header>
			<main className="mt-10  px-2  flex justify-center items-center">
				<div className="w-full  sm:max-w-[400px] md:min-w-[80%]">
					<AccountInformation setUp />
				</div>
			</main>
		</div>
	);
}
