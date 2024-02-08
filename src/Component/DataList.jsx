import React from "react";

import "./DataList.css";
import {
  useGetAllProductsQuery,
    useDeleteProductMutation,
} from "../features/productApiSlice";

const DataList = () => {
  const { data, isLoading, isSuccess, isFetching} = useGetAllProductsQuery();
    const [deleteProduct] = useDeleteProductMutation();

  const handleDelete = (productId) => {
    // Call the deleteProduct mutation
    deleteProduct(productId);
  };

  return (
    <div>
      {isFetching && <p>Data list Loading...</p>}
      {!isLoading && data?.products?.length === 0 && (
        <p>No products available.</p>
      )}
      {Boolean(!isFetching && isSuccess) && data?.products?.map((item) => (
        <div key={item.id} className="datalist">
          <div>
            <p>{item.title}</p>
            <button onClick={() => handleDelete(item.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DataList;
