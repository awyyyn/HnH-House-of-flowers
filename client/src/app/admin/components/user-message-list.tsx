import { MessagingSkeletonLayoutLoading } from "@/app/skeletons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components";
import { GET_USERS_BY_MESSAGE_QUERY } from "@/queries";
import { User } from "@/types";
import { useQuery } from "@apollo/client";
import { Link } from "react-router-dom";

export default function UserMessageList() {
	const { data, loading } = useQuery(GET_USERS_BY_MESSAGE_QUERY);

	if (loading) return <MessagingSkeletonLayoutLoading />;
	return (
		<div className="space-y-2">
			{/* {JSON.stringify(data)} */}
			{data.adminMessages.data.length > 0 ? (
				data.adminMessages.data.map((user: User, index: number) => (
					<Link
						to={`/messages/${user.id}`}
						state={{ user }}
						key={`user-message-${user.id}-${index}`}
						className="px-2 py-4  relative overflow-hidden dark:bg-primary/5 bg-slate-100 cursor-pointer flex gap-2 items-center">
						<div className="  ">
							<Avatar>
								<AvatarImage src={user.photo} />
								<AvatarFallback className="capitalize">
									{user?.firstName && user?.lastName
										? `${user.firstName[0]}${user.lastName[0]}`
										: "U"}
								</AvatarFallback>
							</Avatar>
						</div>
						<div className="space-y-0">
							<p className="leading-none text-md font-medium">
								{user?.firstName} {user?.lastName}
							</p>
							<p className="text-sm leading-none">{user.email}</p>
						</div>
					</Link>
				))
			) : (
				<div className="text-center py-4 text-muted-foreground">
					No messages yet.
				</div>
			)}
		</div>
	);
}
