import * as React from "react";
import { Moon, Sun, type LucideIcon } from "lucide-react";

import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import {
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { useTheme } from "@/contexts";

export function NavSecondary({
	items,
	...props
}: {
	items: {
		title: string;
		url: string;
		icon: LucideIcon;
	}[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
	const { isMobile } = useSidebar();
	const { setTheme, theme } = useTheme();

	return (
		<SidebarGroup {...props}>
			<SidebarGroupContent>
				<SidebarMenu>
					{items.map((item) => (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton asChild size="sm">
								<a href={item.url}>
									<item.icon />
									<span>{item.title}</span>
								</a>
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
					<SidebarMenuItem>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<SidebarMenuButton
									size="sm"
									className="capitalize data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
									{theme === "dark" ? <Moon /> : <Sun />}
									{theme === "dark" ? "Dark" : "Light"} mode
								</SidebarMenuButton>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								className="w-[--radix-dropdown-menu-trigger-width] min-w-56 p-2 rounded-lg"
								side={isMobile ? "bottom" : "right"}
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
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}
