import { useState } from "react";
import {
	Button,
	Menu,
	MenuItem,
	ProductItem,
	TextGenerateEffect,
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	Badge,
} from "@/components";
import { cn } from "@/lib/utils";
import {
	ChevronDown,
	LogOut,
	MessageCircle,
	ShoppingBag,
	User,
} from "lucide-react";
import { UserDrawer } from "./user-drawer";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import ThemeSwitcher from "@/components/custom/theme-switcher";
import { useAtomValue } from "jotai";
import { cartAtom } from "@/states";

export function Navbar({ className }: { className?: string }) {
	const [active, setActive] = useState<string | null>(null);
	const { isAuthenticated, logout, role } = useAuth();
	const cart = useAtomValue(cartAtom);

	return (
		<div className="container -translate-x-[50%] left-[50%] fixed top-2 md:top-5 flex items-center  justify-between z-50 px-2 md:px-0  ">
			<div className="flex   items-center gap-2 dark:bg-black dark:border dark:border-zinc-800 justify-between  w-full md:w-auto backdrop-blur-lg bg-white/80 py-3 px-4 rounded-full">
				<div className="flex items-center gap-2">
					{role === "USER" && (
						<div
							className={`${isAuthenticated ? "block md:hidden" : "hidden"}`}>
							<UserDrawer />
						</div>
					)}
					<Link to="/">
						<TextGenerateEffect
							className="text-lg  "
							words="House of Flowers"
						/>
					</Link>
				</div>
				{!isAuthenticated && (
					<div className="flex md:hidden items-center gap-1">
						<Link to="/auth/login">
							<Button size="sm">Sign In</Button>
						</Link>

						<Link to="/auth/register">
							<Button
								size="sm"
								className="transition-all duration-300 text-primary border-primary hover:bg-primary dark:text-white dark:hover:bg-transparent hover:text-white"
								variant="outline">
								Sign Up
							</Button>
						</Link>
					</div>
				)}
			</div>
			<div
				className={cn(
					" inset-x-0 max-w-2xl   mx-auto hidden md:block ",
					className
				)}>
				<Menu setActive={setActive}>
					<Link to={"/"}>
						<MenuItem setActive={setActive} active={null} item="Home" />
					</Link>
					<Link to={"/customize"}>
						<MenuItem setActive={setActive} active={null} item="Customize" />
					</Link>
					<MenuItem setActive={setActive} active={active} item="Products">
						<div className="text-sm grid grid-cols-2 gap-10 p-4 z-[101]">
							<ProductItem
								title="Flowers"
								href="/flowers"
								src="https://images.pexels.com/photos/697259/pexels-photo-697259.jpeg?cs=srgb&dl=pexels-hieu-697259.jpg&fm=jpg"
								description="Browse our fresh and beautiful flowers for every occasion."
							/>
							<ProductItem
								title="Bouquets"
								href="/bouquets"
								src="https://www.floretflowers.com/wp-content/uploads/2016/02/Floret_Market-Bouquets-14.jpg"
								description="Discover our artfully arranged bouquets perfect for gifts and celebrations."
							/>
							<ProductItem
								title="Chocolates"
								href="/chocolates"
								src="https://www.thespruceeats.com/thmb/FhHcgQni8lgV0griUeDJMTAszxI=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/chocolate_hero1-d62e5444a8734f8d8fe91f5631d51ca5.jpg"
								description="Indulge in our premium quality chocolates, a sweet treat for any moment."
							/>
							<ProductItem
								title="Gifts"
								href="/gifts"
								src="https://www.realsimple.com/thmb/1nO0GmEuF87RSxFBmTWtfo6TZW0=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/the-best-gift-giver-GettyImages-1706575747-2089a300e6594496b7f558585a4baefb.jpg"
								description="Shop unique and thoughtful gifts to make every celebration memorable."
							/>
						</div>
					</MenuItem>
				</Menu>
			</div>
			<div className="hidden pl-5 dark:bg-black dark:border dark:border-zinc-800 md:flex items-center gap-2 p-2 rounded-full backdrop-blur-lg bg-white/80">
				{isAuthenticated && role === "USER" && (
					<>
						<Button
							size="icon"
							variant="ghost"
							className="rounded-full"
							asChild>
							<Link to="/chat">
								<MessageCircle />
							</Link>
						</Button>
						<Button
							size="icon"
							variant="ghost"
							asChild
							className="rounded-full">
							<Link to="/cart" className="relative ">
								{cart.items.length > 0 && (
									<Badge
										variant="default"
										className="absolute text-[8px] bottom-1.5 right-1.5 p-0 py-0 h-3 w-3 justify-center rounded-full">
										{cart.items.length}
									</Badge>
								)}
								<ShoppingBag />
							</Link>
						</Button>
					</>
				)}
				<ThemeSwitcher />
				{!isAuthenticated ? (
					<div className="md:flex gap-2 px-4 items-center hidden ">
						<Link to="/auth/login">
							<Button>Sign In</Button>
						</Link>

						<Link to="/auth/register">
							<Button
								className="transition-all duration-300 text-primary border-primary hover:bg-primary dark:text-white dark:hover:bg-transparent hover:text-white"
								variant="outline">
								Sign Up
							</Button>
						</Link>
					</div>
				) : role === "USER" ? (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="hover:bg-transparent">
								Account
								<ChevronDown />
							</Button>
							{/* <Avatar className="bg-primary/80 flex items-center justify-center">
							<AvatarImage src="https://github.com/shadcn.pngs" alt="avatar" />
							<AvatarFallback className="text-white">U</AvatarFallback>
						</Avatar> */}
						</DropdownMenuTrigger>
						<DropdownMenuContent className="mr-5 mt-2">
							<DropdownMenuItem asChild>
								<Link to="/account">
									<User />
									<span>Profile</span>
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem onClick={logout}>
								<LogOut />
								<span>Log out</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				) : (
					<Link to="/dashboard">
						<Button>Dashboard</Button>
					</Link>
				)}
			</div>
		</div>
	);
}
