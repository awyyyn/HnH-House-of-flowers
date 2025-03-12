import * as React from "react";
import {
	Bell,
	Cog,
	Flower,
	Flower2,
	LayoutDashboard,
	LifeBuoy,
	MessagesSquare,
	Package,
	Send,
	UserCog,
	Users,
} from "lucide-react";

import { NavMain } from "@/components/custom/nav-main";

import { NavSecondary } from "@/components/custom/nav-secondary";
import { NavUser } from "@/components/custom/nav-user";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts";
import { NavSystem } from "./nav-projects";

const data = {
	navMain: [
		{
			title: "Dashboard",
			url: "/dashboard",
			icon: LayoutDashboard,
			isActive: true,
		},
		{
			title: "Products",
			url: "#",
			icon: Flower,
			items: [
				{
					title: "Add",
					url: "/products/add-product",
				},
				{
					title: "List",
					url: "/products",
				},
			],
		},
		{
			title: "Orders",
			url: "#",
			icon: Package,
			items: [
				{
					title: "Add",
					url: "/orders/add",
				},
				{
					title: "List",
					url: "/orders",
				},
				{
					title: "Pre-Orders",
					url: "/orders/pre-orders",
				},
			],
		},

		{
			title: "Bouquet Items",
			url: "#",
			icon: Flower2,
			items: [
				{
					title: "Add Item",
					url: "/bouquet-items/add-item",
				},
				{
					title: "List",
					url: "/bouquet-items",
				},
				{
					title: "Orders",
					url: "/bouquet-items/orders",
				},
			],
		},
	],
	navSecondary: [
		{
			title: "Support",
			url: "#",
			icon: LifeBuoy,
		},
		{
			title: "Feedback",
			url: "#",
			icon: Send,
		},
	],
	systems: [
		{
			title: "Users",
			url: "/users",
			icon: Users,
		},
		{
			title: "Messages",
			url: "/messages",
			icon: MessagesSquare,
		},
		{
			title: "Notifications",
			url: "/notifications",
			icon: Bell,
		},
		{
			title: "Admins",
			url: "#",
			icon: UserCog,
			isSuperAdmin: true,
			items: [
				{
					title: "Add",
					url: "/admins/add-admin",
				},
				{
					title: "List",
					url: "/admins",
				},
			],
		},
		{
			title: "Settings",
			url: "/settings",
			icon: Cog,
			// items: [
			// 	{
			// 		title: "General",
			// 		url: "#",
			// 	},
			// 	{
			// 		title: "Team",
			// 		url: "#",
			// 	},
			// 	{
			// 		title: "Billing",
			// 		url: "#",
			// 	},
			// 	{
			// 		title: "Limits",
			// 		url: "#",
			// 	},
			// ],
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { role } = useAuth();

	return (
		<Sidebar variant="inset" {...props} className="z-[] ">
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild>
							<a href="#">
								<div className="flex bg-primary aspect-square size-8 items-center dark:bg-primary justify-center rounded-lg   text-sidebar-primary-foreground">
									<Flower className="size-4 " />
								</div>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-semibold">HnH</span>
									<span className="truncate text-xs">House of Flowers</span>
								</div>
							</a>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMain role={role} items={data.navMain} />
				<NavSystem role={role} systems={data.systems} />
				<NavSecondary items={data.navSecondary} className="mt-auto" />
			</SidebarContent>
			<SidebarFooter>
				<NavUser />
			</SidebarFooter>
		</Sidebar>
	);
}
