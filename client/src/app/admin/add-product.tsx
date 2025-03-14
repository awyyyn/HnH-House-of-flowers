import { Helmet } from "@/components";
import ProductForm from "./components/product-form";

export default function AddProduct() {
	return (
		<>
			<Helmet title="Add Product" />
			<ProductForm />
		</>
	);
}
