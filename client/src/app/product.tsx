import { RichTextEditor } from "@/components";
import { useAuth } from "@/contexts";
import { AdminLayout, UserLayout } from "@/layouts";
import { GET_PRODUCT_QUERY } from "@/queries";
import { Product as ProductT } from "@/types";
import { useQuery } from "@apollo/client";
import { useState } from "react";
import { useParams } from "react-router-dom";

export default function ProductPage() {
	const { productId } = useParams();

	const { loading, data } = useQuery(GET_PRODUCT_QUERY, {
		variables: { id: productId },
	});

	const { role } = useAuth();

	if (loading) return <div>Loading...</div>;

	return role === "USER" ? (
		<UserLayout>
			<Product {...data} />
		</UserLayout>
	) : (
		<AdminLayout>
			<Product {...data.product} />
		</AdminLayout>
	);
}

const Product = (product: ProductT) => {
	const [activeImg, setActiveImg] = useState(product.images[0]);
	return (
		<div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
			<div className="col-span-5  ">
				<div className="border shadow-md rounded-xl overflow-hidden relative min-w-full min-h-[350px] sm:min-h-[400px sm:h-[400px]   dark:border-transparent dark:bg-zinc-900  sm:max-w-[400px]  sm:min-w-[300px] md:max-w-[400px] md:max-h-[400px] md:h-[400px] lg:max-h-[500px] lg:h-[500px] lg:w-[500px] lg:min-w-[500px] lg:max-w-[500px] mx-auto   ">
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
			<div className="col-span md:px-20  w-full space-y-3">
				<h1 className="text-2xl md:text-4xl font-medium">{product.name}</h1>
				<div className="flex gap-1">
					<p className="dark:text-white/90">Category:</p>
					<p className="font-medium">
						{product.category[0]}
						{product.category.slice(1).toLocaleLowerCase()}
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
	);
};
