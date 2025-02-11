import { Button } from "@/components";
import AccountInformation from "@/components/custom/account-information";
import { useAuth } from "@/contexts";
import { useNavigate } from "react-router-dom";

export default function SetUpAccount() {
	const { logout } = useAuth();
	const navigate = useNavigate();

	return (
		<div className="">
			<header className="fixed top-0 left-0 w-screen flex pt-5 px-2 sm:px-5 justify-end">
				<Button
					onClick={() => {
						logout();
						navigate("/auth/login");
					}}>
					Logout
				</Button>
			</header>
			<main className="h-screen px-2 w-screen flex justify-center items-center">
				<div className="w-full  sm:max-w-[400px] md:min-w-[80%]">
					<AccountInformation setUp />
				</div>
			</main>
		</div>
	);
}
