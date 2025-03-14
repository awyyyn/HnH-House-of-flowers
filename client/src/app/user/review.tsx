import { Link, useParams } from "react-router-dom";
import ProductReviewForm from "./components/review-form";
import { useQuery } from "@apollo/client";
import { READ_UNREVIEW_PRODUCT_QUERY } from "@/queries";
import { Product } from "@/types";
import { Button, Card, CardContent } from "@/components";
import { CheckCircle2 } from "lucide-react";
import { ReviewSkeleton } from "../skeletons";

export default function ReviewPage() {
	const params = useParams();
	const { loading, data } = useQuery(READ_UNREVIEW_PRODUCT_QUERY, {
		variables: {
			id: params.id,
		},
	});

	if (!params.id || loading) {
		return <ReviewSkeleton />;
	}

	if (
		!(data?.products || [])
			.map((product: Product) => product.id)
			.includes(params.id)
	) {
		return (
			<Card className="w-full max-w-md mx-auto  border-2 border-primary   rounded-xl shadow-lg overflow-hidden">
				<div className="  py-3 px-6 border-b  ">
					<h3 className="text-lg font-semibold ">Review Status</h3>
				</div>
				<CardContent className="p-6 flex flex-col items-center justify-center ">
					<div className=" p-3 rounded-full mb-4">
						<CheckCircle2 className="text-primary h-10 w-10  " />
					</div>
					<h2 className="text-xl font-bold   mb-2">Review Complete</h2>
					<p className="  text-center">
						Thank you! Your product review has been successfully submitted.
					</p>
					<Button
						asChild
						className="mt-6 px-4 py-2   text-white rounded-md   transition-colors duration-200 font-medium">
						<Link to="/flowers">Back to Products</Link>
					</Button>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="container mx-auto   pb-10">
			<h1 className="text-2xl font-bold mb-6">Write a Review</h1>
			<ProductReviewForm product={data.product} products={data.products} />
		</div>
	);
}
