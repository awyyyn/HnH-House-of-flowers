import { useLocation, useParams } from "react-router-dom";
import ComponentForm from "./components/component-form";
import { useQuery } from "@apollo/client";
import { READ_COMPONENT_QUERY } from "@/queries";
import { Component } from "@/types";

const AddComponent = () => {
  const { pathname } = useLocation();
  const { id } = useParams();
  const isEditing = pathname.split("/").pop() === "edit" && !!id;

  const { data } = useQuery<{ component: Component }>(READ_COMPONENT_QUERY, {
    skip: !isEditing,
    variables: { id },
  });

  return (
    <div>
      <ComponentForm isEditing={isEditing} value={data?.component} />
    </div>
  );
};

export default AddComponent;
