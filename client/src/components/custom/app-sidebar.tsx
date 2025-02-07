import * as React from "react";
import {
	Bell,
	BookOpen,
	Flower,
	LayoutDashboard,
	LifeBuoy,
	Package,
	Send,
	Settings2,
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

const data = {
	user: {
		name: "shadcn",
		email: "m@example.com",
		avatar: "/avatars/shadcn.jpg",
	},
	navMain: [
		{
			title: "Dashboard",
			url: "/dashboard",
			icon: LayoutDashboard,
			isActive: true,
		},
		{
			title: "Flowers",
			url: "#",
			icon: Flower,
			items: [
				{
					title: "Add",
					url: "/products/add",
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
			title: "Notifications",
			url: "/notifications",
			icon: Bell,
		},
		{
			title: "Settings",
			url: "#",
			icon: Settings2,
			items: [
				{
					title: "General",
					url: "#",
				},
				{
					title: "Team",
					url: "#",
				},
				{
					title: "Billing",
					url: "#",
				},
				{
					title: "Limits",
					url: "#",
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
	return (
		<Sidebar variant="inset" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild>
							<a href="#">
								<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
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
				<NavMain items={data.navMain} />
				{/* <NavProjects projects={data.projects} /> */}
				<NavSecondary items={data.navSecondary} className="mt-auto" />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={data.user} />
			</SidebarFooter>
		</Sidebar>
	);
}
