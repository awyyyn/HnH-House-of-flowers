import { Helmet, RichTextEditor } from "@/components";
import { GET_PRODUCT_QUERY } from "@/queries";
import { Product } from "@/types";
import { useQuery } from "@apollo/client";
import { useState } from "react";
import { useParams } from "react-router-dom";
import AddToCart from "./components/add-to-cart-btn";

const ProductDetails = () => {
	const { productId } = useParams();

	const [activeImg, setActiveImg] = useState("");
	const { data, loading } = useQuery<{ product: Product }>(GET_PRODUCT_QUERY, {
		variables: {
			id: productId,
		},
		onCompleted(data) {
			setActiveImg(data.product.images[0]);
		},
	});

	if (!data) return;

	if (loading) return;

	const product = data?.product;

	return (
		<>
			<Helmet title={`${data.product.name}`} />
			<div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
				<div className="lg:col-span-5  ">
					<div className="border shadow-md rounded-xl overflow-hidden relative min-w-full min-h-[350px] sm:min-h-[400px sm:h-[400px]   dark:border-transparent dark:bg-zinc-900  sm:max-w-[400px]  sm:min-w-[300px] lg:max-w-[400px] lg:max-h-[400px] lg:h-[400px] xl:max-h-[500px] xl:h-[500px] xl:w-[500px] xl:min-w-[500px] xl:max-w-[500px] mx-auto   ">
						<img
							className="absolute  inset-0 w-full h-full object-contain"
							src={activeImg}
						/>
					</div>
					<div className="w-full overflow-x-auto flex gap-2 mt-2">
						{product.images.map(
							(img) =>
								img !== activeImg && (
									<div
										className="img-card-sm cursor-pointer"
										key={img}
										onClick={() => setActiveImg(img)}>
										<img className="img" src={img} />
									</div>
								)
						)}
					</div>
				</div>
				<div className="lg:col-span-7  flex flex-col justify-between  md:px-10 xl:px-20  w-full ">
					<div className="space-y-3">
						<h1 className="text-2xl md:text-4xl font-medium flex gap-1 items-center">
							{product.name}
						</h1>

						<div className="flex gap-1">
							<p className="dark:text-white/90">Price:</p>
							<p className="font-medium capitalize">
								{Intl.NumberFormat("en-PH", {
									currency: "PHP",
									style: "currency",
								}).format(product.price)}
							</p>
						</div>
						<div className="flex gap-1">
							<p className="dark:text-white/90">Category:</p>
							<p className="font-medium capitalize">
								{product.category.toLowerCase()}
							</p>
						</div>
						<div className="flex gap-1">
							<p className="dark:text-white/90">Status:</p>
							<p className="font-medium capitalize">
								{product.stock === 0
									? "Out of stock"
									: product.status.toLowerCase().split("_").join(" ")}{" "}
								{product.stock > 0 && (
									<>
										<span className="ml-1 text-xs">x</span>
										<span className="text-md text-gray-600">
											{product.stock}
										</span>
									</>
								)}
							</p>
						</div>

						<div>
							<p className="dark:text-white/90">Description:</p>
							<RichTextEditor
								content={product.description}
								handleValue={() => {}}
								isEditing={false}
							/>
						</div>
					</div>
					<div className="flex pb-10">
						<AddToCart {...product} />
					</div>
				</div>
			</div>
			<section>
				<div className="container px-4 py-6  ">
					<h2 className="text-2xl font-bold tracking-tighter ">Reviews</h2>
				</div>
			</section>
		</>
	);
};

export default ProductDetails;
