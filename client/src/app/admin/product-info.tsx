import { Helmet, RichTextEditor } from "@/components";
import { Product } from "@/types";
import { Edit } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";

const ProductInfo = () => {
	const [activeImg, setActiveImg] = useState("");

	const { state } = useLocation();

	useEffect(() => {
		setActiveImg(state.product.images[0]);
	}, [state.product]);

	if (!state.product) {
		return <Navigate to="/products" />;
	}

	const product = state.product as Product;

	return (
		<>
			<Helmet title="Product Info" />
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
				<div className="lg:col-span-7   md:px-10 xl:px-20  w-full space-y-3">
					<h1 className="text-2xl md:text-4xl font-medium flex gap-1 items-center">
						{product.name}
						<Link to={`/products/edit/${product.id}`} state={{ product }}>
							<Edit />
						</Link>
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
							{product.status.split("_").join(" ").toLowerCase()}
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
			</div>
		</>
	);
};

export default ProductInfo;
