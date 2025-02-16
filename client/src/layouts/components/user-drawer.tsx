import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	Button,
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components";
import { useAuth } from "@/contexts";
import { Flower, LogOut } from "lucide-react";
import { Link } from "react-router-dom";

export function UserDrawer() {
	const { logout, user } = useAuth();

	const products = ["bouquets", "flowers", "chocolates", "gifts"];

	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button className="block text-3xl md:hidden group">
					<Flower className="group-hover:scale-125 group-active:scale-100 transition-transform duration-300" />
				</Button>
			</SheetTrigger>
			<SheetContent side="left" className="  ">
				<div className="relative min-h-full ">
					<SheetHeader>
						<SheetTitle>H&H - House of Flowers</SheetTitle>
						<SheetDescription>
							{/* Make changes to your profile here. Click save when you're done. */}
						</SheetDescription>
					</SheetHeader>

					<div className="py-5 space-y-2">
						<SheetClose asChild>
							<Button asChild className="w-full justify-start">
								<Link to="/">Home</Link>
							</Button>
						</SheetClose>
						<div>
							<p className="text-xs text-zinc-600 font-medium">Products</p>
							{products.map((product) => (
								<SheetClose asChild key={`sheet-${product}`}>
									<Button
										asChild
										key={`btn-${product}`}
										className="w-full justify-start capitalize">
										<Link to={product} key={`link-${product}`}>
											{product}
										</Link>
									</Button>
								</SheetClose>
							))}
						</div>
					</div>

					<SheetFooter className="absolute   bottom-5 w-full">
						<SheetClose asChild>
							<Button variant="destructive" type="button" onClick={logout}>
								<LogOut />
								Logout
							</Button>
						</SheetClose>

						<SheetClose asChild className="">
							<Button className="justify-start   my-2 px-0 " variant="ghost">
								<Avatar className="border h-8 w-8">
									<AvatarImage src={user?.photo} />
									<AvatarFallback>U</AvatarFallback>
								</Avatar>
								<div className="flex flex-col items-start justify-center">
									<p className="text-sm">{`${user?.firstName} ${user?.lastName}`}</p>
									<p className="text-xs text-zinc-600">{user?.email}</p>
								</div>
							</Button>
						</SheetClose>
					</SheetFooter>
				</div>
			</SheetContent>
		</Sheet>
	);
}
