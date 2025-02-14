import ProductForm from "./components/product-form";
import { Navigate, useLocation } from "react-router-dom";

export default function EditProduct() {
	const { state } = useLocation();

	if (!state.product) return <Navigate to="/products" />;

	return <ProductForm editing product={state.product} />;
}
