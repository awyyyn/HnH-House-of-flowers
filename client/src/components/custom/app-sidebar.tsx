import * as React from "react";
import {
	BookOpen,
	Flower,
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
			title: "Users",
			url: "/users",
			icon: Users,
		},
		{
			title: "Pre-Orders",
			url: "/pre-orders",
			icon: BookOpen,
		},
		{
			title: "Orders",
			url: "/orders",
			icon: Package,
		},
		{
			title: "Messages",
			url: "/messages",
			icon: MessagesSquare,
		},
		{
			title: "Bouquets",
			url: "#",
			icon: MessagesSquare,
			items: [
				{
					title: "Add Item",
					url: "/bouquet-items/add-item",
				},
				{
					title: "Customize Orders",
					url: "/bouquet-items/customize-orders",
				},
				{
					title: "List",
					url: "/bouquet-items",
				},
			],
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
		// {
		// 	title: "Notifications",
		// 	url: "/notifications",
		// 	icon: Bell,
		// },
		// {
		// 	title: "Settings",
		// 	url: "#",
		// 	icon: Settings2,
		// 	items: [
		// 		{
		// 			title: "General",
		// 			url: "#",
		// 		},
		// 		{
		// 			title: "Team",
		// 			url: "#",
		// 		},
		// 		{
		// 			title: "Billing",
		// 			url: "#",
		// 		},
		// 		{
		// 			title: "Limits",
		// 			url: "#",
		// 		},
		// 	],
		// },
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
	// projects: [
	// 	{
	// 		name: "Design Engineering",
	// 		url: "#",
	// 		icon: Frame,
	// 	},
	// 	{
	// 		name: "Sales & Marketing",
	// 		url: "#",
	// 		icon: PieChart,
	// 	},
	// 	{
	// 		name: "Travel",
	// 		url: "#",
	// 		icon: Map,
	// 	},
	// ],
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
								<div className="flex aspect-square size-8 items-center dark:bg-primary justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
									<Flower className="size-4" />
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
				{/* <NavProjects projects={data.projects} /> */}
				<NavSecondary items={data.navSecondary} className="mt-auto" />
			</SidebarContent>
			<SidebarFooter>
				<NavUser />
			</SidebarFooter>
		</Sidebar>
	);
}
