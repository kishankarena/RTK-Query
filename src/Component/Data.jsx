import React, { useState } from "react";
import {
  useCreateProductMutation,
  useGetAllProductsQuery,
  useGetProductQuery,
} from "../features/productAPiSlice";

const Data = () => {
  const [title, setTitle] = useState();
  // const { data, isLoading, isError } = useGetAllProductsQuery();
  // const { data: singleProduct } = useGetProductQuery("Iphone");
  const [createProduct, { isLoading, isError }] = useCreateProductMutation();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await createProduct({ title });

      setTitle("");
    } catch (error) {
      console.log("error", error);
    }
  };
  if (isLoading) return <h1>Loading.......</h1>;
  return (
    <div>
      <h1>Data Component</h1>
      {/* {console.log(singleProduct)} */}
      <div>
        <h2>Add Product</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <button type="submit" disabled={false}>
            {isLoading ? "Adding..." : "Add"}
          </button>
          {isError && <div>Error creating post</div>}
        </form>
      </div>
    </div>
  );
};

export default Data;
