import { useState } from "react";
import {
	Avatar,
	AvatarImage,
	Button,
	HoveredLink,
	Menu,
	MenuItem,
	ProductItem,
	TextGenerateEffect,
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuGroup,
	DropdownMenuSeparator,
	DropdownMenuItem,
} from "@/components";
import { cn } from "@/lib/utils";
import { IconPlant2, IconShoppingBag } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { Keyboard, LogOut, Settings, User } from "lucide-react";

export function Navbar({ className }: { className?: string }) {
	const [active, setActive] = useState<string | null>(null);
	return (
		<div className="container -translate-x-[50%] left-[50%] fixed top-5 flex items-center px-2 justify-between z-50 w-full  ">
			<div className="flex items-center gap-2 backdrop-blur-lg bg-white/80 py-3 px-4 rounded-full">
				<Button className="block text-3xl md:hidden">
					<IconPlant2 size={30} />
				</Button>
				<TextGenerateEffect
					className="text-lg hidden md:block"
					words="House of Flowers"
				/>
				<TextGenerateEffect className="text-md block md:hidden" words="H&H" />
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
			<div className="flex items-center gap-2 p-1 px-3 rounded-full backdrop-blur-lg bg-white/80">
				{/* <Button>Sign In</Button>
				<Button
					className="transition-all duration-300 text-primary border-primary hover:bg-primary hover:text-white"
					variant="outline">
					Sign Up
				</Button> */}
				<Link
					to="/cart"
					// variant="ghost"
					// size="icon"
					className="text-3xl   hover:bg-white/30 rounded-full  cursor-pointer">
					<IconShoppingBag className="p-2 text-2xl" size={45} />
				</Link>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Avatar className="bg-primary/80 flex items-center justify-center">
							<AvatarImage src="https://github.com/shadcn.pngs" alt="avatar" />
							<AvatarFallback className="text-white">U</AvatarFallback>
						</Avatar>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="">
						<DropdownMenuLabel>My Account</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem>
								<User />
								<span>Profile</span>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Settings />
								<span>Settings</span>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<LogOut />
								<span>Log out</span>
							</DropdownMenuItem>
						</DropdownMenuGroup>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	);
}
