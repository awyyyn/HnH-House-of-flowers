import { productStatusColorMap } from "@/constants";
import { Product } from "@/types";
import { Badge } from "@/components";
import { Link } from "react-router-dom";

export default function ProductCard(product: Product) {
	return (
		<Link
			key={product.id}
			to={`/${product.category.toLowerCase()}s/${product.id}`}
			className="   border border-primary/5 col-span-3       lg:col-span-2    ">
			<div className="relative bg-white dark:bg-zinc-800 h-52 sm:h-64  ">
				<img
					src={product.images[0]}
					className="  absolute h-full w-full object-contain"
				/>
				<Badge
					className="absolute bottom-2 right-2 capitalize"
					variant={productStatusColorMap[product.status]}>
					{product.status.toLowerCase().split("_").join(" ")}
				</Badge>
			</div>
			<div className="p-2">
				<h1 className="text-lg">{product.name}</h1>
				<p className="font-bold">
					{Intl.NumberFormat("en-PH", {
						style: "currency",
						currency: "PHP",
					}).format(product.price)}
				</p>
			</div>
		</Link>
	);
}
