import { Bell, Package, X } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Button,
	Badge,
} from "@/components";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts";
import { AdminLayout, UserLayout } from "@/layouts";
import { useAtom } from "jotai";
import { notificationAtom } from "@/states";
import { Notification, NotificationType } from "@/types";
import { useMutation } from "@apollo/client";
import {
	DELETE_NOTIFICATION_MUTATION,
	UPDATE_NOTIFICATION_MUTATION,
} from "@/queries";
import { useNavigate } from "react-router-dom";

function NotificationPanel() {
	const [notifications, setNotifications] = useAtom(notificationAtom);
	const [updateNotification, { loading }] = useMutation(
		UPDATE_NOTIFICATION_MUTATION
	);
	const { user } = useAuth();
	const navigate = useNavigate();
	const [deleteNotification, { loading: deleting }] = useMutation(
		DELETE_NOTIFICATION_MUTATION
	);

	const unreadCount = notifications.filter((n) => !n.read).length;

	const markAsRead = async (id: string) => {
		try {
			await updateNotification({ variables: { id } });
			setNotifications((prevNotifications) =>
				prevNotifications.map((n) => (n.id === id ? { ...n, read: true } : n))
			);
		} catch (err) {
			console.log(err);
		}
	};

	const markAllAsRead = async () => {
		try {
			await updateNotification();
			setNotifications((prevNotifications) =>
				prevNotifications.map((n) => ({ ...n, read: true }))
			);
		} catch (err) {
			console.log(err);
		}
	};

	const removeNotification = async (id: string) => {
		try {
			await deleteNotification({ variables: { id } });
			setNotifications((prevNotifications) =>
				prevNotifications.filter((notification) => notification.id !== id)
			);
		} catch (err) {
			console.log(err);
		}
	};
	const handleNotificationClick = async (
		id: string,
		isRead: boolean,
		type: NotificationType,
		userId: string
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
				link = user.role === "USER" ? "/my-orders" : `/orders`;
			}

			navigate(link);
		} catch (err) {
			console.log(err);
		}
	};

	const getTypeIcon = (type: Notification["type"]) => {
		switch (type) {
			case "MESSAGE":
				return <Bell className="h-4 w-4 text-blue-500" />;
			// case "MESSAGE":
			// 	return <Clock className="h-4 w-4 text-amber-500" />;
			case "ORDER":
				return <Package className="h-4 w-4 text-green-500" />;
			case "PRE_ORDER":
				return <Package className="h-4 w-4 text-red-500" />;
		}
	};

	return (
		<Card className="w-full border-none shadow-none mb-5  ">
			<CardHeader className="flex  flex-row items-center justify-between pb-2 space-y-0">
				<div>
					<CardTitle className="text-xl">Notifications</CardTitle>
					<CardDescription>
						You have {unreadCount} unread notification
						{unreadCount !== 1 ? "s" : ""}
					</CardDescription>
				</div>
				{unreadCount > 0 && (
					<Button
						disabled={loading || deleting}
						variant="ghost"
						size="sm"
						onClick={markAllAsRead}
						className="text-xs">
						Mark all as read
					</Button>
				)}
			</CardHeader>
			<CardContent className="max-h-[78vh] overflow-auto">
				{notifications.length > 0 ? (
					<div className="space-y-4">
						{notifications.map((notification) => (
							<div
								onClick={() =>
									handleNotificationClick(
										notification.id,
										notification.read,
										notification.type,
										notification.userId
									)
								}
								key={notification.id}
								className={cn(
									"flex items-start gap-3 p-3 rounded-lg transition-colors",
									notification.read ? "bg-background" : "bg-muted"
								)}>
								<div className="mt-1">{getTypeIcon(notification.type)}</div>
								<div className="flex-1 space-y-1">
									<div className="flex items-center justify-between">
										<p className="font-medium text-sm">{notification.title}</p>
										<div className="flex items-center gap-1">
											{!notification.read && (
												<Badge variant="secondary" className="h-5 px-1.5">
													New
												</Badge>
											)}
											<Button
												disabled={loading || deleting}
												variant="ghost"
												size="icon"
												className="h-6 w-6"
												onClick={() => removeNotification(notification.id)}>
												<X className="h-3 w-3" />
												<span className="sr-only">Dismiss</span>
											</Button>
										</div>
									</div>
									<p className="text-sm text-muted-foreground">
										{notification.message}
									</p>
									<div className="flex items-center justify-between mt-2">
										<p className="text-xs text-muted-foreground">
											{notification.createdAt}
										</p>
										{!notification.read && (
											<Button
												disabled={loading || deleting}
												variant="ghost"
												size="sm"
												className="h-6 text-xs"
												onClick={() => markAsRead(notification.id)}>
												Mark as read
											</Button>
										)}
									</div>
								</div>
							</div>
						))}
					</div>
				) : (
					<div className="flex flex-col items-center justify-center py-8 text-center">
						<Bell className="h-10 w-10 text-muted-foreground mb-3" />
						<p className="text-muted-foreground">No notifications</p>
					</div>
				)}
			</CardContent>
		</Card>
	);
}

export default function NotificationPage() {
	const { role } = useAuth();

	if (role === "USER") {
		return (
			<UserLayout>
				<NotificationPanel />
			</UserLayout>
		);
	} else {
		return (
			<AdminLayout>
				<NotificationPanel />
			</AdminLayout>
		);
	}
}
