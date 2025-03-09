import { useParams } from "react-router-dom";
import ProductReviewForm from "./components/review-form";
import { useQuery } from "@apollo/client";
import { READ_UNREVIEW_PRODUCT_QUERY } from "@/queries";

export default function ReviewPage() {
	// In a real app, you would fetch the product data based on the ID
	// For this example, we'll use placeholder data
	const params = useParams();
	const { loading, data } = useQuery(READ_UNREVIEW_PRODUCT_QUERY, {
		variables: {
			id: params.id,
		},
	});

	if (!params.id || loading) {
		return null;
	}

	return (
		<div className="container mx-auto   pb-10">
			<h1 className="text-2xl font-bold mb-6">Write a Review</h1>
			<ProductReviewForm product={data.product} products={data.products} />
		</div>
	);
}
