import { Button } from "../ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import { useTheme } from "@/contexts";
import { Moon, Sun } from "lucide-react";
import { SidebarMenuButton } from "../ui/sidebar";

export default function ThemeSwitcher({
	showLabel = false,
	isMobile = false,
	isAdmin = false,
}: {
	showLabel?: boolean;
	isMobile?: boolean;
	isAdmin?: boolean;
}) {
	const { setTheme, theme } = useTheme();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				{isAdmin ? (
					<SidebarMenuButton
						size="sm"
						className="capitalize data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
						{" "}
						{theme === "dark" ? <Moon /> : <Sun />}
						{showLabel ? (theme === "dark" ? "Dark mode" : "Light mode") : null}
					</SidebarMenuButton>
				) : (
					<Button
						size="sm"
						variant="ghost"
						className="capitalize data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
						{theme === "dark" ? <Moon /> : <Sun />}
						{showLabel ? (theme === "dark" ? "Dark mode" : "Light mode") : null}
					</Button>
				)}
			</DropdownMenuTrigger>
			<DropdownMenuContent
				className="w-[--radix-dropdown-menu-trigger-width] min-w-56 p-2 rounded-lg z-[99]"
				side={isMobile ? "right" : "bottom"}
				align="end"
				sideOffset={4}>
				<DropdownMenuLabel className="p-0 font-normal text-sm">
					Theme
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem
						onClick={() => setTheme("light")}
						className="text-sm  flex items-center gap-2 cursor-pointer dark:hover:bg-primary/10 p-2">
						<Sun className="h-4 w-4" />
						Light
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => setTheme("dark")}
						className="text-sm  flex items-center gap-2 cursor-pointer dark:hover:bg-primary/10 p-2">
						<Moon className="h-4 w-4" />
						Dark
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
