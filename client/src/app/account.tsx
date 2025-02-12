import { useAuth } from "@/contexts";
import { AdminLayout, UserLayout } from "@/layouts";
import { AccountForm } from "../components/custom/account-form";

export default function Account() {
	const { role } = useAuth();

	if (role === "USER") {
		return (
			<UserLayout>
				<AccountForm />
			</UserLayout>
		);
	} else {
		return (
			<AdminLayout>
				<AccountForm />
			</AdminLayout>
		);
	}
}
