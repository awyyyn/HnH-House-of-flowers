"use client";

import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { notificationAtom } from "@/states";
import { useMutation, useSubscription } from "@apollo/client";
import { UPDATE_NOTIFICATION_MUTATION } from "@/queries";
import { NOTIFICATION_SENT_SUBSCRIPTION } from "@/queries/subscriptions";
import { useAuth } from "@/contexts";
import { NotificationType } from "@/types";

export function NotificationDropdown() {
	const { user } = useAuth();
	const navigate = useNavigate();
	const [notifications, setNotifications] = useAtom(notificationAtom);
	const [updateNotification, { loading }] = useMutation(
		UPDATE_NOTIFICATION_MUTATION
	);

	const unreadCount = notifications.filter((n) => !n.read).length;

	const markAllAsRead = async () => {
		try {
			await updateNotification();
			setNotifications(notifications.map((n) => ({ ...n, read: true })));
		} catch (err) {
			console.log(err);
		}
	};

	const handleNotificationClick = async (
		id: string,
		isRead: boolean,
		type: NotificationType,
		userId: string,
		toGoId: string
	) => {
		try {
			if (!isRead) {
				await updateNotification({ variables: { id } });
				setNotifications(
					notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
				);
			}
			let link = "/notifications";
			if (type === "MESSAGE") {
				link = user.role === "USER" ? "/chat" : `/messages/${userId}`;
			} else if (type === "ORDER") {
				link =
					user.role === "USER" ? `/my-orders?orderId=${toGoId}` : `/orders`;
			} else if (type === "REVIEW") {
				//
			}

			navigate(link);
		} catch (err) {
			console.log(err);
		}
	};

	useSubscription(NOTIFICATION_SENT_SUBSCRIPTION, {
		variables: {
			userId: user?.id,
			role: user?.role,
		},
		onData(data) {
			if (user?.role !== "USER" && data.data.data.notificationSent.toShop) {
				setNotifications([data.data.data.notificationSent, ...notifications]);
			}

			if (user?.role === "USER" && !data.data.data.notificationSent.toShop) {
				setNotifications([data.data.data.notificationSent, ...notifications]);
			}
		},
	});

	return (
		<DropdownMenu>
			<DropdownMenuTrigger disabled={loading} asChild>
				<Button
					disabled={loading}
					variant="ghost"
					size="icon"
					className="relative rounded-full">
					<Bell className="h-4 w-4" />
					{unreadCount > 0 && (
						<Badge
							variant="destructive"
							className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
							{unreadCount}
						</Badge>
					)}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-80">
				<div className="flex items-center justify-between p-2">
					<DropdownMenuLabel className="text-base">
						Notifications
					</DropdownMenuLabel>
					{unreadCount > 0 && (
						<Button
							variant="ghost"
							size="sm"
							onClick={markAllAsRead}
							className="text-xs h-7">
							Mark all as read
						</Button>
					)}
				</div>
				<DropdownMenuSeparator />
				{notifications.length > 0 ? (
					<>
						{notifications.slice(0, 5).map((notification) => (
							<DropdownMenuItem
								key={notification.id}
								className="flex flex-col items-start p-3 cursor-pointer"
								onClick={() =>
									handleNotificationClick(
										notification.id,
										notification.read,
										notification.type,
										notification.userId,
										notification.idToGo
									)
								}>
								<div className="flex items-start justify-between w-full">
									<p
										className={`text-sm ${
											notification.read ? "" : "font-medium"
										}`}>
										{notification.message}
									</p>
									{!notification.read && (
										<div className="h-2 w-2 rounded-full bg-blue-500 mt-1 ml-2" />
									)}
								</div>
								<p className="text-xs text-muted-foreground mt-1">
									{notification.createdAt}
								</p>
							</DropdownMenuItem>
						))}
						<DropdownMenuSeparator />
						<DropdownMenuItem
							asChild
							className="justify-center text-sm text-muted-foreground">
							<Link to="/notifications">View all notifications</Link>
						</DropdownMenuItem>
					</>
				) : (
					<div className="py-6 text-center">
						<p className="text-muted-foreground">No notifications</p>
					</div>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
