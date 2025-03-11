import { ChevronRight, type LucideIcon } from "lucide-react";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuAction,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "../ui/collapsible";
import { Link } from "react-router-dom";
import { UserRole } from "@/types";

export function NavSystem({
	systems,
	role,
}: {
	systems: {
		title: string;
		url: string;
		icon: LucideIcon;
		isSuperAdmin?: boolean;
		isActive?: boolean;
		items?: {
			title: string;
			url: string;
			icon?: LucideIcon;
		}[];
	}[];
	role: UserRole | null;
}) {
	// const { isMobile } = useSidebar();

	return (
		<SidebarGroup>
			<SidebarGroupLabel>System</SidebarGroupLabel>
			<SidebarMenu>
				{systems.map((item) => {
					return (
						<Collapsible
							key={item.title}
							asChild
							className={`${
								item.isSuperAdmin && role === "ADMIN" ? "hidden" : "block"
							}`}
							defaultOpen={item.isActive}>
							<SidebarMenuItem>
								{/* {item.isSuperAdmin && role === "super_admin" ? () : } */}

								<SidebarMenuButton asChild tooltip={item.title}>
									<Link to={item.url}>
										<item.icon />
										<span>{item.title}</span>
									</Link>
								</SidebarMenuButton>

								{item.items?.length ? (
									<>
										<CollapsibleTrigger asChild>
											<SidebarMenuAction className="data-[state=open]:rotate-90">
												<ChevronRight />
												<span className="sr-only">Toggle</span>
											</SidebarMenuAction>
										</CollapsibleTrigger>
										<CollapsibleContent>
											<SidebarMenuSub>
												{item.items?.map((subItem) => (
													<SidebarMenuSubItem key={subItem.title}>
														<SidebarMenuSubButton asChild>
															<Link to={subItem.url}>
																<span>{subItem.title}</span>
															</Link>
														</SidebarMenuSubButton>
													</SidebarMenuSubItem>
												))}
											</SidebarMenuSub>
										</CollapsibleContent>
									</>
								) : null}
							</SidebarMenuItem>
						</Collapsible>
					);
				})}
			</SidebarMenu>
		</SidebarGroup>
	);
}
