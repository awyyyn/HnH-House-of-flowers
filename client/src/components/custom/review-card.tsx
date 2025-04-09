import { Review } from "@/types";
import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function ReviewCard(review: Review) {
	const normalizedRating = Math.min(Math.max(0, review.rating), 5);
	return (
		<div className=" max-w-[300px] md:max-w-[400px] flex flex-col justify-between rounded-lg border bg-background p-6 shadow-sm">
			<div className="space-y-4 flex flex-col justify-between h-full ">
				<p className="text-muted-foreground">"{review.comment}"</p>
				<div className="flex items-center">
					{[...Array(5)].map((_, index) => (
						<Star
							key={index}
							className={`w-4 h-4 ${
								index < normalizedRating
									? "text-yellow-400 fill-yellow-400"
									: "text-gray-300"
							}`}
						/>
					))}
					<span className="ml-2 text-sm text-gray-600">
						{normalizedRating} out of {5}
					</span>
				</div>
			</div>
			<div className="mt-6 flex items-center gap-4">
				<div className="h-10 w-10 rounded-full bg-muted">
					<Avatar>
						<AvatarImage src={review.user.photo} />
						<AvatarFallback>
							{review.user.firstName?.charAt(0)}
							{review.user.lastName?.charAt(0)}
						</AvatarFallback>
					</Avatar>
				</div>
				<div>
					<p className="text-sm font-medium capitalize">
						{review.user.firstName} {review.user.lastName}
					</p>
					<p className="text-xs text-muted-foreground">Verified Customer</p>
				</div>
			</div>
		</div>
	);
}
