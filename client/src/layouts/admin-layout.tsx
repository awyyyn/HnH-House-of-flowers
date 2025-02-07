import {
	AppSidebar,
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
	Separator,
} from "@/components";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
	return (
		<SidebarProvider>
			<Suspense fallback={<h1>loading...</h1>}>
				<AppSidebar />
			</Suspense>
			<main className="mx-auto bg-gray-100 w-full relative max-h-[100dvh] h-screen ">
				<header className="flex h-16 sticky top-0 backdrop-blur-md bg-white/40 shrink-0 items-center gap-2">
					<div className="flex items-center gap-2 px-4">
						<SidebarTrigger className="md:hidden block -ml-1" />
						<Separator
							orientation="vertical"
							className="md:hidden block mr-2 h-4"
						/>
						<Breadcrumb>
							<BreadcrumbList>
								<BreadcrumbItem className="hidden md:block">
									<BreadcrumbLink href="#">
										Building Your Application
									</BreadcrumbLink>
								</BreadcrumbItem>
								<BreadcrumbSeparator className="hidden md:block" />
								<BreadcrumbItem>
									<BreadcrumbPage>Data Fetching</BreadcrumbPage>
								</BreadcrumbItem>
							</BreadcrumbList>
						</Breadcrumb>
					</div>
				</header>
				<Outlet />
			</main>
		</SidebarProvider>
	);
}
