import { Helmet } from "@/components";
import ProductForm from "./components/product-form";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_PRODUCT_QUERY } from "@/queries";
import { Product } from "@/types";

export default function EditProduct() {
  const { id } = useParams();

  const { data, loading } = useQuery<{ product: Product }>(GET_PRODUCT_QUERY, {
    variables: { id },
  });

  // TODO: ADD LOADING UI

  if (loading) return <div>Loading...</div>;
  if (!data?.product) return <div>Product not found</div>;

  return (
    <>
      <Helmet title={`Edit ${data.product.name}`} />
      <ProductForm editing product={data?.product} />
    </>
  );
}
