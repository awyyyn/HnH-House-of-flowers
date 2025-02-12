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
import { Outlet, useLocation } from "react-router-dom";

export default function AdminLayout({
	children,
}: {
	children?: React.ReactNode;
}) {
	const { pathname } = useLocation();

	const paths = pathname
		.split("/")
		.filter((path) => path !== "/" && path !== "");

	return (
		<SidebarProvider>
			<Suspense fallback={<h1>loading...</h1>}>
				<AppSidebar />
			</Suspense>
			<main className="mx-auto bg-white dark:bg-zinc-950 w-full relative max-h-[100dvh] h-[100dvh] ">
				<header className="flex z-[99] shadow-sm h-16 sticky top-0 backdrop-blur-md bg-white/40 dark:bg-zinc-900 shrink-0 items-center gap-2">
					<div className="flex items-center gap-2 px-4">
						<SidebarTrigger className="md:hidden block -ml-1" />
						<Separator
							orientation="vertical"
							className="md:hidden block mr-2 h-4"
						/>
						<Breadcrumb>
							<BreadcrumbList>
								{paths.map((path, index) => {
									const pathName = path.split("-").join(" ");
									const isLast = index === paths.length - 1;
									if (isLast) {
										return (
											<BreadcrumbItem key={`${path}-${index}`}>
												<BreadcrumbPage className="capitalize">
													{pathName}
												</BreadcrumbPage>
											</BreadcrumbItem>
										);
									} else {
										return (
											<>
												<BreadcrumbItem
													key={`item-${path}-${index}`}
													className="hidden md:block capitalize">
													<BreadcrumbLink href="#">{pathName}</BreadcrumbLink>
												</BreadcrumbItem>
												<BreadcrumbSeparator
													key={`separator-${path}-${index}`}
													className="hidden md:block capitalize"
												/>
											</>
										);
									}
								})}
							</BreadcrumbList>
						</Breadcrumb>
					</div>
				</header>
				<div className="p-2 md:p-4  ">{children ? children : <Outlet />}</div>
			</main>
		</SidebarProvider>
	);
}
