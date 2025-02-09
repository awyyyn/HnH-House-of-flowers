import { useState } from "react";
import {
	Button,
	HoveredLink,
	Menu,
	MenuItem,
	ProductItem,
	TextGenerateEffect,
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from "@/components";
import { cn } from "@/lib/utils";
import { ChevronDown, LogOut, Settings, User } from "lucide-react";
import { UserDrawer } from "./user-drawer";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

export function Navbar({ className }: { className?: string }) {
	const [active, setActive] = useState<string | null>(null);
	const { isAuthenticated, logout, role } = useAuth();

	return (
		<div className="container -translate-x-[50%] left-[50%] fixed top-2 md:top-5 flex items-center  justify-between z-50 px-2 md:px-0  ">
			<div className="flex   items-center gap-2 justify-between  w-full md:w-auto backdrop-blur-lg bg-white/80 py-3 px-4 rounded-full">
				<div className="flex items-center gap-2">
					{role === "USER" && (
						<div
							className={`${isAuthenticated ? "block md:hidden" : "hidden"}`}>
							<UserDrawer />
						</div>
					)}
					<TextGenerateEffect className="text-lg  " words="House of Flowers" />
				</div>
				{!isAuthenticated && (
					<div className="flex items-center gap-1">
						<Button size="sm" className="block md:hidden ">
							Sign In
						</Button>
						<Button
							size="sm"
							className="block md:hidden  transition-all duration-300 text-primary border-primary hover:bg-primary hover:text-white"
							variant="outline">
							Sign Up
						</Button>
					</div>
				)}
			</div>
			<div
				className={cn(
					" inset-x-0 max-w-2xl   mx-auto hidden md:block ",
					className
				)}>
				<Menu setActive={setActive}>
					<MenuItem setActive={setActive} active={active} item="Services">
						<div className="flex flex-col space-y-4 text-sm">
							<HoveredLink href="/web-dev">Web Development</HoveredLink>
							<HoveredLink href="/interface-design">
								Interface Design
							</HoveredLink>
							<HoveredLink href="/seo">Search Engine Optimization</HoveredLink>
							<HoveredLink href="/branding">Branding</HoveredLink>
						</div>
					</MenuItem>
					<MenuItem setActive={setActive} active={active} item="Products">
						<div className="  text-sm grid grid-cols-2 gap-10 p-4">
							<ProductItem
								title="Algochurn"
								href="https://algochurn.com"
								src="https://assets.aceternity.com/demos/algochurn.webp"
								description="Prepare for tech interviews like never before."
							/>
							<ProductItem
								title="Tailwind Master Kit"
								href="https://tailwindmasterkit.com"
								src="https://assets.aceternity.com/demos/tailwindmasterkit.webp"
								description="Production ready Tailwind css components for your next project"
							/>
							<ProductItem
								title="Moonbeam"
								href="https://gomoonbeam.com"
								src="https://assets.aceternity.com/demos/Screenshot+2024-02-21+at+11.51.31%E2%80%AFPM.png"
								description="Never write from scratch again. Go from idea to blog in minutes."
							/>
							<ProductItem
								title="Rogue"
								href="https://userogue.com"
								src="https://assets.aceternity.com/demos/Screenshot+2024-02-21+at+11.47.07%E2%80%AFPM.png"
								description="Respond to government RFPs, RFIs and RFQs 10x faster using AI"
							/>
						</div>
					</MenuItem>
					<MenuItem setActive={setActive} active={active} item="Pricing">
						<div className="flex flex-col space-y-4 text-sm">
							<HoveredLink href="/hobby">Hobby</HoveredLink>
							<HoveredLink href="/individual">Individual</HoveredLink>
							<HoveredLink href="/team">Team</HoveredLink>
							<HoveredLink href="/enterprise">Enterprise</HoveredLink>
						</div>
					</MenuItem>
				</Menu>
			</div>
			<div className="hidden md:flex items-center gap-2 p-2 rounded-full backdrop-blur-lg bg-white/80">
				{!isAuthenticated ? (
					<div className="md:flex gap-2 px-4 items-center hidden ">
						<Link to="/auth/login">
							<Button>Sign In</Button>
						</Link>

						<Link to="/auth/register">
							<Button
								className="transition-all duration-300 text-primary border-primary hover:bg-primary hover:text-white"
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
							<DropdownMenuItem>
								<User />
								<span>Profile</span>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Settings />
								<span>Settings</span>
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
