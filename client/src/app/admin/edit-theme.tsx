import { READ_STORE_IMAGE_QUERY } from "@/queries";
import { StoreImage } from "@/types";
import { useQuery } from "@apollo/client";
import * as React from "react";
import { useParams } from "react-router-dom";
import CreateThemeForm from "./components/theme-form";

const EditTheme = () => {
  const { id } = useParams();
  const { data, loading } = useQuery<{ storeImage: StoreImage }>(
    READ_STORE_IMAGE_QUERY,
    {
      variables: { id },
    },
  );

  if (loading) return <div>Loading...</div>;

  if (!data?.storeImage) return <div>No data found</div>;

  return <CreateThemeForm defaultValue={data.storeImage} />;
};

export default EditTheme;
