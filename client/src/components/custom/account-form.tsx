import { Helmet, Tabs, TabsContent, TabsList, TabsTrigger } from "@/components";
import AccountInformation from "./account-information";
import ChangeEmail from "./change-email";
import ChangePassword from "./change-password";

export function AccountForm() {
	return (
		<>
			<Helmet title="Account" />
			<Tabs defaultValue="account" className="w-full  gap-2 ">
				<TabsList className=" overflow-x-auto  rounded-none pb-2 md:pb-0   flex  h-auto items-start mt-2 bg-transparent  ">
					<TabsTrigger
						className="w-full min-w-fit md:max-w-[250px] md:min-w-[250px] py-3  text-left  data-[state=active]:text-white"
						value="account">
						Account
					</TabsTrigger>
					<TabsTrigger
						className="w-full min-w-fit md:max-w-[250px] md:min-w-[250px] py-3  text-left  data-[state=active]:text-white"
						value="email">
						Change Email
					</TabsTrigger>
					<TabsTrigger
						className="w-full min-w-fit md:max-w-[250px] md:min-w-[250px] py-3  text-left  data-[state=active]:text-white"
						value="password">
						Change Password
					</TabsTrigger>
				</TabsList>
				<TabsContent
					value="account"
					className="my-auto min-h-[calc(1s00dvh-20dvh)] pt-[10vsh]  ">
					<AccountInformation />
				</TabsContent>
				<TabsContent
					value="email"
					className="my-auto min-h-[calc(100dvsh-20dvh)] pt-[10vh]  ">
					<ChangeEmail />
				</TabsContent>
				<TabsContent
					value="password"
					className="my-auto min-h-[calc(100sdvh-20dvh)] pt-[10vh]  ">
					<ChangePassword />
				</TabsContent>
			</Tabs>
		</>
	);
}
