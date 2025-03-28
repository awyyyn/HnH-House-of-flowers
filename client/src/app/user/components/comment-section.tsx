import React from "react";
import { Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Review } from "@/types";

type ReviewComponentProps = {
	reviews: Review[];
};

const ProductReviewComponent: React.FC<ReviewComponentProps> = ({
	reviews = [],
}) => {
	// Calculate average rating
	const averageRating =
		reviews.length > 0
			? (
					reviews.reduce((sum, review) => sum + review.rating, 0) /
					reviews.length
			  ).toFixed(1)
			: "0.0";

	// Render star rating
	const renderStars = (rating: number) => {
		return [...Array(5)].map((_, index) => (
			<Star
				key={index}
				className={`h-5 w-5 ${
					index < rating ? "text-yellow-500" : "text-gray-300"
				}`}
				fill={index < rating ? "currentColor" : "none"}
			/>
		));
	};

	// Get user's initials
	const getUserInitials = (user: Review["user"]) => {
		return `${(user?.firstName || "U").charAt(0)}${(
			user?.lastName || "A"
		).charAt(0)}`;
	};

	return (
		<Card className="w-full shadow-none border-none  mx-auto">
			<CardHeader>
				<CardTitle className="flex justify-between items-center">
					<span>Customer Reviews</span>
					<div className="flex items-center">
						<div className="flex mr-2">
							{renderStars(Math.round(parseFloat(averageRating)))}
						</div>
						<span className="text-sm text-muted-foreground">
							{averageRating} out of 5 ({reviews.length} reviews)
						</span>
					</div>
				</CardTitle>
			</CardHeader>
			<CardContent>
				{reviews.length === 0 ? (
					<p className="text-muted-foreground text-center">No reviews yet</p>
				) : (
					<div className="space-y-4">
						{reviews.map((review) => (
							<div key={review.id} className="border-b pb-4 last:border-b-0">
								<div className="flex justify-between items-center">
									<div className="flex items-center mb-3">
										<Avatar className="mr-4">
											<AvatarFallback>
												{getUserInitials(review.user)}
											</AvatarFallback>
										</Avatar>
										<div>
											<div className="flex items-center ">
												<span className="font-medium mr-2">
													{review.user.firstName} {review.user.lastName}
												</span>
											</div>
											<p className="text-sm text-gray-500">Verified Customer</p>
										</div>
									</div>

									<div className="flex">{renderStars(review.rating)}</div>
								</div>
								<p className="text-muted-foreground mb-3 px-2">
									{review.comment}
								</p>
							</div>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
};

export default ProductReviewComponent;
