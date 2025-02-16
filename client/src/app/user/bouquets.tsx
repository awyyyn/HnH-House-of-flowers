import { GET_PRODUCTS_QUERY } from "@/queries";
import { PaginationResult, Product } from "@/types";
import { useQuery } from "@apollo/client";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PaginationComponent from "./components/pagination";
import CardSkeleton from "./components/card-skeleton";
import ProductCard from "./components/product-card";

export default function Bouquets() {
	const [params] = useSearchParams();
	const [page, setPage] = useState(Number(params.get("page") ?? 1));
	const navigate = useNavigate();

	const { data, loading } = useQuery<{ products: PaginationResult<Product> }>(
		GET_PRODUCTS_QUERY,
		{
			variables: {
				category: "BOUQUET",
				pagination: {
					page: page - 1,
					limit: 10,
				},
			},
		}
	);

	if (loading) return <CardSkeleton />;

	return (
		<>
			<div className="grid grid-cols-6 sm:grid-cols-9 justify-center gap-3 sm:gap-5 lg:grid-cols-10 ">
				{data?.products.data.map((product) => (
					<ProductCard {...product} key={`product-card-${product.id}`} />
				))}
			</div>
			<div className="my-5">
				<PaginationComponent
					currentPage={page}
					onPageChange={(pg) => {
						setPage(pg);
						navigate(`/bouquets?page=${pg}`);
					}}
					pageSize={10}
					totalItems={data?.products.total ?? 0}
				/>
			</div>
		</>
	);
}
